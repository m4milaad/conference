import { corsJson, handleOptions } from "../_shared/cors.ts";
import { iciciAes128Encrypt, validateIciciAesKey } from "../_shared/iciciEazypayCrypto.ts";

const DEFAULT_ICICI_EAZYPAY_BASE = "https://eazypay.icicibank.com/EazyPG?";

function trimEndSlashes(s: string): string {
  return s.replace(/\/+$/, "");
}

function resolvePaymentCallbackUrl(frontendUrl: string, configuredCallbackUrl: string): string {
  const explicit = configuredCallbackUrl.trim();
  if (explicit) return explicit;

  const supabaseUrl = trimEndSlashes(Deno.env.get("SUPABASE_URL") ?? "");
  if (supabaseUrl) {
    return `${supabaseUrl}/functions/v1/icici-payment-callback`;
  }

  return `${frontendUrl}/payment-callback`;
}

function resolveIciciEazypayBaseUrl(rawFromEnv: string, frontendUrl: string): string {
  const raw = rawFromEnv.trim();
  if (!raw) return DEFAULT_ICICI_EAZYPAY_BASE;

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return DEFAULT_ICICI_EAZYPAY_BASE;
  }

  const host = parsed.hostname.toLowerCase();
  const onIcici = host === "icicibank.com" || host.endsWith(".icicibank.com");
  if (!onIcici) return DEFAULT_ICICI_EAZYPAY_BASE;

  try {
    const frontHost = new URL(frontendUrl).hostname.toLowerCase();
    if (host === frontHost) return DEFAULT_ICICI_EAZYPAY_BASE;
  } catch {
    // ignore frontend URL parse issues
  }

  const path = parsed.pathname.replace(/\/+$/, "");
  if (path.toLowerCase() !== "/eazypg") {
    return DEFAULT_ICICI_EAZYPAY_BASE;
  }

  return `${parsed.origin}${parsed.pathname}`.replace(/\/+$/, "") || DEFAULT_ICICI_EAZYPAY_BASE;
}

function normalizeAmount(amount: number, currency: string): string {
  if (currency === "INR") return String(Math.round(amount));
  return String(Math.round(amount * 100) / 100);
}

function normalizeIciciText(value: unknown, maxLen = 98, fallback = "NA"): string {
  const raw = String(value ?? "").replace(/\|/g, " ").trim();
  if (!raw) return fallback;
  return raw.slice(0, maxLen);
}

function normalizeIciciAmount(value: string): string {
  const intPart = String(value ?? "").split(".")[0].replace(/[^\d]/g, "");
  const trimmed = intPart.replace(/^0+/, "") || "0";
  return trimmed.slice(0, 9);
}

function normalizeIciciMobile(value: unknown): string {
  const digitsOnly = String(value ?? "").replace(/\D/g, "");
  if (!digitsOnly) return "0000000000";
  return digitsOnly.slice(-10).padStart(10, "0").slice(0, 10);
}

function normalizeIciciReferenceNo(ref: string): string {
  return normalizeIciciText(ref, 98, `REF${Date.now()}`);
}

function buildFallbackFormNo(referenceNo: string): string {
  const cleanRef = normalizeIciciReferenceNo(referenceNo);
  const randomTail = Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");
  return normalizeIciciText(`FORM${cleanRef.slice(-8)}${randomTail}`, 98, "FORM000000");
}

function maskMobileForLog(value: string): string {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length < 4) return "****";
  return `${"*".repeat(Math.max(0, digits.length - 4))}${digits.slice(-4)}`;
}

function maskEmailForLog(value: string): string {
  const email = String(value ?? "").trim();
  const at = email.indexOf("@");
  if (at <= 1) return "***";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  return `${local.slice(0, 2)}${"*".repeat(Math.max(0, local.length - 2))}@${domain || "***"}`;
}

function buildMandatoryFieldsPipe(opts: {
  referenceNo: string;
  submissionId: string;
  amountStr: string;
  registrationData: Record<string, unknown>;
}): string {
  const { referenceNo, submissionId, amountStr, registrationData } = opts;
  const cleanRef = normalizeIciciReferenceNo(referenceNo);
  const cleanSubmissionId = normalizeIciciText(submissionId, 98, "0");
  const paperId = normalizeIciciText(registrationData.paperId, 98, "");
  const formNo = paperId || buildFallbackFormNo(cleanRef);
  return [
    cleanRef, // 1 Reference No
    cleanSubmissionId, // 2 Submission Id
    normalizeIciciAmount(amountStr), // 3 PG Amount
    normalizeIciciText(registrationData.fullName, 98, "Student"), // 4 Student Name
    normalizeIciciMobile(registrationData.contactNumber), // 5 Mobile Number
    normalizeIciciText(registrationData.email, 98, "no-reply@example.com"), // 6 Email Id
    formNo, // 7 Form No
    normalizeIciciText(registrationData.affiliation, 98, "Department"), // 8 Department
    normalizeIciciText(
      registrationData.subCategory || registrationData.participantType,
      98,
      "Category",
    ), // 9 Category
    normalizeIciciText(registrationData.designation, 98, "Post"), // 10 Post
  ].join("|");
}

