import { AssignmentEventRepository } from '../repositories/assignment-event.repository';
import { AssignmentEventAccessScope, AssignmentEventLeanDocument } from '../types/assignment-event.types';

export interface AssignmentTrace {
  traceId: string;
  events: AssignmentEventLeanDocument[];
  jobIds: string[];
  workerIds: string[];
  requestIds: string[];
  hasFailures: boolean;
}

function uniqueStrings(values: unknown[]): string[] {
  return Array.from(new Set(values.filter((value): value is string => typeof value === 'string' && value.length > 0)));
}

export class AssignmentTraceService {
  static async getTrace(traceId: string, scope?: AssignmentEventAccessScope): Promise<AssignmentTrace> {
    const events = await AssignmentEventRepository.findByTraceId(traceId, scope);
    return {
      traceId,
      events,
      jobIds: uniqueStrings(events.map((event) => event.metadata?.jobId)),
      workerIds: uniqueStrings(events.map((event) => event.metadata?.workerId)),
      requestIds: uniqueStrings(events.map((event) => event.metadata?.requestId)),
      hasFailures: events.some((event) => event.action === 'failed_generation'),
    };
  }

  static async getJobTrace(jobId: string, scope?: AssignmentEventAccessScope): Promise<AssignmentEventLeanDocument[]> {
    return AssignmentEventRepository.paginateEvents({ jobId, ...scope, limit: 100 }).then((page) => page.data.reverse());
  }
}
