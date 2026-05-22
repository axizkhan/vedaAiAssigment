import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { generationQueue, deadLetterQueue, pdfQueue } from '@assessment-ai/queue';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/api/v1/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(generationQueue),
    new BullMQAdapter(pdfQueue),
    new BullMQAdapter(deadLetterQueue)
  ],
  serverAdapter: serverAdapter
});

export const bullBoardRouter = serverAdapter.getRouter();
