//producer hai ya ,producer ka kam hai ki job ko queue me dalna. 


import { jobQueue } from "../queues/job.queue";

export interface CreateJobData {
  name: string;
  email: string;
}

class JobService {
  async createJob(data: CreateJobData) {
    const job = await jobQueue.add("send-email", data);

    return job;
  }
}

export default new JobService();