/** @typedef {{ version: number; currentStep: number; formData: Record<string, unknown>; updatedAt: string }} RegistrationDraft */

export const REGISTRATION_DRAFT_KEY = "2ai_registration_draft_v1";

/**
 * @returns {RegistrationDraft | null}
 */
export function loadRegistrationDraft() {
  try {
    const raw = localStorage.getItem(REGISTRATION_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * @param {Omit<RegistrationDraft, "updatedAt"> & { updatedAt?: string }} draft
 */
export function saveRegistrationDraft(draft) {
  try {
    const payload = {
      ...draft,
      updatedAt: draft.updatedAt ?? new Date().toISOString(),
    };
    localStorage.setItem(REGISTRATION_DRAFT_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn("Could not persist registration draft:", e);
  }
}

export function clearRegistrationDraft() {
  try {
    localStorage.removeItem(REGISTRATION_DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

export function clampStep(step) {
  const n = Number(step);
  if (Number.isNaN(n)) return 1;
  return Math.min(Math.max(Math.floor(n), 1), 3);
}
