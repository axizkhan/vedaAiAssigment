import { AssignmentEventMetadata } from '../types/assignment-event-metadata.types';
import { AssignmentTraceContext } from '../types/assignment-event.types';

export function buildEventTrace(metadata?: AssignmentEventMetadata, trace?: AssignmentTraceContext): AssignmentTraceContext {
  return {
    traceId: trace?.traceId ?? (typeof metadata?.traceId === 'string' ? metadata.traceId : undefined),
    jobId: trace?.jobId ?? (typeof metadata?.jobId === 'string' ? metadata.jobId : undefined),
    workerId: trace?.workerId ?? (typeof metadata?.workerId === 'string' ? metadata.workerId : undefined),
    requestId: trace?.requestId ?? (typeof metadata?.requestId === 'string' ? metadata.requestId : undefined),
  };
}

export function attachEventTrace(metadata: AssignmentEventMetadata = {}, trace?: AssignmentTraceContext): AssignmentEventMetadata {
  const builtTrace = buildEventTrace(metadata, trace);
  return Object.fromEntries(
    Object.entries({ ...metadata, ...builtTrace }).filter(([, value]) => value !== undefined && value !== null && value !== '')
  ) as AssignmentEventMetadata;
}
