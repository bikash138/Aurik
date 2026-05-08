import { Router } from "express";
import { WellKnownHandler } from "./well-known.handler.js";

const router = Router();

router.get("/openid-configuration", WellKnownHandler.getOpenIdConfiguration);
router.get("/jwks.json", WellKnownHandler.getJwks);

export const discoveryRoutes: Router = router;
