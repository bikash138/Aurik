import { Router } from "express";
import { AuthorizeHandler } from "./authorize/authorize.handler.js";
import { ConsentHandler } from "./consent/consent.handler.js";
import { attachSession } from "@/core/middlewares/session.middleware.js";
import { TokenHandler } from "./token/token.handler.js";

const router = Router();

router.get("/authorize", attachSession, AuthorizeHandler.authorize);
router.get("/consent-session", attachSession, ConsentHandler.getConsentSession);
router.post("/consent", attachSession, ConsentHandler.consent);
router.post("/token", TokenHandler.token);

export const oidcRoutes: Router = router;
