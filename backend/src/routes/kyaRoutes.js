import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { runKya } from "../controllers/kyaController.js";

const router = Router();
router.use(authenticateToken);
router.post("/run", runKya);

export default router;
