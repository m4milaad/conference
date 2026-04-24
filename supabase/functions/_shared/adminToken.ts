export async function hmacHex(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAdminSessionToken(
  username: string,
  secret: string,
  ttlMs = 24 * 60 * 60 * 1000,
): Promise<string> {
  const exp = Date.now() + ttlMs;
  const payload = JSON.stringify({ u: username, exp });
  const payloadB64 = btoa(payload);
  const sig = await hmacHex(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

export async function verifyAdminSessionToken(
  token: string,
  secret: string,
): Promise<{ valid: boolean; username?: string }> {
  if (!token || !secret) return { valid: false };
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false };
  const [payloadB64, sig] = parts;
  const expected = await hmacHex(payloadB64, secret);
  if (expected !== sig) return { valid: false };
  let payload: { u?: string; exp?: number };
  try {
    payload = JSON.parse(atob(payloadB64));
  } catch {
    return { valid: false };
  }
  if (!payload.exp || typeof payload.exp !== "number" || payload.exp < Date.now()) {
    return { valid: false };
  }
  return { valid: true, username: payload.u ?? "" };
}
