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

  // Log request method and headers for debugging
  console.log("[icici-payment-callback] ===== INCOMING REQUEST =====");
  console.log("[icici-payment-callback] Method:", req.method);
  console.log("[icici-payment-callback] Content-Type:", req.headers.get("content-type"));
  console.log("[icici-payment-callback] URL:", req.url);

  // Capture GET parameters
  const sourceUrl = new URL(req.url);
  const getParams: Record<string, string> = {};
  for (const [k, v] of sourceUrl.searchParams.entries()) {
    getParams[k] = v;
    merged[k] = v;
  }
  
  if (Object.keys(getParams).length > 0) {
    console.log("[icici-payment-callback] GET Parameters:", JSON.stringify(getParams, null, 2));
  } else {
    console.log("[icici-payment-callback] GET Parameters: (none)");
  }

  // Capture POST parameters
  let postParams: Record<string, string> = {};
  let rawBody = "";
  try {
    if (req.method === "POST") {
      const contentType = (req.headers.get("content-type") ?? "").toLowerCase();
      rawBody = await req.text();
      
      console.log("[icici-payment-callback] Raw POST Body:", rawBody);
      
      if (contentType.includes("application/x-www-form-urlencoded")) {
        postParams = parseFormEncoded(rawBody);
        Object.assign(merged, postParams);
      } else {
        postParams = parseFormEncoded(rawBody);
        if (Object.keys(postParams).length > 0) Object.assign(merged, postParams);
      }
      
      if (Object.keys(postParams).length > 0) {
        console.log("[icici-payment-callback] POST Parameters:", JSON.stringify(postParams, null, 2));
      } else {
        console.log("[icici-payment-callback] POST Parameters: (none)");
      }
    }
  } catch (e) {
    console.error("[icici-payment-callback] body parse failed", e);
  }

  // Log all merged parameters with their exact names
  console.log("[icici-payment-callback] ===== MERGED PARAMETERS =====");
  console.log("[icici-payment-callback] Total parameters:", Object.keys(merged).length);
  
  // Log each parameter with its exact key name (including spaces, case, etc.)
  for (const [key, value] of Object.entries(merged)) {
    console.log(`[icici-payment-callback] "${key}" = "${value}"`);
  }
  
  // Check for Response_Code variations
  const responseCodeVariations = [
    "Response_Code", "Response Code", "ResponseCode", "response_code", 
    "response code", "responsecode", "RESPONSE_CODE", "RESPONSE CODE"
  ];
  const foundResponseCode = responseCodeVariations.find(variant => merged[variant] !== undefined);
  if (foundResponseCode) {
    console.log(`[icici-payment-callback] ✓ Found Response Code as: "${foundResponseCode}" = "${merged[foundResponseCode]}"`);
  } else {
    console.log("[icici-payment-callback] ✗ Response_Code NOT FOUND in any variation");
  }
  
  // Check for Unique Ref Number variations
  const uniqueRefVariations = [
    "Unique_Ref_Number", "Unique Ref Number", "UniqueRefNumber", "unique_ref_number",
    "unique ref number", "uniquerefnumber", "UNIQUE_REF_NUMBER", "UNIQUE REF NUMBER"
  ];
  const foundUniqueRef = uniqueRefVariations.find(variant => merged[variant] !== undefined);
  if (foundUniqueRef) {
    console.log(`[icici-payment-callback] ✓ Found Unique Ref Number as: "${foundUniqueRef}" = "${merged[foundUniqueRef]}"`);
  } else {
    console.log("[icici-payment-callback] ✗ Unique_Ref_Number NOT FOUND in any variation");
  }
  
  // Check for ReferenceNo variations
  const referenceNoVariations = [
    "ReferenceNo", "Reference No", "Reference_No", "referenceno",
    "reference no", "reference_no", "REFERENCENO", "REFERENCE NO"
  ];
  const foundReferenceNo = referenceNoVariations.find(variant => merged[variant] !== undefined);
  if (foundReferenceNo) {
    console.log(`[icici-payment-callback] ✓ Found Reference No as: "${foundReferenceNo}" = "${merged[foundReferenceNo]}"`);
  } else {
    console.log("[icici-payment-callback] ✗ ReferenceNo NOT FOUND in any variation");
  }

  console.log("[icici-payment-callback] ===== END REQUEST LOG =====");

  const redirectUrl = appendParams(target, merged);
  return Response.redirect(redirectUrl, 302);
});
