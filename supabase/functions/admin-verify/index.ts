import { verifyAdminSessionToken } from "../_shared/adminToken.ts";
import { corsJson, handleOptions } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;
  if (req.method !== "POST") return corsJson({ error: "Method not allowed" }, 405);

  const secret = Deno.env.get("ADMIN_SESSION_SECRET") ?? "";
  if (!secret) {
    return corsJson({ valid: false }, 500);
  }

  try {
    const { token } = await req.json();
    if (!token || typeof token !== "string") {
      return corsJson({ valid: false });
    }

    const v = await verifyAdminSessionToken(token, secret);
    if (!v.valid) {
      return corsJson({ valid: false });
    }
    return corsJson({ valid: true, username: v.username ?? "" });
  } catch (e) {
    console.error(e);
    return corsJson({ valid: false });
  }
});
