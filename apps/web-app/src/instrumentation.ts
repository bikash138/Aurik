export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { logger } = await import("@/config/logger.config");

    try {
      logger.info("Validating environment variables...");
      await import("@/config/env.config");

      const { prisma } = await import("@aurik/database");
      await prisma.$connect();
      logger.info("Database connected successfully");
    } catch (error) {
      logger.error({ err: error }, "Server bootup failed");
      throw error;
    }
  }
}
