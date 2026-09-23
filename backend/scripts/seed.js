import "dotenv/config";
import crypto from "crypto";
import { connectDatabases } from "../src/config/db.js";
import { initModels, getModels, getEntityLockerModels } from "../src/models/registry.js";
import { MOCK_ENTITYLOCKER_DOCS } from "../src/mock/mockEntityLockerData.js";

const hash = (v) => crypto.createHash("sha256").update(v).digest("hex");

async function seed() {
  await connectDatabases();
  initModels();
  const { User, BusinessProfile } = getModels();
  const { MockEntityLockerDoc } = getEntityLockerModels();

  // --- approval_platform ---
  await User.deleteMany({ email: "demo@beesetu.test" });
  const demoUser = await User.create({
    name: "Asha Rao",
    email: "demo@beesetu.test",
    phone: "+919999999999",
    aadhaarLast4: "1234",
    aadhaarHash: hash("123456781234"),
    isVerified: true,
  });

  await BusinessProfile.deleteMany({ userId: demoUser._id });
  await BusinessProfile.create({
    userId: demoUser._id,
    businessName: "Demo Manufacturing Pvt Ltd",
    entityType: "Private Limited",
    sector: "Manufacturing",
    nicActivityCode: "2029",
    panMasked: "DEMO-PAN-1234",
    cinOrLlpin: "MOCK-CIN-1234",
    udyamNumber: "UDYAM-DEMO-1234",
    gstin: "27MOCKGSTIN1234",
    authorisedRepresentative: "Asha Rao",
    mobile: "+919999999999",
    email: "demo@beesetu.test",
    address: "Plot 14, MIDC Industrial Area, Mumbai, Maharashtra",
    landType: "Government allotted (MIDC/other)",
    investment: 3500000,
    annualTurnover: 8000000,
    employeeCount: 22,
    productionCapacity: "500 units/day",
    premisesDetails: "8,000 sq ft, single floor, factory layout",
    utilities: ["Power connection", "Water supply"],
    environmentalCategory: "Orange",
    hazardousMaterial: false,
    machinery: "CNC machines, injection moulding unit",
  });

  // --- mock_entitylocker ---
  await MockEntityLockerDoc.deleteMany({});
  await MockEntityLockerDoc.insertMany(MOCK_ENTITYLOCKER_DOCS);

  console.log("[seed] done:");
  console.log(`  approval_platform.users: 1 (demo@beesetu.test)`);
  console.log(`  approval_platform.business_profiles: 1`);
  console.log(`  mock_entitylocker.mockentitylockerdocs: ${MOCK_ENTITYLOCKER_DOCS.length}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
