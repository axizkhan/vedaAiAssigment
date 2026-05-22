import { logger } from '@assessment-ai/logger';

export const emitOperationalAlert = (message: string, context: Record<string, any>) => {
  logger.fatal(\`🚨 OPERATIONAL ALERT: \${message}\`, { event: 'operational_alert', ...context });
  // Future: webhook to PagerDuty/Slack
};

export const emitProviderOutageAlert = (provider: string, count: number) => {
  logger.fatal(\`🚨 PROVIDER OUTAGE: \${provider} has failed \${count} times recently.\`, { event: 'provider_alert', provider, count });
  // Future: webhook to Slack #incidents
};

export const emitValidationRegressionAlert = (count: number) => {
  logger.error(\`⚠️ VALIDATION REGRESSION: Schema validation failed \${count} times recently.\`, { event: 'validation_alert', count });
};
