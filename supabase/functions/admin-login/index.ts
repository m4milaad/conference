import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { createAdminSessionToken } from "../_shared/adminToken.ts";
import { corsJson, handleOptions } from "../_shared/cors.ts";
import { verifyAdminPassword } from "../_shared/passwordArgon2.ts";

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== "POST") return corsJson({ error: "Method not allowed" }, 405);

  const secret = Deno.env.get("ADMIN_SESSION_SECRET") ?? "";
  if (!secret || secret.length < 16) {
    return corsJson(
      { error: "ADMIN_SESSION_SECRET is not set (min 16 chars) in Edge Function secrets" },
      500,
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !serviceKey) {
    return corsJson({ error: "Server configuration error" }, 500);
  }

  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return corsJson({ success: false, msg: "Username and password required" });
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const { data: row, error } = await supabase
      .from("admins")
      .select("id, username, password")
      .eq("username", String(username).trim())
      .maybeSingle();

    if (error) {
      console.error(error);
      return corsJson({ success: false, msg: "Server error" }, 500);
    }

    if (!row) {
      return corsJson({ success: false, msg: "Invalid credentials" });
    }

    const { ok, upgradedHash } = await verifyAdminPassword(row.password, String(password));
    if (!ok) {
      return corsJson({ success: false, msg: "Invalid credentials" });
    }

    if (upgradedHash) {
      const { error: upErr } = await supabase
        .from("admins")
        .update({ password: upgradedHash })
        .eq("id", row.id);
      if (upErr) {
        console.error("Failed to upgrade password hash:", upErr);
      }
    }

    const token = await createAdminSessionToken(row.username, secret);
    return corsJson({ success: true, token, username: row.username });
  } catch (e) {
    console.error(e);
    return corsJson({ success: false, msg: "Login failed" }, 500);
  }
});