function logMandatoryFieldsDebug(mandatoryPlain: string): void {
  const parts = mandatoryPlain.split("|");
  const labels = [
    "Reference No",
    "Submission Id",
    "PG Amount",
    "Student Name",
    "Mobile Number",
    "Email Id",
    "Form No",
    "Department",
    "Category",
    "Post",
  ];
  const maskedParts = parts.map((value, i) => {
    if (i === 4) return maskMobileForLog(value);
    if (i === 5) return maskEmailForLog(value);
    return value;
  });
  console.log(
    "[create-payment-order] ICICI mandatory fields (masked)",
    Object.fromEntries(labels.map((label, i) => [label, maskedParts[i] ?? ""])),
  );
}

function buildIciciEazypayUrl(opts: {
  baseUrl: string;
  merchantId: string;
  submissionId: string;
  aesKey: string;
  referenceNo: string;
  amountStr: string;
  returnUrl: string;
  paymode: string;
  optionalPipe: string | null;
  registrationData: Record<string, unknown>;
}): string {
  const mandatoryPlain = buildMandatoryFieldsPipe({
    referenceNo: opts.referenceNo,
    submissionId: opts.submissionId,
    amountStr: opts.amountStr,
    registrationData: opts.registrationData,
  });
  logMandatoryFieldsDebug(mandatoryPlain);

  const cleanRef = normalizeIciciReferenceNo(opts.referenceNo);
  const cleanSubmissionId = normalizeIciciText(opts.submissionId, 98, "0");
  const cleanPaymode = String(opts.paymode ?? "9").replace(/\D/g, "") || "9";
  const enc = (plain: string) => iciciAes128Encrypt(plain, opts.aesKey);

  const pairs: [string, string][] = [
    ["merchantid", opts.merchantId],
    ["mandatory fields", enc(mandatoryPlain)],
    ["optional fields", opts.optionalPipe ? enc(opts.optionalPipe) : ""],
    ["returnurl", enc(opts.returnUrl)],
    ["Reference No", enc(cleanRef)],
    ["submerchantid", enc(cleanSubmissionId)],
    ["transaction amount", enc(normalizeIciciAmount(opts.amountStr))],
    ["paymode", enc(cleanPaymode)],
  ];

  const encodedQuery = pairs
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return `${opts.baseUrl.replace(/[?]+$/, "")}?${encodedQuery}`;
}

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== "POST") return corsJson({ error: "Method not allowed" }, 405);

  try {
    const FRONTEND_URL = trimEndSlashes(Deno.env.get("FRONTEND_URL") ?? "http://localhost:5173");
    const PAYMENT_CALLBACK_URL = (Deno.env.get("PAYMENT_CALLBACK_URL") ?? "").trim();
    const merchantId = (Deno.env.get("ICICI_EAZYPAY_MERCHANT_ID") ?? "").trim();
    const aesKey = (Deno.env.get("ICICI_EAZYPAY_AES_KEY") ?? "").trim();

    if (!merchantId || !aesKey) {
      return corsJson({ error: "Payment gateway not configured in edge secrets." }, 500);
    }
    try {
      validateIciciAesKey(aesKey);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid ICICI AES key";
      return corsJson({ error: msg }, 400);
    }

    const { amount, currency, registrationData } = await req.json();
    if (!registrationData?.fullName || !registrationData?.email) {
      return corsJson({ error: "Invalid registration data" }, 400);
    }

    const cur = String(currency || "INR").toUpperCase();
    if (cur !== "INR") {
      return corsJson({ error: "Online payment is only available in INR (ICICI Eazypay)." }, 400);
    }

    const amountStr = normalizeAmount(Number(amount), cur);
    const orderId = normalizeIciciReferenceNo(
      `2AI${Date.now().toString(36)}${Math.random().toString(36).substring(2, 6)}`.toUpperCase(),
    );
    const returnUrlPlain = resolvePaymentCallbackUrl(FRONTEND_URL, PAYMENT_CALLBACK_URL);
    const submissionId = (Deno.env.get("ICICI_EAZYPAY_SUB_MERCHANT_ID") ?? merchantId).trim();
    const paymode = (Deno.env.get("ICICI_EAZYPAY_PAYMODE") ?? "9").trim();
    const optionalPipe = (Deno.env.get("ICICI_EAZYPAY_OPTIONAL_FIELDS") ?? "").trim() || null;
    const baseUrl = resolveIciciEazypayBaseUrl(
      Deno.env.get("ICICI_EAZYPAY_BASE_URL") ?? "",
      FRONTEND_URL,
    );

    const paymentUrl = buildIciciEazypayUrl({
      baseUrl,
      merchantId,
      submissionId,
      aesKey,
      referenceNo: orderId,
      amountStr,
      returnUrl: returnUrlPlain,
      paymode,
      optionalPipe,
      registrationData,
    });

    return corsJson({
      success: true,
      orderId,
      gateway: "icici-eazypay",
      redirectMode: "location",
      paymentUrl,
      paymentData: null,
    });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "Failed to create payment order";
    return corsJson({ error: msg }, 500);
  }
});