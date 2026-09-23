// Synthetic demo documents only — never real government identifiers.
// Field names (doctype, uri, issuerid, description) deliberately mirror the
// real Entity Locker "Get List of Issued Documents" API response shape
// (see Requester – Entity Locker API Specification, Oct 2024) so this mock
// is a drop-in shape match for a future real adapter.
export const DEMO_ENTITY_ID = "EL-ENT-1001";

export const MOCK_ENTITY_DETAILS = {
  entitylockerid: "123e4567-e89b-12d3-a456-426655440000",
  name: "Demo Manufacturing Pvt Ltd",
  doi: "20-03-2019",
  email: "demo@beesetu.test",
  mobile: "+919999999999",
  verified_by: "CIN",
};

export const MOCK_ENTITYLOCKER_DOCS = [
  { entityId: DEMO_ENTITY_ID, documentType: "PAN", documentName: "Organisation PAN Verification Record", issuer: "Income Tax Department", issuerid: "in.gov.pan", doctype: "OPNCR", uri: "in.gov.pan-OPNCR-98765432", mime: "application/pdf", issuedDate: "2019-04-11" },
  { entityId: DEMO_ENTITY_ID, documentType: "GSTIN_CERTIFICATE", documentName: "GST Registration Certificate", issuer: "GSTN", issuerid: "in.gov.gstn", doctype: "GSTRC", uri: "in.gov.gstn-GSTRC-27ABCDE1234F1Z5", mime: "application/pdf", issuedDate: "2019-05-02" },
  { entityId: DEMO_ENTITY_ID, documentType: "UDYAM_CERTIFICATE", documentName: "Udyam Registration Certificate", issuer: "Ministry of MSME", issuerid: "in.gov.msme", doctype: "UDYRC", uri: "in.gov.msme-UDYRC-UDYAM1234", mime: "application/pdf", issuedDate: "2020-01-15" },
  { entityId: DEMO_ENTITY_ID, documentType: "INCORPORATION_CERTIFICATE", documentName: "Certificate of Incorporation", issuer: "Ministry of Corporate Affairs", issuerid: "in.gov.mca", doctype: "COINC", uri: "in.gov.mca-COINC-201412345678", mime: "application/pdf", issuedDate: "2019-03-20" },
  { entityId: DEMO_ENTITY_ID, documentType: "ADDRESS_PROOF", documentName: "Registered Office Address Proof", issuer: "Self-attested", issuerid: "self.uploaded", doctype: "ADRPR", uri: "self.uploaded-ADRPR-0001", mime: "application/pdf", issuedDate: "2019-03-25" },
  { entityId: DEMO_ENTITY_ID, documentType: "COMPANY_REGISTRATION_CERTIFICATE", documentName: "Company Master Details", issuer: "Ministry of Corporate Affairs", issuerid: "in.gov.mca", doctype: "CPMTD", uri: "in.gov.mca-CPMTD-201412345678", mime: "application/pdf", issuedDate: "2019-03-20" },
  { entityId: DEMO_ENTITY_ID, documentType: "BANK_STATEMENT", documentName: "Bank Account Statement (6 months)", issuer: "Demo Bank", issuerid: "in.demo.bank", doctype: "BNKST", uri: "in.demo.bank-BNKST-0002", mime: "application/pdf", issuedDate: "2024-01-01" },
  { entityId: DEMO_ENTITY_ID, documentType: "LEASE_DEED", documentName: "Premises Lease Deed", issuer: "Registrar of Assurances", issuerid: "in.gov.registrar", doctype: "LEASE", uri: "in.gov.registrar-LEASE-0003", mime: "application/pdf", issuedDate: "2021-06-10" },
  { entityId: DEMO_ENTITY_ID, documentType: "AUTHORISED_SIGNATORY_ID", documentName: "Authorised Signatory ID Proof", issuer: "Self-attested", issuerid: "self.uploaded", doctype: "ASGID", uri: "self.uploaded-ASGID-0004", mime: "application/pdf", issuedDate: "2019-03-25" },
  { entityId: DEMO_ENTITY_ID, documentType: "FACTORY_LICENCE", documentName: "Factory Licence", issuer: "Directorate of Industrial Safety", issuerid: "in.gov.dish", doctype: "FCTLC", uri: "in.gov.dish-FCTLC-0005", mime: "application/pdf", issuedDate: "2021-09-01" },
];

// Mirrors the real API's "acr" parameter (authenticated content recognition):
// which identifier EntityLocker verifies the entity against, based on
// entity type. Real values are exactly pan | cin | udyam.
export const ACR_BY_ENTITY_TYPE = {
  "Private Limited": "cin",
  "Public Limited": "cin",
  LLP: "cin",
  Partnership: "pan",
  Proprietorship: "udyam",
  Cooperative: "pan",
  Other: "pan",
};

export const ACR_FIELD_LABEL = {
  pan: "Organisation PAN",
  cin: "CIN (Corporate Identity Number)",
  udyam: "Udyam Registration Number",
};
