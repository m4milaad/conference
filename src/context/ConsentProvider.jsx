import { useCallback, useMemo, useState } from "react";
import { ConsentContext } from "./consentContext";

const STORAGE_KEY = "2ai_cookie_consent_v1";

const defaultConsent = () => ({
  necessary: true,
  analytics: false,
  marketing: false,
  choice: /** @type {'essential'} */ ("essential"),
  savedAt: new Date().toISOString(),
});

function readStoredConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (!p || typeof p !== "object") return null;
    return {
      necessary: true,
      analytics: Boolean(p.analytics),
      marketing: Boolean(p.marketing),
      choice: p.choice === "all" || p.choice === "custom" || p.choice === "essential" ? p.choice : "essential",
      savedAt: typeof p.savedAt === "string" ? p.savedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function writeStoredConsent(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Could not save cookie consent:", e);
  }
}

export function ConsentProvider({ children }) {
  const [consent, setConsent] = useState(() => readStoredConsent());
  const [bannerOpen, setBannerOpen] = useState(() => readStoredConsent() === null);

  const hasDecided = consent !== null;

  const acceptAll = useCallback(() => {
    const next = {
      necessary: true,
      analytics: true,
      marketing: true,
      choice: /** @type {const} */ ("all"),
      savedAt: new Date().toISOString(),
    };
    writeStoredConsent(next);
    setConsent(next);
    setBannerOpen(false);
  }, []);

  const saveCustom = useCallback((prefs) => {
    const next = {
      necessary: true,
      analytics: prefs.analytics,
      marketing: prefs.marketing,
      choice: /** @type {const} */ ("custom"),
      savedAt: new Date().toISOString(),
    };
    writeStoredConsent(next);
    setConsent(next);
    setBannerOpen(false);
  }, []);

  const essentialOnly = useCallback(() => {
    const next = defaultConsent();
    writeStoredConsent(next);
    setConsent(next);
    setBannerOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      consent,
      hasDecided,
      bannerOpen,
      setBannerOpen,
      acceptAll,
      saveCustom,
      essentialOnly,
    }),
    [consent, hasDecided, bannerOpen, acceptAll, saveCustom, essentialOnly],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}
