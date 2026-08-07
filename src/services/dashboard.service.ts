import Job, { JobStatus } from "../models/job.model";

class DashboardService {
  async getStats() {
    const [
      totalJobs,
      queued,
      processing,
      completed,
      failed,
      dlq,
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: JobStatus.QUEUED }),
      Job.countDocuments({ status: JobStatus.PROCESSING }),
      Job.countDocuments({ status: JobStatus.COMPLETED }),
      Job.countDocuments({ status: JobStatus.FAILED }),
      Job.countDocuments({ status: JobStatus.DLQ }),
    ]);

    return {
      totalJobs,
      queued,
      processing,
      completed,
      failed,
      dlq,
    };
  }
}

export default new DashboardService();