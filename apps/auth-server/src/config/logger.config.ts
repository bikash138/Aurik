import {
  createLogger,
  createHttpLogger,
  type Logger,
  type HttpLogger,
} from "@aurik/logger";
import { env } from "./env.config.js";

export const logger: Logger = createLogger({ env: env.NODE_ENV });
export const httpLogger: HttpLogger = createHttpLogger(logger);
