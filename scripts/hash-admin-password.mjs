/**
 * Generate Argon2id (PHC) hash for `public.admins.password`.
 * Params must match `supabase/functions/_shared/passwordArgon2.ts` (ARGON2_PARAMS).
 *
 * Usage: node scripts/hash-admin-password.mjs "<password>"
 */
import { randomBytes } from "node:crypto";
import { argon2id } from "hash-wasm";

const ARGON2_PARAMS = {
  iterations: 3,
  parallelism: 1,
  memorySize: 19456,
  hashLength: 32,
};

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-admin-password.mjs "<password>"');
  process.exit(1);
}

const salt = randomBytes(16);

const hash = await argon2id({
  password,
  salt,
  ...ARGON2_PARAMS,
  outputType: "encoded",
});

console.log(hash);
console.error(
  "\nStore only this PHC string in the database. Log in with the same password you hashed — not this string.\n",
);
