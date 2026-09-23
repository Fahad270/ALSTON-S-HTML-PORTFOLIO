import mongoose from "mongoose";
import { getMainConnection, getEntityLockerConnection } from "../config/db.js";

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  aadhaarLast4: { type: String },
  aadhaarHash: { type: String },
  role: { type: String, enum: ["USER", "OFFICER", "NODAL_OFFICER", "ADMIN"], default: "USER" },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

const OtpSessionSchema = new Schema({
  identifier: { type: String, required: true, index: true },
  channel: { type: String, enum: ["email", "whatsapp", "sms"], default: "email" },
  otpHash: { type: String, required: true },
  purpose: { type: String, default: "SIGNUP" },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  verified: { type: Boolean, default: false },
  attempts: { type: Number, default: 0 },
}, { timestamps: true });

const BusinessProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  businessName: String,
  entityType: { type: String, enum: ["Proprietorship", "Partnership", "LLP", "Private Limited", "Public Limited", "Cooperative", "Other"] },
  sector: { type: String, enum: ["Manufacturing", "IT / ITeS", "Agro-processing", "Textiles", "Pharma & Chemicals", "Logistics & Warehousing", "Services", "Other"] },
  nicActivityCode: String,
  panMasked: String,
  cinOrLlpin: String,
  udyamNumber: String,
  gstin: String,
  authorisedRepresentative: String,
  mobile: String,
  email: String,
  address: String,
  landType: { type: String, enum: ["Owned", "Leased", "Government allotted (MIDC/other)", "Shared / co-working", "Other"] },
  investment: Number,
  annualTurnover: Number,
  employeeCount: Number,
  productionCapacity: String,
  premisesDetails: String,
  utilities: [String],
  environmentalCategory: { type: String, enum: ["Not applicable", "White", "Green", "Orange", "Red"], default: "Not applicable" },
  hazardousMaterial: { type: Boolean, default: false },
  machinery: String,
  // Per spec: user-provided until an actual verification source confirms it.
  fieldVerificationStatus: { type: String, enum: ["USER_PROVIDED", "PARTIALLY_VERIFIED", "VERIFIED"], default: "USER_PROVIDED" },
}, { timestamps: true });

const ConsentRecordSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  businessId: { type: Schema.Types.ObjectId, ref: "BusinessProfile", required: true },
  source: { type: String, enum: ["ENTITYLOCKER", "SETU_VAULT"], required: true },
  purpose: { type: String, default: "Approval and document readiness" },
  granted: { type: Boolean, required: true },
  expiry: Date,
  consentVersion: { type: String, default: "v1" },
}, { timestamps: true });

const DocumentMetadataSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  businessId: { type: Schema.Types.ObjectId, ref: "BusinessProfile", required: true },
  documentType: { type: String, required: true },
  source: { type: String, enum: ["ENTITYLOCKER", "SETU_VAULT"], required: true },
  fileName: String,
  storageKey: String, // NOTE: prototype does not implement real object storage — see README.
  mimeType: String,
  status: { type: String, enum: ["UPLOADED", "REFERENCED"], default: "REFERENCED" },
}, { timestamps: true });

const AuditLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  businessId: { type: Schema.Types.ObjectId, ref: "BusinessProfile" },
  eventType: { type: String, required: true },
  metadata: Schema.Types.Mixed,
}, { timestamps: true });

const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  body: String,
  read: { type: Boolean, default: false },
}, { timestamps: true });

const KyaResultSchema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: "BusinessProfile", required: true },
  requiredDocuments: [{ type: String }],
  generatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// --- EntityLocker mock DB schema (separate logical database) ---
const MockEntityLockerDocSchema = new Schema({
  entityId: { type: String, required: true, index: true },
  documentType: String,
  documentName: String,
  issuer: String,
  issuedDate: String,
  status: { type: String, default: "ISSUED" },
});

export function buildModels() {
  const main = getMainConnection();
  return {
    User: main.model("User", UserSchema),
    OtpSession: main.model("OtpSession", OtpSessionSchema),
    BusinessProfile: main.model("BusinessProfile", BusinessProfileSchema),
    ConsentRecord: main.model("ConsentRecord", ConsentRecordSchema),
    DocumentMetadata: main.model("DocumentMetadata", DocumentMetadataSchema),
    AuditLog: main.model("AuditLog", AuditLogSchema),
    Notification: main.model("Notification", NotificationSchema),
    KyaResult: main.model("KyaResult", KyaResultSchema),
  };
}

export function buildEntityLockerModels() {
  const el = getEntityLockerConnection();
  return {
    MockEntityLockerDoc: el.model("MockEntityLockerDoc", MockEntityLockerDocSchema),
  };
}
