import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { logger, httpLogger } from "@/config/logger.config.js";
import { env } from "./config/env.config.js";
import { authRoutes } from "./modules/auth/auth.router.js";
import { errorMiddleware } from "@/core/middlewares/error.middleware.js";
import { discoveryRoutes } from "./modules/oidc/well-known/well-known.routes.js";

export class AppServer {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(httpLogger);
    this.app.use(
      cors({
        origin: [env.AUTH_UI_URL],
        credentials: true,
      }),
    );
    // this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes() {
    this.app.get("/health", (req, res) => {
      res.status(200).json({ status: "healthy", timestamp: new Date() });
    });
    this.app.use("/.well-known", discoveryRoutes);
    // this.app.use("/o", oidcRoutes);
    this.app.use("/auth", authRoutes);
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public start(port: string | number) {
    this.app.listen(port, () => {
      logger.info(`Auth Server running smoothly on port ${port}`);
    });
  }
}
