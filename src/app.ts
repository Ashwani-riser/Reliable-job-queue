import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import swaggerUi from "swagger-ui-express";

import routes from "./routes";
import errorHandler from "./middlewares/error.middleware";
import { serverAdapter } from "./config/bullBoard";
import swaggerSpec from "./config/swagger";

const app = express();

// -------------------------
// Middlewares
// -------------------------
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// -------------------------
// API Routes
// -------------------------
app.use("/api/v1", routes);

// // -------------------------
// // Swagger Documentation
// // -------------------------
// app.use(
//   "/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerSpec, {
//     explorer: true,
//     customSiteTitle: "Job Queue API Docs",
//   })
// );

// -------------------------
// Bull Board Dashboard
// -------------------------
app.use("/admin/queues", serverAdapter.getRouter());

// -------------------------
// Error Handler (Always Last)
// -------------------------
app.use(errorHandler);

export default app;