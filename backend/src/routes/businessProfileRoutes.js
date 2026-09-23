import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { saveBusinessProfile, getBusinessProfile } from "../controllers/businessProfileController.js";

const router = Router();
router.use(authenticateToken);
router.post("/", saveBusinessProfile);
router.get("/", getBusinessProfile);

export default router;
