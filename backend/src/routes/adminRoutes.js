import { Router } from "express";
import {
  getDashboard,
  listApplications,
  getApplication,
  updateApplicationStatus,
  listDepartments,
  listRules,
  createRule,
  runSimulation,
  getSlaMonitor,
  sendSlaReminders,
  listEscalations,
  getEscalationEvidence,
  grantDeemedApproval,
  listUsers,
  createUser,
  updateUser,
  listNotifications,
} from "../controllers/adminController.js";

const router = Router();

router.get("/dashboard", getDashboard);
router.get("/applications", listApplications);
router.get("/applications/:id", getApplication);
router.patch("/applications/:id/status", updateApplicationStatus);
router.get("/departments", listDepartments);
router.get("/rules", listRules);
router.post("/rules", createRule);
router.post("/rules/simulate", runSimulation);
router.get("/sla", getSlaMonitor);
router.post("/sla/reminders", sendSlaReminders);
router.get("/escalations", listEscalations);
router.get("/escalations/:id/evidence", getEscalationEvidence);
router.post("/escalations/:id/deemed-approval", grantDeemedApproval);
router.get("/users", listUsers);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.get("/notifications", listNotifications);

export default router;
