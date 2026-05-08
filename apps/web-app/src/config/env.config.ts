import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.url(),

  //S3 Configuration
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string().default("auto"),
  AWS_ENDPOINT_URL_S3: z.string().url(),
  AWS_ENDPOINT_URL_IAM: z.string().url().optional(),
  S3_BUCKET_NAME: z.string(),
});

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_ENDPOINT_URL_S3: process.env.AWS_ENDPOINT_URL_S3,
  AWS_ENDPOINT_URL_IAM: process.env.AWS_ENDPOINT_URL_IAM,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
});

if (!parsed.success) {
  console.error("Invalid or Missing ENV variables in web-app:\n");
  parsed.error.issues.forEach((err) => {
    console.error(`   • [${err.path.join(".")}] -> ${err.message}`);
  });
  if (process.env.NODE_ENV !== "production") {
    throw new Error("Invalid environment variables");
  }
}

export const env = parsed.success
  ? parsed.data
  : ({} as z.infer<typeof envSchema>);
export type Env = typeof env;
