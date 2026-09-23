import { getModels } from "../models/registry.js";

export async function getDashboard(req, res, next) {
  try {
    const { BusinessProfile, ConsentRecord } = getModels();
    const profile = await BusinessProfile.findOne({ userId: req.user.userId }).lean();
    const entityLockerConsent = profile
      ? await ConsentRecord.findOne({ businessId: profile._id, source: "ENTITYLOCKER", granted: true }).sort({ createdAt: -1 })
      : null;

    res.json({
      success: true,
      data: {
        profileComplete: !!profile,
        business: profile ? { businessName: profile.businessName, entityType: profile.entityType, address: profile.address } : null,
        entityLockerConnected: !!entityLockerConsent,
      },
    });
  } catch (err) { next(err); }
}

export async function listNotifications(req, res, next) {
  try {
    const { Notification } = getModels();
    const items = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
}

export async function markNotificationRead(req, res, next) {
  try {
    const { Notification } = getModels();
    const item = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user.userId }, { read: true }, { new: true });
    if (!item) return res.status(404).json({ success: false, message: "Not found", code: "NOT_FOUND" });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

// Deterministic and clearly non-binding — real incentive eligibility rules
// were out of scope to hand-author reliably for a demo in this pass, so
// this is intentionally simple and labelled as such.
const INCENTIVE_RULES = [
  { id: "MSME_CAPEX_SUBSIDY", label: "MSME Capital Investment Subsidy", when: (p) => !!p.udyamNumber },
  { id: "MANUFACTURING_ELECTRICITY_REBATE", label: "Manufacturing Sector Electricity Duty Rebate", when: (p) => p.sector === "Manufacturing" },
  { id: "EXPORT_PROMOTION_SCHEME", label: "Export Promotion / Logistics Incentive", when: (p) => p.sector === "Logistics & Warehousing" },
  { id: "STARTUP_TAX_HOLIDAY", label: "Startup Tax Holiday Consideration", when: (p) => Number(p.employeeCount) < 50 && Number(p.investment) < 5000000 },
];

export async function matchIncentives(req, res, next) {
  try {
    const { BusinessProfile } = getModels();
    const profile = await BusinessProfile.findOne({ userId: req.user.userId }).lean();
    if (!profile) return res.status(400).json({ success: false, message: "Complete your business profile first", code: "NO_PROFILE" });

    const matches = INCENTIVE_RULES.filter((r) => r.when(profile)).map((r) => ({ id: r.id, label: r.label, status: "Potentially relevant" }));
    res.json({ success: true, data: { matches, disclaimer: "Potentially relevant based on your profile. Eligibility is not guaranteed and must be confirmed with the issuing scheme." } });
  } catch (err) { next(err); }
}

// Honest stub: no vector store, no retrieval pipeline built in this pass.
// Wired to the same shape a real RAG endpoint would return so the frontend
// doesn't need to change when it's implemented for real.
export async function ragAsk(req, res, next) {
  try {
    const { question } = req.body;
    res.json({
      success: true,
      data: {
        answer: "RAG assistant is not implemented yet in this build — this endpoint is a placeholder so the frontend can be wired up now. It should answer strictly from your business profile, KYA results and document metadata, and must not invent legal requirements.",
        question,
        sources: [],
      },
    });
  } catch (err) { next(err); }
}
