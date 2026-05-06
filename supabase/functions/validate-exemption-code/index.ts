import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsJson, handleOptions } from "../_shared/cors.ts";

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
    const { code } = await req.json();
    if (!code || typeof code !== "string") {
      return corsJson({ valid: false, msg: "Code is required" });
    }

    const normalized = code.trim().toUpperCase();
    const supabase = createClient(supabaseUrl, serviceKey);

    const { data, error } = await supabase
      .from("exemption_codes")
      .select("id, code, used_by_registration_id")
      .eq("code", normalized)
      .maybeSingle();

    if (error) {
      console.error(error);
      return corsJson({ valid: false, msg: "Validation failed" }, 500);
    }

    if (!data) {
      return corsJson({ valid: false, msg: "Invalid exemption code" });
    }

    if (data.used_by_registration_id) {
      return corsJson({ valid: false, msg: "This code has already been used" });
    }

    return corsJson({ valid: true, msg: "Code accepted — late fee waived" });
  } catch (e) {
    console.error(e);
    return corsJson({ valid: false, msg: "Validation failed" }, 500);
  }
});
