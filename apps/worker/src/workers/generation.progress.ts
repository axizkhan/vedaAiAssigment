import { Job } from 'bullmq';
import { GenerationProgress } from './generation.types';
import { WORKER_GENERATION_EVENTS } from './generation.events';

// Stub for websocket emitter
const webSocketEmitter = { emit: (event: string, payload: any) => {} };

export const PROGRESS_STEPS: GenerationProgress[] = [
  { step: 1, percent: 10, message: 'Analyzing assignment details...' },
  { step: 2, percent: 25, message: 'Processing reference material...' },
  { step: 3, percent: 40, message: 'Building structured prompt...' },
  { step: 4, percent: 60, message: 'Generating questions with AI...' },
  { step: 5, percent: 80, message: 'Validating output structure...' },
  { step: 6, percent: 90, message: 'Storing generated paper...' },
  { step: 7, percent: 100, message: 'Complete!' }
];

export const emitProgress = async (
  job: Job,
  stepIndex: number,
  assignmentId: string,
  traceId: string
) => {
  if (stepIndex < 0 || stepIndex >= PROGRESS_STEPS.length) return;
  
  const stepData = PROGRESS_STEPS[stepIndex];

  // 1. Update BullMQ native progress
  await job.updateProgress(stepData);

  // 2. Emit WebSocket event to frontend
  webSocketEmitter.emit(WORKER_GENERATION_EVENTS.PROGRESS, {
    assignmentId,
    traceId,
    timestamp: new Date().toISOString(),
    percent: stepData.percent,
    message: stepData.message
  });
};
