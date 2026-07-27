import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import routes from "./routes";
import errorHandler from "./middlewares/error.middleware";

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Register all routes
app.use("/api/v1", routes);

// Error handler (always last)
app.use(errorHandler);

export default app;