export async function simulateSubmitAssignment(data: {
  title: string;
  subject: string;
  description?: string;
  file: File | null;
  questions: { type: string; count: number; marks: number }[];
  prompt: string;
}): Promise<{ id: string }> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { id: `assign-${Date.now()}` };
}
