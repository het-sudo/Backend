import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../common/utils/loggers.js";

/**
 * Connects to MongoDB database using URI from environment variables
 */
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Database Connection Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
