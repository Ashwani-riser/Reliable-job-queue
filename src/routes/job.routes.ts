import { Router } from "express";
import jobController from "../controllers/job.controller";

const router = Router();

router.post("/", jobController.createJob);
router.get("/", jobController.getAllJobs);
router.get("/:id", jobController.getJobById);
router.post("/:id/retry", jobController.retryJob);

export default router;