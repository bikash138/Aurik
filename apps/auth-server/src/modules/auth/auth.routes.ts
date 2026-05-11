import { Router } from "express";
import { AuthHandler } from "./auth.handler.js";

const router = Router();

router.post("/signup", AuthHandler.signup);
router.post("/signin", AuthHandler.signin);
router.post("/verify-email", AuthHandler.verifyEmail);
router.post("/forgot-password", AuthHandler.forgotPassword);
router.post("/reset-password", AuthHandler.resetPassword);
router.post("/signout", AuthHandler.signout);
router.get("/me", AuthHandler.getMe);

export const authRoutes: Router = router;
