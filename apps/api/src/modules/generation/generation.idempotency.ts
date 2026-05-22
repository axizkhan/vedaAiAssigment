import { redisConnection } from '@assessment-ai/queue/src/redis.connection'; // Shared connection
import { GenerationLock } from './generation.types';
import { GENERATION_CONSTANTS } from './generation.constants';
import { GenerationLockError } from './generation.errors';

const getLockKey = (assignmentId: string) => \`\${GENERATION_CONSTANTS.LOCK_PREFIX}\${assignmentId}\`;

export const acquireGenerationLock = async (
  assignmentId: string, 
  traceId: string, 
  userId: string
): Promise<boolean> => {
  const lockKey = getLockKey(assignmentId);
  const lockValue: GenerationLock = {
    assignmentId,
    traceId,
    userId,
    timestamp: Date.now()
  };

  // SET NX EX enforces atomic "set if not exists" with a TTL
  const result = await redisConnection.set(
    lockKey,
    JSON.stringify(lockValue),
    'EX',
    GENERATION_CONSTANTS.LOCK_TTL_SECONDS,
    'NX'
  );

  return result === 'OK';
};

export const releaseGenerationLock = async (assignmentId: string, traceId: string): Promise<boolean> => {
  const lockKey = getLockKey(assignmentId);
  
  // Lua script ensures we ONLY delete the lock if we are the process that acquired it (matching traceId)
  // This prevents accidentally unlocking a retry attempt from another process
  const luaScript = \`
    const currentStr = redis.call("get", KEYS[1])
    if currentStr then
      local current = cjson.decode(currentStr)
      if current.traceId == ARGV[1] then
        return redis.call("del", KEYS[1])
      end
    end
    return 0
  \`;

  const result = await redisConnection.eval(luaScript, 1, lockKey, traceId);
  return result === 1;
};

// Orchestration Wrapper
export const withGenerationLock = async <T>(
  assignmentId: string,
  traceId: string,
  userId: string,
  operation: () => Promise<T>
): Promise<T> => {
  const acquired = await acquireGenerationLock(assignmentId, traceId, userId);
  
  if (!acquired) {
    throw new GenerationLockError(\`Another generation process is concurrently starting for assignment \${assignmentId}\`);
  }

  try {
    return await operation();
  } finally {
    await releaseGenerationLock(assignmentId, traceId);
  }
};
