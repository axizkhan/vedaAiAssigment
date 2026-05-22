// Stub for the Database layer
export const FailedGenerationRepo = {
  create: async (record: Record<string, any>) => {
    // Real implementation would save to MongoDB 'failed_generations' collection
    return 'new_failure_record_id';
  }
};
