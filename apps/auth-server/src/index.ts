import { env } from "@/config/env.config.js";
import { Database } from "@/infra/database.js";
import { AppServer } from "./server.js";
import { logger } from "@/config/logger.config.js";

async function bootstrap() {
  try {
    logger.info("Starting Auth Server");

    await Database.connect();

    const server = new AppServer();
    server.start(env.PORT);
  } catch (error) {
    logger.fatal({ err: error }, "Auth Server bootup failed");
    process.exit(1);
  }
}

bootstrap();
