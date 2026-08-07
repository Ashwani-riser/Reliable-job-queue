import { Router } from "express";
import healthRoutes from "./health.routes";
import jobRoutes from "./job.routes";
import dashboardRoutes from "./dashboard.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/jobs", jobRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;