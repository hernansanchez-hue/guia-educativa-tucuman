/** Datos confirmados por el responsable. Los demás documentos siguen en revisión. */
export const legalConfig = Object.freeze({
  brandName: "Guía Educativa Tucumán",
  shortName: "GET",
  legalName: "César Hernán Sánchez",
  activity: "Guía Educativa Tucumán (emprendimiento personal)",
  contactAddress: "Cristóbal Colón 601, Concepción, Tucumán, Argentina",
  cuit: "PENDIENTE_DEFINIR",
  legalAddress: "PENDIENTE_DEFINIR",
  city: "Concepción",
  province: "Tucumán",
  country: "Argentina",
  privacyEmail: "hernan@guiaeducativatuc.com.ar",
  legalEmail: "PENDIENTE_DEFINIR",
  generalContactEmail: "PENDIENTE_DEFINIR",
  dataControllerRegistration: "PENDIENTE_DEFINIR",
  termsVersion: "DRAFT-001",
  privacyVersion: "2026-11-15",
  privacyReviewStatus: "approved-by-controller",
  privacyUpdatedAt: "2026-11-15",
  privacyRetention: "manual-purpose-review",
  cookiesVersion: "DRAFT-001",
  consentVersion: "2026-11-15",
  legalReviewStatus: "draft",
  lastLegalUpdate: "PENDIENTE_REVISION_FINAL",
});

// This notice is distinct from tax/contract documents: no DNI is collected,
// and the contact address is NOT inferred to be a legal address.
export function getMissingPrivacyConfig(config = legalConfig) {
  return ["legalName", "activity", "contactAddress", "privacyEmail", "privacyVersion", "privacyUpdatedAt"]
    .filter((field) => typeof config[field] !== "string" || !config[field].trim() || config[field].startsWith("PENDIENTE_"));
}

const requiredBeforeProduction = Object.freeze([
  "legalName",
  "cuit",
  "legalAddress",
  "city",
  "privacyEmail",
  "legalEmail",
  "generalContactEmail",
  "dataControllerRegistration",
  "lastLegalUpdate",
]);

const warnedFields = new Set();

export function getMissingLegalConfig(config = legalConfig) {
  return requiredBeforeProduction.filter((field) => {
    const value = config[field];
    return typeof value !== "string" || !value.trim() || value.startsWith("PENDIENTE_");
  });
}

/** Llamar explícitamente durante desarrollo; una advertencia por campo y proceso. */
export function warnMissingLegalConfig(config = legalConfig) {
  const missing = getMissingLegalConfig(config);
  if (process.env.NODE_ENV !== "development") return missing;

  for (const field of missing) {
    if (warnedFields.has(field)) continue;
    warnedFields.add(field);
    console.warn(`[GET LEGAL] Falta completar ${field}`);
  }
  return missing;
}
