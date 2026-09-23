import { Router } from "express";
import rateLimit from "express-rate-limit";
import { signup, sendOtp, verifyOtp, login, me, logout } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();
const otpLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 10, message: { success: false, message: "Too many OTP requests, try again shortly.", code: "RATE_LIMITED" } });

router.post("/signup", signup);
router.post("/send-otp", otpLimiter, sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateToken, me);

export default router;
