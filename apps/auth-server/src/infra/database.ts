import { prisma } from "@aurik/database";
import { createLogger } from "@aurik/logger";
import { env } from "@/config/env.config.js";

const logger = createLogger({ env: env.NODE_ENV });

export class Database {
  public static async connect() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      logger.info("PostgreSQL connected successfully");
    } catch (error) {
      logger.fatal({ err: error }, "PostgreSQL connection failed");
      throw error;
    }
  }
}
