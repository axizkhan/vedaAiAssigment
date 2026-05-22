export const generateTraceId = (assignmentId: string): string => {
  return \`gen_\${Date.now()}_\${assignmentId}\`;
};
