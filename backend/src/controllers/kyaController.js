import { getModels } from "../models/registry.js";
import { generateKyaRequirements } from "../services/kya/kyaEngine.js";
import { logAudit, EVENT_TYPES } from "../services/audit/auditLogger.js";

export async function runKya(req, res, next) {
  try {
    const { BusinessProfile, KyaResult } = getModels();
    const profile = await BusinessProfile.findOne({ userId: req.user.userId }).lean();
    if (!profile) return res.status(400).json({ success: false, message: "Complete your business profile first", code: "NO_PROFILE" });

    const { requiredDocuments, disclaimer } = generateKyaRequirements(profile);
    const result = await KyaResult.create({ businessId: profile._id, requiredDocuments });
    await logAudit(EVENT_TYPES.KYA_COMPLETED, { userId: req.user.userId, businessId: profile._id, metadata: { count: requiredDocuments.length } });

    res.json({
      success: true,
      data: {
        businessId: profile._id,
        requiredDocuments,
        count: requiredDocuments.length,
        disclaimer,
        kyaResultId: result._id,
      },
    });
  } catch (err) { next(err); }
}
