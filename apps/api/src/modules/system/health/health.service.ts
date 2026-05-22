import { healthChecks } from './health.checks';
import { logger } from '@assessment-ai/logger';

export const healthService = {
  getSystemHealth: async () => {
    const checks = await healthChecks.runAll();
    const isUnhealthy = Object.values(checks).some(c => c === 'unhealthy');
    const isDegraded = Object.values(checks).some(c => c === 'degraded');
    
    const status = isUnhealthy ? 'unhealthy' : isDegraded ? 'degraded' : 'ok';
    
    if (status !== 'ok') {
      logger.warn('System health is ' + status);
    }
    
    return {
      status,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      services: checks
    };
  }
};
