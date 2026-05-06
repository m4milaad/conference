import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import QRCode from "https://esm.sh/qrcode@1.5.4";
import { corsJson, handleOptions } from "./_shared/cors.ts";
import { verifyPaymentCompletionProof } from "../_shared/paymentCompletionProof.ts";

function parseNumOrNull(val: unknown): number | null {
  if (val === "" || val === undefined || val === null) return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}

function isIciciEazypayMode(mode: unknown): boolean {
  return String(mode ?? "").trim() === "ICICI Eazypay";
}

function isTestMode(mode: unknown): boolean {
  return String(mode ?? "").trim() === "Test";
}

function truthyPaymentVerified(v: unknown): boolean {
  return v === "true" || v === true || v === 1;
}

function normalizeAttendanceMode(mode: unknown): "Online" | "Offline" {
  const normalized = String(mode ?? "").trim().toLowerCase();
  return normalized === "online" ? "Online" : "Offline";
}

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== "POST") return corsJson({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !serviceKey) {
    return corsJson({ error: "Server configuration error" }, 500);
  }

  try {
    const body = await req.json();

    const {
      fullName,
      affiliation,
      designation,
      country,
      email,
      contactNumber,
      participantType,
      paperId,
      paperTitle,
      numAuthors,
      subCategory,
      region,
      attendanceMode,
      attendWorkshop,
      totalFeeUsd,
      totalFeeInr,
      modeOfPayment,
      transactionId,
      dateOfPayment,
      declaration,
      paymentVerified,
      paymentOrderRef,
      paymentCompletionProof,
      exemptionCode,
    } = body;

    if (!fullName || !affiliation || !email || !transactionId) {
      return corsJson({ error: "Missing required fields" }, 400);
    }

    // ── Validate exemption code format (actual atomic claim happens after insert) ──
    const normalizedExemptionCode =
      typeof exemptionCode === "string" ? exemptionCode.trim().toUpperCase() : "";

    const wantsPaid = truthyPaymentVerified(paymentVerified);
    const iciciOnline = wantsPaid && isIciciEazypayMode(modeOfPayment);

    if (iciciOnline) {
      const orderRef = typeof paymentOrderRef === "string" ? paymentOrderRef.trim() : "";
      const proof = typeof paymentCompletionProof === "string" ? paymentCompletionProof.trim() : "";
      if (!orderRef || !proof) {
        return corsJson(
          {
            error:
              "Online payment registration requires a valid payment confirmation from the payment return step. Please complete checkout and return from the bank page.",
          },
          400,
        );
      }
      const secret = (Deno.env.get("PAYMENT_COMPLETION_SECRET") ?? "").trim();
      if (secret.length < 16) {
        return corsJson({ error: "Server configuration error" }, 500);
      }
      const ok = await verifyPaymentCompletionProof(secret, proof, orderRef, email);
      if (!ok) {
        return corsJson(
          { error: "Invalid or expired payment confirmation. Start again from registration if payment succeeded." },
          400,
        );
      }
    }

    const registrationId =
      `2AI-2026-${Date.now().toString(36).toUpperCase()}-${
        Math.random().toString(36).substring(2, 6).toUpperCase()
      }`;

    const qrPayload = JSON.stringify({
      registrationId,
      name: fullName,
      email,
      type: participantType,
      conference: "2AI-2026",
      timestamp: new Date().toISOString(),
    });

    const qrCodeData = await new Promise<string>((resolve, reject) => {
      QRCode.toDataURL(
        qrPayload,
        {
          width: 300,
          margin: 2,
          color: { dark: "#111111", light: "#f4efe4" },
        },
        (err: Error | null | undefined, url: string) => {
          if (err) reject(err);
          else resolve(url);
        },
      );
    });

    const decl =
      declaration === "true" || declaration === true || declaration === 1;
    const paid =
      (wantsPaid && isIciciEazypayMode(modeOfPayment)) ||
      (wantsPaid && isTestMode(modeOfPayment));

    const row = {
      registration_id: registrationId,
      full_name: fullName,
      affiliation,
      designation: designation ?? null,
      country: country ?? null,
      email,
      contact_number: contactNumber ?? null,
      participant_type: participantType ?? null,
      paper_id: paperId || null,
      paper_title: paperTitle || null,
      num_authors: parseNumOrNull(numAuthors),
      sub_category: subCategory ?? null,
      region: region ?? null,
      attend_workshop: attendWorkshop ?? null,
      attendance_mode: normalizeAttendanceMode(attendanceMode),
      total_fee_usd: parseNumOrNull(totalFeeUsd),
      total_fee_inr: parseNumOrNull(totalFeeInr),
      mode_of_payment: modeOfPayment ?? null,
      transaction_id: transactionId,
      date_of_payment: dateOfPayment || null,
      payment_proof_path: null,
      declaration: decl,
      qr_code: qrCodeData,
      payment_verified: paid,
    };

    const supabase = createClient(supabaseUrl, serviceKey);
    const { error } = await supabase.from("registrations").insert(row);

    if (error) {
      console.error(error);
      return corsJson({ error: "Database error" }, 500);
    }

    // ── Atomically claim exemption code ──────────────────────────
    // Single UPDATE with WHERE guard: only succeeds if code exists AND is still unclaimed.
    // If another user claimed it between validate-exemption-code and now, data will be empty.
    if (normalizedExemptionCode) {
      const { data: claimed, error: claimErr } = await supabase
        .from("exemption_codes")
        .update({
          used_by_registration_id: registrationId,
          used_at: new Date().toISOString(),
        })
        .eq("code", normalizedExemptionCode)
        .is("used_by_registration_id", null)
        .select("id");

      if (claimErr) {
        console.error("Exemption code claim error:", claimErr);
        // Code claim failed but registration succeeded — proceed without exemption
      } else if (!claimed || claimed.length === 0) {
        // Race condition: code was claimed by another registration between
        // validate-exemption-code and this submit. Roll back the registration
        // since the fee was calculated with the exemption applied.
        const { error: rollbackErr } = await supabase
          .from("registrations")
          .delete()
          .eq("registration_id", registrationId);

        if (rollbackErr) {
          console.error("Failed to rollback registration after code race:", rollbackErr);
        }

        return corsJson({
          error: "This exemption code was just claimed by another registration. Please re-submit without the code, or use a different code.",
          errorCode: "exemption_code_claimed",
        }, 409);
      }
    }

    return corsJson({
      success: true,
      message: "Registration successful!",
      registrationId,
      qrCode: qrCodeData,
    });
  } catch (e) {
    console.error(e);
    return corsJson({ error: "Registration failed" }, 500);
  }
});
