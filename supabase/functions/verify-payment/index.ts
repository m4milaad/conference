import { corsJson, handleOptions } from "../_shared/cors.ts";
import { iciciAes128Decrypt, validateIciciAesKey } from "../_shared/iciciEazypayCrypto.ts";
import { createPaymentCompletionProof } from "../_shared/paymentCompletionProof.ts";
import CryptoJS from "npm:crypto-js@4.2.0";

function normalizeQuery(query: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(query).map(([k, v]) => [
      k.trim().replace(/\s+/g, "_").toLowerCase(),
      typeof v === "string" ? v : String(v),
    ]),
  );
}

function getParam(query: Record<string, string>, keys: string[]): string | undefined {
  for (const key of keys) {
    const k = key.trim().replace(/\s+/g, "_").toLowerCase();
    if (query[k] !== undefined && query[k] !== "") return query[k];
  }
  return undefined;
}

function hashSha512(input: string): string {
  return CryptoJS.SHA512(input).toString(CryptoJS.enc.Hex);
}

function parseAmpersandResponse(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  const text = String(raw ?? "").trim();
  if (!text) return out;
  for (const pair of text.split("&")) {
    if (!pair) continue;
    const eq = pair.indexOf("=");
    const keyRaw = eq >= 0 ? pair.slice(0, eq) : pair;
    const valRaw = eq >= 0 ? pair.slice(eq + 1) : "";
    const key = keyRaw.trim();
    const value = valRaw.trim();
    if (key) out[key] = value;
  }
  return out;
}

async function verifyViaIciciVerifyUrl(merchantId: string, referenceNo: string): Promise<string | null> {
  const mid = String(merchantId ?? "").trim();
  const ref = String(referenceNo ?? "").trim();
  if (!mid || !ref) return null;

  const verifyUrl = new URL("https://eazypay.icicibank.com/EazyPGVerify");
  verifyUrl.searchParams.set("ezpaytranid", "");
  verifyUrl.searchParams.set("amount", "");
  verifyUrl.searchParams.set("paymentmode", "");
  verifyUrl.searchParams.set("merchantid", mid);
  verifyUrl.searchParams.set("trandate", "");
  verifyUrl.searchParams.set("pgreferenceno", ref);

  try {
    const resp = await fetch(verifyUrl.toString(), { method: "GET" });
    if (!resp.ok) return null;
    const body = await resp.text();
    const parsed = parseAmpersandResponse(body);
    const status = parsed.status ?? parsed.Status ?? parsed.STATUS ?? null;
    return status ? String(status).trim() : null;
  } catch (e) {
    console.error("[verify-payment] EazyPGVerify lookup failed:", e);
    return null;
  }
}

function verifyIciciResponseSignature(query: Record<string, string>, aesKey: string): boolean {
  const rs = getParam(query, ["RS", "R_S"]);
  if (!rs) {
    // Some merchants may have signature validation disabled in enrollment. Keep flow compatible.
    return true;
  }

  const merchantId = getParam(query, ["ID", "MerchantId", "Merchant ID"]) ?? "";
  const responseCode = getParam(query, ["Response_Code", "Response Code"]) ?? "";
  const uniqueRef = getParam(query, ["Unique_Ref_Number", "Unique Ref Number", "Unique_Ref_No"]) ?? "";
  const serviceTax = getParam(
    query,
    ["Service_Tax_Amount", "Service Tax Amount", "ServiceTaxAmount", "ServiceTax", "Service Tax"],
  ) ?? "";
  const processingFee = getParam(
    query,
    ["Processing_Fee_Amount", "Processing Fee Amount", "ProcessingFeeAmount"],
  ) ?? "";
  const totalAmount = getParam(query, ["Total_Amount", "Total Amount", "TotalAmount"]) ?? "";
  const txnAmount = getParam(query, ["Transaction_Amount", "Transaction Amount", "TransactionAmount"]) ?? "";
  const txnDate = getParam(query, ["Transaction_Date", "Transaction Date", "TransactionDate"]) ?? "";
  const interchange = getParam(query, ["Interchange_Value", "Interchange Value", "InterchangeValue"]) ?? "";
  const tdr = getParam(query, ["TDR"]) ?? "";
  const paymentMode = getParam(query, ["Payment_Mode", "Payment Mode", "PaymentMode"]) ?? "";
  const subMerchantId = getParam(
    query,
    ["SubMerchantId", "Sub Merchant Id", "Sub_Merchant_Id", "submerchantid"],
  ) ?? "";
  const referenceNo = getParam(
    query,
    ["ReferenceNo", "Reference No", "Reference_No", "Merchant_Txn_Ref", "Merchant Txn Ref"],
  ) ?? "";
  const tps = getParam(query, ["TPS"]) ?? "";

  const plain = [
    merchantId,
    responseCode,
    uniqueRef,
    serviceTax,
    processingFee,
    totalAmount,
    txnAmount,
    txnDate,
    interchange,
    tdr,
    paymentMode,
    subMerchantId,
    referenceNo,
    tps,
    aesKey,
  ].join("|");

  const expected = hashSha512(plain);
  return expected.toLowerCase() === rs.toLowerCase();
}

