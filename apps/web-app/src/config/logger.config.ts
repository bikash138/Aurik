import { createLogger } from "@aurik/logger";

export const logger = createLogger({
  env: process.env.NODE_ENV || "development",
});
