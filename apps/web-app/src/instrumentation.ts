export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      console.log("[BOOT] Validating environment variables...");
      await import("@/config/env.config");

      const { prisma } = await import("@aurik/database");
      await prisma.$connect();
      console.log("[BOOT] Database connected successfully");
    } catch (error) {
      console.error("[BOOT] Server bootup failed:", error);
      throw error;
    }
  }
}
