import crypto from "crypto";
import jwt from "jsonwebtoken";
import { getModels } from "../models/registry.js";
import { NotificationService } from "../services/notifications/NotificationService.js";
import { logAudit, EVENT_TYPES } from "../services/audit/auditLogger.js";

const hash = (v) => crypto.createHash("sha256").update(v).digest("hex");

// In-memory holding area for signup fields between /signup and /verify-otp,
// keyed by email. A real build would persist this as a "pending user" doc;
// fine for a demo where the process doesn't restart mid-flow.
const pendingSignups = new Map();

export async function signup(req, res, next) {
  try {
    const { name, phone, email, aadhaar, otpChannel } = req.body;
    if (!name || !phone || !email || !aadhaar) {
      return res.status(400).json({ success: false, message: "name, phone, email and aadhaar are required", code: "VALIDATION" });
    }
    if (!/^\d{12}$/.test(aadhaar)) {
      return res.status(400).json({ success: false, message: "Aadhaar must be a 12-digit demo number", code: "VALIDATION" });
    }
    pendingSignups.set(email.toLowerCase(), {
      name, phone, email: email.toLowerCase(),
      aadhaarLast4: aadhaar.slice(-4),
      aadhaarHash: hash(aadhaar),
      otpChannel: otpChannel || "email",
    });
    res.json({ success: true, data: { message: "Details captured. Request an OTP next." } });
  } catch (err) { next(err); }
}

export async function sendOtp(req, res, next) {
  try {
    const { identifier, purpose = "SIGNUP" } = req.body;
    if (!identifier) return res.status(400).json({ success: false, message: "identifier required", code: "VALIDATION" });

    const { OtpSession } = getModels();
    const mockOtp = process.env.MOCK_OTP || "1111";
    const pending = pendingSignups.get(identifier.toLowerCase());
    const channel = pending?.otpChannel || "email";

    await OtpSession.create({
      identifier: identifier.toLowerCase(),
      channel,
      otpHash: hash(mockOtp),
      purpose,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await NotificationService.sendOTP(identifier, channel, mockOtp);
    res.json({ success: true, data: { message: "OTP sent successfully." } });
  } catch (err) { next(err); }
}

export async function verifyOtp(req, res, next) {
  try {
    const { identifier, otp } = req.body;
    const { OtpSession, User } = getModels();

    const session = await OtpSession.findOne({ identifier: identifier.toLowerCase(), verified: false }).sort({ createdAt: -1 });
    if (!session) return res.status(400).json({ success: false, message: "No active OTP for this identifier", code: "NO_OTP" });
    if (session.expiresAt < new Date()) return res.status(400).json({ success: false, message: "OTP expired", code: "OTP_EXPIRED" });

    session.attempts += 1;
    if (hash(otp) !== session.otpHash) {
      await session.save();
      return res.status(400).json({ success: false, message: "Incorrect OTP", code: "OTP_MISMATCH" });
    }
    session.verified = true;
    await session.save();

    const pending = pendingSignups.get(identifier.toLowerCase());
    let user = await User.findOne({ email: identifier.toLowerCase() });

    if (!user && pending) {
      user = await User.create({ ...pending, isVerified: true });
      pendingSignups.delete(identifier.toLowerCase());
      await logAudit(EVENT_TYPES.USER_CREATED, { userId: user._id, metadata: { email: user.email } });
    } else if (user) {
      user.isVerified = true;
      await user.save();
    } else {
      return res.status(400).json({ success: false, message: "No signup in progress for this identifier", code: "NO_SIGNUP" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1d" });
    res.json({ success: true, data: { token, user: { id: user._id, name: user.name, email: user.email } } });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { name, email, aadhaarLast4 } = req.body;
    const { User } = getModels();
    const user = await User.findOne({ email: (email || "").toLowerCase(), name, aadhaarLast4, isVerified: true });
    if (!user) return res.status(401).json({ success: false, message: "No matching verified account found", code: "NO_MATCH" });

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1d" });
    res.json({ success: true, data: { token, user: { id: user._id, name: user.name, email: user.email } } });
  } catch (err) { next(err); }
}

export async function me(req, res, next) {
  try {
    const { User } = getModels();
    const user = await User.findById(req.user.userId).lean();
    if (!user) return res.status(404).json({ success: false, message: "User not found", code: "NOT_FOUND" });
    res.json({ success: true, data: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified } });
  } catch (err) { next(err); }
}

export function logout(req, res) {
  // Stateless JWT for the prototype — logout is a frontend-side token discard.
  res.json({ success: true, data: { message: "Logged out." } });
}
