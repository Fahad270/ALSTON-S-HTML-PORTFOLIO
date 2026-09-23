import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { startConnection, verifyConnection, documents } from "../controllers/entitylockerController.js";

const router = Router();
router.use(authenticateToken);
router.post("/connect/start", startConnection);
router.post("/connect/verify", verifyConnection);
router.get("/documents", documents);

export default router;
