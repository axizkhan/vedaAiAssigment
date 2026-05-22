export const paperPdfService = {
  checkIfExists: async (assignmentId: string, version: number) => false,
  updatePdfUrl: async (assignmentId: string, version: number, url: string) => true
};
