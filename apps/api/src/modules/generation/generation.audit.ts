import { logger } from '@assessment-ai/logger';

export const auditGenerationEvent = (
  eventName: string,
  assignmentId: string,
  userId: string,
  traceId: string,
  details: Record<string, any> = {}
) => {
  logger.info(\`Generation Audit: \${eventName}\`, {
    event: \`audit_\${eventName}\`,
    assignmentId,
    userId,
    traceId,
    ...details
  });
};
