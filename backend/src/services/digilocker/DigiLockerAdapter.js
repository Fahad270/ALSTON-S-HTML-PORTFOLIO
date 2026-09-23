import crypto from "crypto";

// DigiLocker here mocks IDENTITY verification (name + Aadhaar + phone), not
// document retrieval — that's what EntityLocker is for in this build. This
// is intentionally simple: no OAuth dance, no scopes. A real integration
// would swap this whole adapter for the actual DigiLocker OAuth flow.
export const DigiLockerAdapter = {
  mockUserDetails({ name, mobile }) {
    return {
      digilockerid: crypto.randomUUID(),
      name,
      mobile,
      eaadhaar: "Y",
      mode: "DEMO",
      message: "Demo Mode — DigiLocker identity check simulated. No real government API is called.",
    };
  },
};
