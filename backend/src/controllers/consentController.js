import { getModels } from "../models/registry.js";
import { NotificationService } from "../services/notifications/NotificationService.js";
import { logAudit, EVENT_TYPES } from "../services/audit/auditLogger.js";

export async function requestConsent(req, res, next) {
  try {
    const { source } = req.body; // "ENTITYLOCKER" | "SETU_VAULT"
    const { BusinessProfile, User } = getModels();
    const profile = await BusinessProfile.findOne({ userId: req.user.userId });
    const user = await User.findById(req.user.userId);
    if (!profile) return res.status(400).json({ success: false, message: "Complete your business profile first", code: "NO_PROFILE" });

    await logAudit(EVENT_TYPES.CONSENT_REQUESTED, { userId: req.user.userId, businessId: profile._id, metadata: { source } });
    await NotificationService.sendConsentRequestEmail(user.email);
    await NotificationService.sendInApp(req.user.userId, "Action required", "Review your SETU document access request.");

    res.json({
      success: true,
      data: {
        title: "Permission required",
        message: "SETU needs your permission to check the business documents available in your connected document source and compare them with your approval-readiness checklist.",
        purpose: "Approval and document readiness",
        data: "Business documents available through your connected source",
        source,
      },
    });
  } catch (err) { next(err); }
}

export async function respondConsent(req, res, next) {
  try {
    const { source, granted } = req.body;
    const { BusinessProfile, ConsentRecord } = getModels();
    const profile = await BusinessProfile.findOne({ userId: req.user.userId });
    if (!profile) return res.status(400).json({ success: false, message: "Complete your business profile first", code: "NO_PROFILE" });

    const record = await ConsentRecord.create({
      userId: req.user.userId,
      businessId: profile._id,
      source,
      granted: !!granted,
      expiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    });

    await logAudit(granted ? EVENT_TYPES.CONSENT_GRANTED : EVENT_TYPES.CONSENT_DENIED, { userId: req.user.userId, businessId: profile._id, metadata: { source } });

    res.json({ success: true, data: { consentId: record._id, granted: record.granted } });
  } catch (err) { next(err); }
}
