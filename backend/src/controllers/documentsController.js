import { getModels } from "../models/registry.js";
import { DocumentSourceRouter } from "../services/documents/DocumentSourceRouter.js";
import { matchDocuments } from "../services/documents/DocumentMatcher.js";
import { logAudit, EVENT_TYPES } from "../services/audit/auditLogger.js";

export async function matchAgainstKya(req, res, next) {
  try {
    const { source } = req.query;
    const { BusinessProfile, KyaResult, ConsentRecord } = getModels();
    const profile = await BusinessProfile.findOne({ userId: req.user.userId });
    if (!profile) return res.status(400).json({ success: false, message: "Complete your business profile first", code: "NO_PROFILE" });

    const consent = await ConsentRecord.findOne({ businessId: profile._id, source, granted: true }).sort({ createdAt: -1 });
    if (!consent) return res.status(403).json({ success: false, message: "Consent has not been granted for this source", code: "NO_CONSENT" });

    const latestKya = await KyaResult.findOne({ businessId: profile._id }).sort({ createdAt: -1 });
    if (!latestKya) return res.status(400).json({ success: false, message: "Run KYA first", code: "NO_KYA" });

    const available = await DocumentSourceRouter.getDocuments(req.user.userId, profile._id, source);
    await logAudit(EVENT_TYPES.DOCUMENTS_ACCESSED, { userId: req.user.userId, businessId: profile._id, metadata: { source, count: available.length } });

    const result = matchDocuments(latestKya.requiredDocuments, available);
    await logAudit(EVENT_TYPES.DOCUMENT_MATCH_COMPLETED, { userId: req.user.userId, businessId: profile._id, metadata: result });

    res.json({ success: true, data: { ...result, source } });
  } catch (err) { next(err); }
}

// Metadata-only "upload" for the prototype — see README for the real-storage
// limitation. Accepts a fileName/mimeType and records it against the vault.
export async function uploadToVault(req, res, next) {
  try {
    const { documentType, fileName, mimeType } = req.body;
    if (!documentType || !fileName) {
      return res.status(400).json({ success: false, message: "documentType and fileName are required", code: "VALIDATION" });
    }
    const { BusinessProfile, DocumentMetadata } = getModels();
    const profile = await BusinessProfile.findOne({ userId: req.user.userId });
    if (!profile) return res.status(400).json({ success: false, message: "Complete your business profile first", code: "NO_PROFILE" });

    const doc = await DocumentMetadata.create({
      userId: req.user.userId,
      businessId: profile._id,
      documentType,
      source: "SETU_VAULT",
      fileName,
      mimeType,
      storageKey: `mock://setu-vault/${profile._id}/${documentType}`,
      status: "UPLOADED",
    });

    await logAudit(EVENT_TYPES.DOCUMENT_UPLOADED, { userId: req.user.userId, businessId: profile._id, metadata: { documentType } });
    res.json({ success: true, data: doc });
  } catch (err) { next(err); }
}

export async function listVaultDocuments(req, res, next) {
  try {
    const { DocumentMetadata, BusinessProfile } = getModels();
    const profile = await BusinessProfile.findOne({ userId: req.user.userId });
    if (!profile) return res.json({ success: true, data: [] });
    const docs = await DocumentMetadata.find({ businessId: profile._id }).lean();
    res.json({ success: true, data: docs });
  } catch (err) { next(err); }
}
