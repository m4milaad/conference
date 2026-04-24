/**
 * ICICI Eazypay crypto uses AES-128-ECB with PKCS#7 padding and Base64 payloads.
 * Key must resolve to exactly 16 bytes (AES-128).
 */
import CryptoJS from "npm:crypto-js@4.2.0";

function aesKeyWordArray(keyStr: string) {
  const normalized = String(keyStr ?? "").trim();
  if (!normalized) {
    throw new Error("ICICI AES key is missing");
  }

  // Some teams store bank keys as 32-char hex strings (16 raw bytes).
  if (/^[0-9a-fA-F]{32}$/.test(normalized)) {
    return CryptoJS.enc.Hex.parse(normalized);
  }

  const utf8ByteLength = new TextEncoder().encode(normalized).length;
  if (utf8ByteLength !== 16) {
    throw new Error("ICICI AES key must be exactly 16 UTF-8 bytes (or 32 hex chars)");
  }

  return CryptoJS.enc.Utf8.parse(normalized);
}

export function validateIciciAesKey(keyStr: string): void {
  aesKeyWordArray(keyStr);
}

export function iciciAes128Encrypt(plaintext: string, keyStr: string): string {
  const key = aesKeyWordArray(keyStr);
  const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

export function iciciAes128Decrypt(cipherBase64: string, keyStr: string): string {
  const key = aesKeyWordArray(keyStr);
  const clean = String(cipherBase64 ?? "").trim().replace(/\s/g, "");
  const params = { ciphertext: CryptoJS.enc.Base64.parse(clean) } as any;
  const decrypted = CryptoJS.AES.decrypt(params, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
