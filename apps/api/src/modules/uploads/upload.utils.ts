export const generateObjectKey = (userId: string, assignmentId: string, originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalName.substring(originalName.lastIndexOf('.')).toLowerCase();
  
  // Example: assignments/123/456/source/1678901234-abcd12.pdf
  return \`assignments/\${userId}/\${assignmentId}/source/\${timestamp}-\${random}\${ext}\`;
};
