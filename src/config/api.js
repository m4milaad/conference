/**
 * Supabase-only configuration (Edge Functions + Postgres via @supabase/supabase-js).
 */

function normalizeBase(url) {
  return String(url).trim().replace(/\/+$/, "");
}

export function getSupabaseUrl() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  if (url != null && String(url).trim() !== "") {
    return normalizeBase(url);
  }
  return "";
}

export function getSupabaseAnonKey() {
  return import.meta.env.VITE_SUPABASE_ANON_KEY || "";
}

export const SUPABASE_URL = getSupabaseUrl();
export const SUPABASE_ANON_KEY = getSupabaseAnonKey();

/**
 * Public URL for an Edge Function (for debugging or direct fetch; prefer `invokeEdge` in code).
 */
export function supabaseFunctionUrl(functionName) {
  if (!SUPABASE_URL) {
    console.error("VITE_SUPABASE_URL not configured");
    return "";
  }
  const name = functionName.startsWith("/") ? functionName.slice(1) : functionName;
  return `${SUPABASE_URL}/functions/v1/${name}`;
}

export const EDGE_FUNCTIONS = {
  CREATE_PAYMENT_ORDER: supabaseFunctionUrl("create-payment-order"),
  VERIFY_PAYMENT: supabaseFunctionUrl("verify-payment"),
  REGISTER: supabaseFunctionUrl("register"),
  VERIFY_REGISTRATION: supabaseFunctionUrl("verify-registration"),
  ADMIN_LOGIN: supabaseFunctionUrl("admin-login"),
  ADMIN_VERIFY: supabaseFunctionUrl("admin-verify"),
  ADMIN_REGISTRATIONS: supabaseFunctionUrl("admin-registrations"),
};
