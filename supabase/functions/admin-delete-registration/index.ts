import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { verifyAdminSessionToken } from "../_shared/adminToken.ts";
import { corsJson, handleOptions } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== "POST") return corsJson({ error: "Method not allowed" }, 405);

  const secret = Deno.env.get("ADMIN_SESSION_SECRET") ?? "";
  if (!secret) {
    return corsJson({ success: false, msg: "Server misconfigured" }, 500);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !serviceKey) {
    return corsJson({ success: false, msg: "Server configuration error" }, 500);
  }

  try {
    const body = await req.json();
    const { token, registration_id } = body;
    const v = await verifyAdminSessionToken(String(token ?? ""), secret);
    if (!v.valid) {
      return corsJson({ success: false, msg: "Unauthorized" });
    }

    const rid = String(registration_id ?? "").trim();
    if (!rid) {
      return corsJson({ success: false, msg: "Missing registration_id" }, 400);
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const { data, error } = await supabase
      .from("registrations")
      .delete()
      .eq("registration_id", rid)
      .select("registration_id");

    if (error) {
      console.error(error);
      return corsJson({ success: false, msg: error.message }, 500);
    }

    if (!data?.length) {
      return corsJson({ success: false, msg: "Registration not found" }, 404);
    }

    return corsJson({ success: true });
  } catch (e) {
    console.error(e);
    return corsJson({ success: false, msg: "Failed to delete registration" }, 500);
  }
});
