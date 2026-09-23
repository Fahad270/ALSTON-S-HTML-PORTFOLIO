import crypto from "crypto";
import { getEntityLockerModels } from "../../models/registry.js";
import { DEMO_ENTITY_ID, MOCK_ENTITY_DETAILS, ACR_BY_ENTITY_TYPE, ACR_FIELD_LABEL } from "../../mock/mockEntityLockerData.js";

const hash = (v) => crypto.createHash("sha256").update(v).digest("hex");

// This is the ONLY file that knows the mock EntityLocker actually lives in
// MongoDB. Everything else talks to EntityLockerAdapter below.
//
// Modelled on the real "Get Authorization Code" → "Get Access Token" → "Get
// Entity Details" sequence from the Entity Locker API spec (Oct 2024), minus
// the actual OAuth redirect dance — this is a sandbox, not a real client
// registration, so start()/verify() collapse that into two calls with an
// OTP standing in for "the Entity signs in to Entity Locker".
export const MockEntityLockerService = {
  // Step 1 — mirrors GET /oauth2/1/authorize's `acr` parameter: which ID
  // EntityLocker will ask the entity to verify, based on entity type.
  start(entityType) {
    const acr = ACR_BY_ENTITY_TYPE[entityType] || "pan";
    return {
      acr,
      fieldLabel: ACR_FIELD_LABEL[acr],
      mode: "DEMO",
      message: "Demo Mode — mimicking the Entity Locker authorize step (acr=" + acr + "). No real government API is called.",
    };
  },

  // Step 2 — mirrors POST /oauth2/1/token + GET /oauth2/1/entity, collapsed
  // into one call with a mock OTP standing in for the entity's EntityLocker
  // sign-in. otp is checked by the controller against MOCK_OTP.
  async verify() {
    await new Promise((r) => setTimeout(r, 500)); // simulate network round-trip
    return {
      access_token: crypto.randomUUID(),
      expires_in: 3600,
      token_type: "Bearer",
      scope: "entitydetails files.issueddocs",
      new_account: "N",
      entity: MOCK_ENTITY_DETAILS,
      mode: "DEMO",
      message: "Demo Mode — EntityLocker connection simulated.",
    };
  },

  async getDocuments(entityId = DEMO_ENTITY_ID) {
    const { MockEntityLockerDoc } = getEntityLockerModels();
    return MockEntityLockerDoc.find({ entityId }).lean();
  },

  async getDocument(entityId, documentType) {
    const { MockEntityLockerDoc } = getEntityLockerModels();
    return MockEntityLockerDoc.findOne({ entityId, documentType }).lean();
  },
};