function validateOrderRef(query: Record<string, string>, aesKey: string, expectedOrderId: string): boolean {
  if (!expectedOrderId) return false;

  const merchantTxn = getParam(query, [
    "Merchant_Txn_Ref",
    "Merchant Txn Ref",
    "MerchantTxnRef",
    "Reference_No",
    "Reference No",
  ]);
  if (merchantTxn != null) return merchantTxn.trim() === expectedOrderId.trim();

  const interchange = getParam(query, ["Interchange_Value", "Interchange Value", "InterchangeValue"]);
  if (!interchange) return false;

  try {
    const decrypted = iciciAes128Decrypt(interchange, aesKey);
    const parts = decrypted.split("|").map((p) => p.trim());
    return parts.includes(expectedOrderId) || decrypted.includes(expectedOrderId);
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== "POST") return corsJson({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    const rawQuery = (body.query ?? body.params ?? {}) as Record<string, unknown>;
    const expectedOrderId = typeof body.expectedOrderId === "string" ? body.expectedOrderId.trim() : "";
    const registrantEmail = typeof body.registrantEmail === "string" ? body.registrantEmail.trim() : "";

    const query = normalizeQuery(rawQuery);
    const aesKey = (Deno.env.get("ICICI_EAZYPAY_AES_KEY") ?? "").trim();
    const merchantId = (Deno.env.get("ICICI_EAZYPAY_MERCHANT_ID") ?? "").trim();
    if (!aesKey) return corsJson({ error: "ICICI AES key not configured" }, 500);
    try {
      validateIciciAesKey(aesKey);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid ICICI AES key";
      return corsJson({ error: msg }, 500);
    }

    const responseCode = getParam(query, [
      "Response_Code",
      "Response Code",
      "ResponseCode",
    ]);

    if (!responseCode) {
      // Fallback path for merchants where return URL does not include full response packet.
      // Confirm status directly from ICICI Verify URL using merchant ID + PG reference no.
      const verifyStatus = await verifyViaIciciVerifyUrl(merchantId, expectedOrderId);
      const normalizedStatus = String(verifyStatus ?? "").trim().toLowerCase();
      const successLike = normalizedStatus === "success" || normalizedStatus === "rip" || normalizedStatus === "sip";
      if (successLike) {
        if (!registrantEmail || !registrantEmail.includes("@")) {
          return corsJson({
            success: false,
            verified: false,
            gateway: "icici-eazypay",
            error: "Invalid registrant email",
          });
        }

        const completionSecret = (Deno.env.get("PAYMENT_COMPLETION_SECRET") ?? "").trim();
        if (completionSecret.length < 16) {
          return corsJson(
            {
              error: "PAYMENT_COMPLETION_SECRET must be at least 16 characters",
            },
            500,
          );
        }

        const { proof, expiresAt } = await createPaymentCompletionProof(
          completionSecret,
          expectedOrderId,
          registrantEmail,
        );

        return corsJson({
          success: true,
          verified: true,
          gateway: "icici-eazypay",
          transactionId: expectedOrderId,
          paymentStatus: "success",
          completionProof: proof,
          completionProofExpiresAt: expiresAt,
        });
      }

      return corsJson({
        success: false,
        verified: false,
        gateway: "icici-eazypay",
        error: verifyStatus ? `Missing Response_Code (verify status: ${verifyStatus})` : "Missing Response_Code",
      });
    }

    if (responseCode !== "E000") {
      return corsJson({
        success: false,
        verified: false,
        gateway: "icici-eazypay",
        error: `Transaction failed (${responseCode})`,
      });
    }

    const signatureOk = verifyIciciResponseSignature(query, aesKey);
    if (!signatureOk) {
      return corsJson({
        success: false,
        verified: false,
        gateway: "icici-eazypay",
        error: "Signature validation failed",
      });
    }

    if (!expectedOrderId) {
      return corsJson({
        success: false,
        verified: false,
        gateway: "icici-eazypay",
        error: "Missing expected order ID",
      });
    }

    if (!validateOrderRef(query, aesKey, expectedOrderId)) {
      return corsJson({
        success: false,
        verified: false,
        gateway: "icici-eazypay",
        error: "Order mismatch",
      });
    }

    const txnId = getParam(query, [
      "Unique_Ref_Number",
      "Unique Ref Number",
      "UniqueRefNumber",
      "Bank_Reference_No",
      "BRN",
    ]) || expectedOrderId;

    if (!registrantEmail || !registrantEmail.includes("@")) {
      return corsJson({
        success: false,
        verified: false,
        gateway: "icici-eazypay",
        error: "Invalid registrant email",
      });
    }

    const completionSecret = (Deno.env.get("PAYMENT_COMPLETION_SECRET") ?? "").trim();

    if (completionSecret.length < 16) {
      return corsJson(
        {
          error: "PAYMENT_COMPLETION_SECRET must be at least 16 characters",
        },
        500,
      );
    }

    const { proof, expiresAt } = await createPaymentCompletionProof(
      completionSecret,
      expectedOrderId,
      registrantEmail,
    );

    return corsJson({
      success: true,
      verified: true,
      gateway: "icici-eazypay",
      transactionId: txnId,
      paymentStatus: "success",
      completionProof: proof,
      completionProofExpiresAt: expiresAt,
    });
  } catch (e) {
    console.error("Verify payment error:", e);
    return corsJson({
      success: false,
      verified: false,
      gateway: "icici-eazypay",
      error: "Internal verification error",
    }, 500);
  }
});