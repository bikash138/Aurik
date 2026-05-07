import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.string().default("8080"),
  AUTH_SERVER_BASE_URL: z.url(),
  AUTH_UI_URL: z.url(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.url(),
  ENCRYPTION_KEY: z.string(),
  RESEND_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid or Missing ENV variables:\n");
  parsed.error.issues.forEach((err) => {
    console.error(`   • [${err.path.join(".")}] -> ${err.message}`);
  });
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
