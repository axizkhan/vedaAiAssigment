import { logger } from '@assessment-ai/logger';

export const auditWorkerEvent = (eventName: string, traceId: string, details: Record<string, any> = {}) => {
  logger.info(\`Worker Audit: \${eventName}\`, {
    event: \`worker_audit_\${eventName}\`,
    traceId,
    ...details
  });
};
