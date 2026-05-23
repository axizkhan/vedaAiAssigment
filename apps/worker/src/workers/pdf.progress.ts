export const PdfProgress = {
  updateStatus: async (jobId: string, status: string, progressPercent: number) => {
    // Bridges to BullMQ job.updateProgress() or similar
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Progress] Job ${jobId}: ${status} (${progressPercent}%)`);
    }
  }
};
