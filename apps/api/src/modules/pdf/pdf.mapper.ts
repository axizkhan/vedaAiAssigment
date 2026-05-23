// Stubs for mapping DB entities to DTOs if required
export const mapVersionToPdfMeta = (versionDoc: any) => {
  return {
    assignmentId: versionDoc.assignmentId,
    version: versionDoc.version,
    pdfS3Key: versionDoc.pdfS3Key || null,
    pdfGeneratedAt: versionDoc.pdfGeneratedAt || null,
  };
};
