import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { requestConsent, respondConsent } from "../controllers/consentController.js";

const router = Router();
router.use(authenticateToken);
router.post("/request", requestConsent);
router.post("/respond", respondConsent);

export default router;
