// Deterministic, configuration-driven requirement generation.
// IMPORTANT: this is explicitly "indicative requirements based on your
// business profile" — never framed as a legal guarantee. Do not wire an
// LLM into this function; if a RAG layer is added later it should
// summarise/explain this output, not generate the list itself.

const BASE_REQUIREMENTS = [
  "PAN",
  "ADDRESS_PROOF",
  "AUTHORISED_SIGNATORY_ID",
];

const ENTITY_TYPE_REQUIREMENTS = {
  "Private Limited": ["INCORPORATION_CERTIFICATE", "COMPANY_REGISTRATION_CERTIFICATE"],
  "Public Limited": ["INCORPORATION_CERTIFICATE", "COMPANY_REGISTRATION_CERTIFICATE"],
  "LLP": ["INCORPORATION_CERTIFICATE"],
  "Partnership": ["PARTNERSHIP_DEED"],
  "Proprietorship": [],
  "Cooperative": ["COOPERATIVE_REGISTRATION_CERTIFICATE"],
  "Other": [],
};

export function generateKyaRequirements(profile) {
  const required = new Set(BASE_REQUIREMENTS);

  (ENTITY_TYPE_REQUIREMENTS[profile.entityType] || []).forEach((d) => required.add(d));

  if (profile.gstin) required.add("GSTIN_CERTIFICATE");
  if (profile.udyamNumber) required.add("UDYAM_CERTIFICATE");

  if (profile.landType === "Leased") required.add("LEASE_DEED");

  if (profile.sector === "Manufacturing") required.add("FACTORY_LICENCE");

  if (profile.environmentalCategory && profile.environmentalCategory !== "Not applicable") {
    required.add("POLLUTION_CONTROL_CONSENT");
  }

  if (profile.hazardousMaterial) {
    required.add("HAZARDOUS_MATERIAL_LICENCE");
    required.add("FIRE_NOC");
  }

  if (Number(profile.employeeCount) > 10) {
    required.add("SHOPS_AND_ESTABLISHMENT_REGISTRATION");
  }

  if (profile.annualTurnover && Number(profile.annualTurnover) > 4000000) {
    required.add("BANK_STATEMENT");
  }

  return {
    requiredDocuments: Array.from(required),
    disclaimer: "Indicative requirements based on your business profile. This is not a guarantee that these are the only, or legally mandatory, documents in every case.",
  };
}
