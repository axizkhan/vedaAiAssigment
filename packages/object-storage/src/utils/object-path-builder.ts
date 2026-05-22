import { sanitizeObjectName } from './sanitize-object-name';

export const objectPathBuilder = {
  assignmentUpload: (userId: string, assignmentId: string, filename: string): string => {
    const safeFilename = sanitizeObjectName(filename);
    const timestamp = Date.now();
    return \`assignments/\${userId}/\${assignmentId}/source/\${timestamp}-\${safeFilename}\`;
  },
  generatedPaper: (assignmentId: string, version: number): string => {
    return \`papers/\${assignmentId}/versions/\${version}/paper.pdf\`;
  },
  exportArchive: (userId: string): string => {
    const date = new Date().toISOString().split('T')[0];
    return \`exports/\${userId}/\${date}/\${Date.now()}-export.zip\`;
  }
};
