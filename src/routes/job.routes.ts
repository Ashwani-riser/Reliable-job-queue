import { Router } from "express";
import jobController from "../controllers/job.controller";

const router = Router();

router.post("/", jobController.createJob);
router.get("/", jobController.getAllJobs);

export default router;