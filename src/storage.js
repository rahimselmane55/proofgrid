export const STORAGE_KEY = 'proofgrid.analysis.v1';
export const SCHEMA_VERSION = 1;

export function loadAnalysis(storage = window.localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.schemaVersion !== SCHEMA_VERSION || !Array.isArray(parsed.claims)) {
      storage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    try { storage.removeItem(STORAGE_KEY); } catch {}
    return null;
  }
}

export function saveAnalysis(analysis, storage = window.localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(analysis));
}

export function clearAnalysis(storage = window.localStorage) {
  storage.removeItem(STORAGE_KEY);
}
