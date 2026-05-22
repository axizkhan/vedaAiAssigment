export interface RawAIResponse {
  content: string;
  model: string;
  provider: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
  durationMs: number;
}
export interface AIProvider {
  generatePaper(input: any): Promise<RawAIResponse>;
}
