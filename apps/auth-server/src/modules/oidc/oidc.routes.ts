import { Router } from "express";
import { AuthorizeHandler } from "./authorize/authorize.handler.js";
import { ConsentHandler } from "./consent/consent.handler.js";
import { attachSession } from "@/core/middlewares/session.middleware.js";
import { TokenHandler } from "./token/token.handler.js";
import { validateAccessToken } from "@/core/middlewares/accessToken.middleware.js";
import { UserinfoHandler } from "./userinfo/userinfo.handler.js";

const router = Router();

router.get("/authorize", attachSession, AuthorizeHandler.authorize);
router.get("/consent-session", attachSession, ConsentHandler.getConsentSession);
router.post("/consent", attachSession, ConsentHandler.consent);
router.post("/token", TokenHandler.token);
router.post("/token/revoke", TokenHandler.revoke);
router.get("/userinfo", validateAccessToken, UserinfoHandler.userinfo);

export const oidcRoutes: Router = router;
