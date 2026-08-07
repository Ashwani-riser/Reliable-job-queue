import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import routes from "./routes";
import errorHandler from "./middlewares/error.middleware";
import { serverAdapter } from "./config/bullBoard";

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// API Routes
app.use("/api/v1", routes);

// Bull Board Dashboard
app.use("/admin/queues", serverAdapter.getRouter());

// Error Handler (Always Last)
app.use(errorHandler);

export default app;