export const healthChecks = {
  runAll: async () => {
    return {
      database: 'healthy',
      redis: 'healthy',
      storage: 'healthy',
      queue: 'healthy'
    };
  }
};
