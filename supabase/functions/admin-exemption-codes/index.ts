import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { verifyAdminSessionToken } from "../_shared/adminToken.ts";
import { corsJson, handleOptions } from "../_shared/cors.ts";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/1/O/0 to avoid confusion
  const codeLen = 8;
  const randomBytes = new Uint8Array(codeLen);
  crypto.getRandomValues(randomBytes);
  let code = "EXEMPT-";
  for (let i = 0; i < codeLen; i++) {
    code += chars.charAt(randomBytes[i] % chars.length);
  }
  return code;
}

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== "POST") return corsJson({ error: "Method not allowed" }, 405);

  const secret = Deno.env.get("ADMIN_SESSION_SECRET") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !serviceKey || !secret) {
    return corsJson({ error: "Server configuration error" }, 500);
  }

  try {
    const { token, action, code, label, count } = await req.json();
    const session = await verifyAdminSessionToken(token, secret);
    if (!session.valid) {
      return corsJson({ success: false, msg: "Unauthorized" }, 401);
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // ── LIST ──────────────────────────────────────────────────────────
    if (action === "list") {
      const { data, error } = await supabase
        .from("exemption_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return corsJson({ success: false, msg: "Database error" }, 500);
      }

      const usedRegistrationIds = Array.from(
        new Set(
          (data ?? [])
            .map((row) => row.used_by_registration_id)
            .filter((v): v is string => typeof v === "string" && v.length > 0),
        ),
      );

      let registrationMap = new Map<string, Record<string, unknown>>();
      if (usedRegistrationIds.length > 0) {
        const { data: registrations, error: regError } = await supabase
          .from("registrations")
          .select("registration_id,full_name,email,participant_type,attendance_mode,total_fee_inr,total_fee_usd")
          .in("registration_id", usedRegistrationIds);

        if (regError) {
          console.error("Could not fetch exemption usage registrations", regError);
        } else {
          registrationMap = new Map(
            (registrations ?? []).map((r) => [String(r.registration_id), r as Record<string, unknown>]),
          );
        }
      }

      const enrichedCodes = (data ?? []).map((row) => ({
        ...row,
        used_by_registration:
          row.used_by_registration_id && registrationMap.has(String(row.used_by_registration_id))
            ? registrationMap.get(String(row.used_by_registration_id))
            : null,
      }));

      return corsJson({ success: true, codes: enrichedCodes });
    }

    // ── GENERATE ─────────────────────────────────────────────────────
    if (action === "generate") {
      const howMany = Math.min(Math.max(Number(count) || 1, 1), 50);
      const codeLabel = typeof label === "string" ? label.trim() : "";
      const newCodes: { code: string; label: string; created_by: string }[] = [];

      for (let i = 0; i < howMany; i++) {
        newCodes.push({ code: generateCode(), label: codeLabel, created_by: session.username ?? "" });
      }

      const { data, error } = await supabase
        .from("exemption_codes")
        .insert(newCodes)
        .select();

      if (error) {
        console.error(error);
        return corsJson({ success: false, msg: "Could not generate codes" }, 500);
      }
      return corsJson({ success: true, codes: data });
    }

    // ── DELETE ────────────────────────────────────────────────────────
    if (action === "delete") {
      if (!code) {
        return corsJson({ success: false, msg: "Code is required" }, 400);
      }
      const { error } = await supabase
        .from("exemption_codes")
        .delete()
        .eq("code", String(code).trim().toUpperCase());

      if (error) {
        console.error(error);
        return corsJson({ success: false, msg: "Could not delete code" }, 500);
      }
      return corsJson({ success: true });
    }

    return corsJson({ success: false, msg: "Unknown action" }, 400);
  } catch (e) {
    console.error(e);
    return corsJson({ success: false, msg: "Request failed" }, 500);
  }
});
