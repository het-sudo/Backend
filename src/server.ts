import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { logger } from "./common/utils/loggers.js";

const bootstrap = async () => {
  try {
    await connectDB();
    logger.info("Database connected successfully");
    const PORT = env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(` Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Bootstrap failed:", error);
    process.exit(1);
  }
};

bootstrap();
