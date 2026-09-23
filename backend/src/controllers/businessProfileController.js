import { getModels } from "../models/registry.js";
import { logAudit, EVENT_TYPES } from "../services/audit/auditLogger.js";

export async function saveBusinessProfile(req, res, next) {
  try {
    const { BusinessProfile } = getModels();
    const userId = req.user.userId;
    const existing = await BusinessProfile.findOne({ userId });

    const payload = { ...req.body, userId, fieldVerificationStatus: "USER_PROVIDED" };

    let profile;
    if (existing) {
      Object.assign(existing, payload);
      profile = await existing.save();
      await logAudit(EVENT_TYPES.BUSINESS_PROFILE_UPDATED, { userId, businessId: profile._id });
    } else {
      profile = await BusinessProfile.create(payload);
      await logAudit(EVENT_TYPES.BUSINESS_PROFILE_CREATED, { userId, businessId: profile._id });
    }

    res.json({
      success: true,
      data: {
        profile,
        message: "Business profile saved",
        note: "SETU will reuse this information across your approval, document and compliance workflows.",
      },
    });
  } catch (err) { next(err); }
}

export async function getBusinessProfile(req, res, next) {
  try {
    const { BusinessProfile } = getModels();
    const profile = await BusinessProfile.findOne({ userId: req.user.userId }).lean();
    if (!profile) return res.status(404).json({ success: false, message: "No business profile yet", code: "NO_PROFILE" });
    res.json({ success: true, data: profile });
  } catch (err) { next(err); }
}
