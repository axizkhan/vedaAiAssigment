export interface RenderContext {
  assignmentId: string;
  version: number;
  traceId: string;
  jobId: string;
}

export interface HeaderFooterData {
  title: string;
  institutionName?: string;
  courseCode?: string;
  semester?: string;
  version?: number;
}
