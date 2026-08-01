import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import jobService from "../services/job.service";
import ApiResponse from "../utils/ApiResponse";

class JobController {
  // Create Job
  createJob = asyncHandler(async (req: Request, res: Response) => {
    const { name, email } = req.body;

    const job = await jobService.createJob({
      name,
      email,
    });

    return res.status(201).json(
      new ApiResponse(201, job, "Job added to queue successfully")
    );
  });

  // Get All Jobs
  getAllJobs = asyncHandler(async (_req: Request, res: Response) => {
    const jobs = await jobService.getAllJobs();

    return res.status(200).json(
      new ApiResponse(200, jobs, "Jobs fetched successfully")
    );
  });

  // Get Job By Id
  getJobById = asyncHandler(async (req: Request, res: Response) => {
  const id  =req.params.id as string;

  const job = await jobService.getJobById(id);

  return res.status(200).json(
    new ApiResponse(200, job, "Job fetched successfully")
  );
});
}

export default new JobController();