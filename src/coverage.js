export function getCoverageSummary(claims = []) {
  if (!Array.isArray(claims) || claims.length === 0) {
    return {
      total: 0,
      evidenceSeen: 0,
      missing: 0,
      unresolved: 0,
      concerns: 0,
      percentage: null,
    };
  }

  const evidenceSeen = claims.filter((claim) => claim.status === 'evidence_seen').length;
  const concerns = claims.filter((claim) => claim.status === 'concern').length;
  const missing = claims.filter((claim) => claim.status === 'not_provided').length;
  const unresolved = missing + concerns;

  return {
    total: claims.length,
    evidenceSeen,
    missing,
    unresolved,
    concerns,
    percentage: Math.round((evidenceSeen / claims.length) * 100),
  };
}
