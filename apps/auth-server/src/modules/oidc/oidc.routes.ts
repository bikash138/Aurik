import { Router } from "express";
import { AuthorizeHandler } from "./authorize/authorize.handler.js";
import { ConsentHandler } from "./consent/consent.handler.js";
import { attachSession } from "@/core/middlewares/session.middleware.js";

const router = Router();

router.get("/authorize", attachSession, AuthorizeHandler.authorize);
router.get("/consent-session", attachSession, ConsentHandler.getConsentSession);
router.post("/consent", attachSession, ConsentHandler.consent);

export const oidcRoutes: Router = router;
