import crypto from "crypto";
import { EntityLockerAdapter } from "../services/entitylocker/EntityLockerAdapter.js";
import { logAudit, EVENT_TYPES } from "../services/audit/auditLogger.js";
import { getModels } from "../models/registry.js";
import { NotificationService } from "../services/notifications/NotificationService.js";

const hash = (v) => crypto.createHash("sha256").update(v).digest("hex");

// Step 1: user picked "I already have an EntityLocker account" and chose
// their entity type. This mirrors the real acr parameter on the authorize
// step — it decides whether they'll be asked for a PAN, CIN or Udyam number.
export async function startConnection(req, res, next) {
  try {
    const { entityType } = req.body;
    if (!entityType) return res.status(400).json({ success: false, message: "entityType is required", code: "VALIDATION" });

    const { OtpSession } = getModels();
    const mockOtp = process.env.MOCK_OTP || "1111";
    const identifier = `entitylocker:${req.user.userId}`;

    await OtpSession.create({
      identifier,
      channel: "sms",
      otpHash: hash(mockOtp),
      purpose: "ENTITYLOCKER_CONNECT",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await NotificationService.sendOTP(identifier, "sms", mockOtp);

    const result = EntityLockerAdapter.startConnection(entityType);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

// Step 2: user entered their PAN/CIN/Udyam + the mock OTP. On success,
// "connects" and returns entity details + the 10 seeded issued documents —
// standing in for the real Get Access Token → Get Entity Details sequence.
export async function verifyConnection(req, res, next) {
  try {
    const { idNumber, otp } = req.body;
    if (!idNumber || !otp) return res.status(400).json({ success: false, message: "idNumber and otp are required", code: "VALIDATION" });

    const { OtpSession, BusinessProfile } = getModels();
    const identifier = `entitylocker:${req.user.userId}`;
    const session = await OtpSession.findOne({ identifier, verified: false }).sort({ createdAt: -1 });
    if (!session) return res.status(400).json({ success: false, message: "No active EntityLocker verification in progress", code: "NO_OTP" });
    if (session.expiresAt < new Date()) return res.status(400).json({ success: false, message: "OTP expired, restart the connection", code: "OTP_EXPIRED" });
    if (hash(otp) !== session.otpHash) return res.status(400).json({ success: false, message: "Incorrect OTP", code: "OTP_MISMATCH" });

    session.verified = true;
    await session.save();

    const result = await EntityLockerAdapter.verifyConnection();
    const documents = await EntityLockerAdapter.getIssuedDocuments();

    const profile = await BusinessProfile.findOne({ userId: req.user.userId });
    await logAudit(EVENT_TYPES.ENTITYLOCKER_CONNECTED, {
      userId: req.user.userId,
      businessId: profile?._id,
      metadata: { idNumberProvided: true, documentCount: documents.length },
    });

    res.json({ success: true, data: { ...result, documents } });
  } catch (err) { next(err); }
}

export async function documents(req, res, next) {
  try {
    const docs = await EntityLockerAdapter.getIssuedDocuments();
    res.json({ success: true, data: docs });
  } catch (err) { next(err); }
}
