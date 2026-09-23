import { Router } from "express";
import rateLimit from "express-rate-limit";
import { start, verify } from "../controllers/digilockerController.js";

const router = Router();
const otpLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 10, message: { success: false, message: "Too many OTP requests, try again shortly.", code: "RATE_LIMITED" } });

router.post("/start", otpLimiter, start);
router.post("/verify", verify);

export default router;
