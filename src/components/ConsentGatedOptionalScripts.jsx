import { useConsent } from "../hooks/useConsent";

/** Non-essential scripts (e.g. analytics) — render children only when allowed. */
export default function ConsentGatedOptionalScripts({ children }) {
  const { consent } = useConsent();
  if (!consent?.analytics || children == null) return null;
  return children;
}
