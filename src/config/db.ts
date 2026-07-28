import mongoose from "mongoose";
import { env } from "./env";
import logger from "../loggers/logger";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);

    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.fatal({ error }, "Failed to connect to MongoDB");
    process.exit(1);
  }
};

export default connectDB;