import ConsentGatedOptionalScripts from "./ConsentGatedOptionalScripts";

/**
 * Mount optional third-party scripts (e.g. analytics) only after the user opts in.
 * Add script loaders as children inside ConsentGatedOptionalScripts when needed.
 */
export default function OptionalScripts() {
  return <ConsentGatedOptionalScripts>{null}</ConsentGatedOptionalScripts>;
}
