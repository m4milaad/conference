/**
 * Argon2id (PHC encoded) for admin passwords — hash-wasm (WASM).
 * Use `npm:` so WASM is bundled for Supabase Edge; `esm.sh` often fails to load WASM at runtime.
 * Keep ARGON2_PARAMS in sync with `scripts/hash-admin-password.mjs`.
 */
import { argon2id, argon2Verify } from "npm:hash-wasm@4.12.0";

/** Argon2id tuning — balanced for serverless (avoid very high memory on cold starts). */
export const ARGON2_PARAMS = {
  iterations: 3,
  parallelism: 1,
  /** Memory in KiB (~19 MiB) */
  memorySize: 19456,
  hashLength: 32,
} as const;

function timingSafeEqualString(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ba = enc.encode(a);
  const bb = enc.encode(b);
  if (ba.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ba.length; i++) diff |= ba[i]! ^ bb[i]!;
  return diff === 0;
}

/** PHC-encoded Argon2 hash string (includes salt and params). */
export async function hashPasswordArgon2id(plain: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return await argon2id({
    password: plain,
    salt,
    ...ARGON2_PARAMS,
    outputType: "encoded",
  });
}

function normalizeStoredPassword(stored: string): string {
  return String(stored ?? "").replace(/^\uFEFF/, "").trim();
}

/**
 * Verify login: `plain` is what the user types in the login form.
 * `stored` is the DB value: either a PHC Argon2 string or legacy plaintext.
 * Never paste the hash into the login form — only the real password.
 */
export async function verifyAdminPassword(
  stored: string,
  plain: string,
): Promise<{ ok: boolean; upgradedHash?: string }> {
  const s = normalizeStoredPassword(stored);
  const p = String(plain ?? "");
  if (!s || !p) return { ok: false };

  // PHC Argon2 strings start with $argon2id$, $argon2i$, or $argon2d$
  if (/^\$argon2(?:id|i|d)\$/.test(s)) {
    try {
      const ok = await argon2Verify({ hash: s, password: p });
      return { ok };
    } catch (e) {
      console.error("argon2Verify failed:", e);
      return { ok: false };
    }
  }

  // Legacy plaintext (development / pre-migration)
  if (timingSafeEqualString(s, p)) {
    const upgradedHash = await hashPasswordArgon2id(p);
    return { ok: true, upgradedHash };
  }

  return { ok: false };
}
