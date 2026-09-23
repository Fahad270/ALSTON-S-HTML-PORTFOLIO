import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { matchAgainstKya, uploadToVault, listVaultDocuments } from "../controllers/documentsController.js";

const router = Router();
router.use(authenticateToken);
router.get("/match", matchAgainstKya);       // ?source=ENTITYLOCKER|SETU_VAULT
router.post("/vault", uploadToVault);
router.get("/vault", listVaultDocuments);

export default router;
