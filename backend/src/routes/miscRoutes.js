import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getDashboard, listNotifications, markNotificationRead, matchIncentives, ragAsk,
} from "../controllers/miscController.js";

const router = Router();
router.use(authenticateToken);
router.get("/dashboard", getDashboard);
router.get("/notifications", listNotifications);
router.patch("/notifications/:id/read", markNotificationRead);
router.get("/incentives", matchIncentives);
router.post("/rag/ask", ragAsk);

export default router;
