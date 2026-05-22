import { logger } from '@assessment-ai/logger';

export const auditDlqEvent = (eventName: string, traceId: string, details: Record<string, any> = {}) => {
  logger.info(\`DLQ Audit: \${eventName}\`, {
    event: \`dlq_audit_\${eventName}\`,
    traceId,
    ...details
  });
};
