import { pino, Logger } from "pino";
import { pinoHttp } from "pino-http";
import { randomBytes } from "node:crypto";
import type { IncomingMessage } from "node:http";
export type { Logger } from "pino";
export type { HttpLogger } from "pino-http";

function getRequestPath(req: IncomingMessage): string {
  // @ts-expect-error
  const frameworkUrl = req.originalUrl as string | undefined;

  return (
    frameworkUrl ??
    (req.headers["x-original-url"] as string) ??
    (req.headers["x-forwarded-path"] as string) ??
    req.url ??
    "/"
  );
}

function generateShortId(): string {
  return randomBytes(4).toString("hex");
}

export interface LoggerFactoryOptions {
  env: string;
}

export function createLogger(options: LoggerFactoryOptions): Logger {
  const isDev = options.env !== "production";

  return pino({
    level: isDev ? "debug" : "info",
    transport: isDev
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
            ignore: "pid,hostname",
          },
        }
      : undefined,
  });
}

export function createHttpLogger(baseLogger: Logger) {
  return pinoHttp({
    logger: baseLogger,
    genReqId: (req: IncomingMessage) => {
      // @ts-expect-error
      const frameworkId = req.requestId as string | undefined;
      return frameworkId ?? req.headers["x-request-id"] ?? generateShortId();
    },
    customSuccessMessage: (req, res, responseTime) =>
      `${req.method} ${getRequestPath(req)} ${res.statusCode} ${responseTime}ms`,
    serializers: {
      req: () => undefined,
      res: () => undefined,
    },
  });
}
