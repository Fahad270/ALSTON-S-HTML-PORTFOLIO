import crypto from "crypto";
import jwt from "jsonwebtoken";
import { getModels } from "../models/registry.js";
import { NotificationService } from "../services/notifications/NotificationService.js";
import { DigiLockerAdapter } from "../services/digilocker/DigiLockerAdapter.js";
import { logAudit, EVENT_TYPES } from "../services/audit/auditLogger.js";

const hash = (v) => crypto.createHash("sha256").update(v).digest("hex");

// Step 1: name + Aadhaar (12-digit demo) + phone → send mock OTP.
export async function start(req, res, next) {
  try {
    const { name, aadhaar, phone } = req.body;
    if (!name || !phone || !/^\d{12}$/.test(aadhaar || "")) {
      return res.status(400).json({ success: false, message: "name, phone and a 12-digit demo aadhaar are required", code: "VALIDATION" });
    }
    const { OtpSession } = getModels();
    const mockOtp = process.env.MOCK_OTP || "1111";

    await OtpSession.create({
      identifier: `digilocker:${phone}`,
      channel: "sms",
      otpHash: hash(mockOtp),
      purpose: "DIGILOCKER_IDENTITY",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await NotificationService.sendOTP(phone, "sms", mockOtp);

    res.json({ success: true, data: { message: "OTP sent successfully.", mode: "DEMO" } });
  } catch (err) { next(err); }
}

// Step 2: verify OTP → create/find the user, issue JWT, return a
// DigiLocker-shaped identity payload.
export async function verify(req, res, next) {
  try {
    const { name, aadhaar, phone, otp } = req.body;
    const { OtpSession, User } = getModels();

    const session = await OtpSession.findOne({ identifier: `digilocker:${phone}`, verified: false }).sort({ createdAt: -1 });
    if (!session) return res.status(400).json({ success: false, message: "No active DigiLocker verification in progress", code: "NO_OTP" });
    if (session.expiresAt < new Date()) return res.status(400).json({ success: false, message: "OTP expired", code: "OTP_EXPIRED" });
    if (hash(otp) !== session.otpHash) return res.status(400).json({ success: false, message: "Incorrect OTP", code: "OTP_MISMATCH" });

    session.verified = true;
    await session.save();

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        name, phone,
        email: `${phone}@digilocker.demo`, // placeholder — DigiLocker identity here carries no email
        aadhaarLast4: aadhaar.slice(-4),
        aadhaarHash: hash(aadhaar),
        isVerified: true,
      });
      await logAudit(EVENT_TYPES.USER_CREATED, { userId: user._id, metadata: { via: "DIGILOCKER_MOCK" } });
    }

    const identity = DigiLockerAdapter.mockUserDetails({ name: user.name, mobile: user.phone });
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1d" });

    res.json({ success: true, data: { token, user: { id: user._id, name: user.name, phone: user.phone }, identity } });
  } catch (err) { next(err); }
}
