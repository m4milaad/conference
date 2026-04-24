import { corsHeaders } from "../_shared/cors.ts";

function trimEndSlashes(s: string): string {
  return s.replace(/\/+$/, "");
}

function parseFormEncoded(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!body) return out;
  for (const part of body.split("&")) {
    if (!part) continue;
    const eq = part.indexOf("=");
    const rawKey = eq >= 0 ? part.slice(0, eq) : part;
    const rawValue = eq >= 0 ? part.slice(eq + 1) : "";
    try {
      const key = decodeURIComponent(rawKey.replace(/\+/g, " "));
      const value = decodeURIComponent(rawValue.replace(/\+/g, " "));
      out[key] = value;
    } catch {
      out[rawKey] = rawValue;
    }
  }
  return out;
}

function appendParams(baseUrl: string, params: Record<string, string>): string {
  const url = new URL(baseUrl);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v ?? ""));
  }
  return url.toString();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const frontendUrl = trimEndSlashes(Deno.env.get("FRONTEND_URL") ?? "http://localhost:5173");
  const target = `${frontendUrl}/payment-callback`;
  const merged: Record<string, string> = {};

  const sourceUrl = new URL(req.url);
  for (const [k, v] of sourceUrl.searchParams.entries()) {
    merged[k] = v;
  }

  try {
    if (req.method === "POST") {
      const contentType = (req.headers.get("content-type") ?? "").toLowerCase();
      const rawBody = await req.text();
      if (contentType.includes("application/x-www-form-urlencoded")) {
        Object.assign(merged, parseFormEncoded(rawBody));
      } else {
        const parsed = parseFormEncoded(rawBody);
        if (Object.keys(parsed).length > 0) Object.assign(merged, parsed);
      }
    }
  } catch (e) {
    console.error("[icici-payment-callback] body parse failed", e);
  }

  const redirectUrl = appendParams(target, merged);
  return Response.redirect(redirectUrl, 302);
});
