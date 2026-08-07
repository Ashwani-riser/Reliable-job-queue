import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";

import { jobQueue } from "../queues/job.queue";
import { dlqQueue } from "../queues/dlq.queue";

const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [
    new BullMQAdapter(jobQueue),
    new BullMQAdapter(dlqQueue),
  ],
  serverAdapter,
});

export { serverAdapter };