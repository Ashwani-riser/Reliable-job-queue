import { Router } from "express";
import jobController from "../controllers/job.controller";

const router = Router();

router.post("/", jobController.createJob);
router.get("/", jobController.getAllJobs);
router.get("/:id", jobController.getJobById);

export default router;