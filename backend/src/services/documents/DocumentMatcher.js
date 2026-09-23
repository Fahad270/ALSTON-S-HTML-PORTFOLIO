function normalize(type) {
  return String(type).toUpperCase().trim().replace(/[\s-]+/g, "_");
}

export function matchDocuments(requiredDocuments, availableDocuments) {
  const availableTypes = new Set(availableDocuments.map((d) => normalize(d.documentType)));

  const found = [];
  const missing = [];

  requiredDocuments.forEach((req) => {
    const reqNorm = normalize(req);
    if (availableTypes.has(reqNorm)) found.push(req);
    else missing.push(req);
  });

  return {
    totalRequired: requiredDocuments.length,
    totalFound: found.length,
    found,
    missing,
    summary: `${found.length} of ${requiredDocuments.length} requirements matched`,
    complete: missing.length === 0,
  };
}
