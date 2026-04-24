import { invokeEdge } from "../lib/supabaseFunctions";

const ICICI_HOST_RE = /(^|\.)icicibank\.com$/i;

function parseUrlOrNull(raw) {
  try {
    return new URL(String(raw));
  } catch {
    return null;
  }
}

function assertGatewayRedirectUrl(paymentUrl) {
  const parsed = parseUrlOrNull(paymentUrl);
  if (!parsed) {
    throw new Error("Invalid payment URL returned by server.");
  }

  // Prevent accidental self-redirects to local callback pages.
  if (parsed.origin === window.location.origin) {
    throw new Error(
      "Payment gateway URL is misconfigured (points to this website instead of ICICI checkout).",
    );
  }

  if (!ICICI_HOST_RE.test(parsed.hostname)) {
    throw new Error(
      "Payment gateway URL is invalid (expected an ICICI bank checkout URL).",
    );
  }

  return parsed.toString();
}

/**
 * Creates an ICICI Eazypay checkout URL and redirects the browser (full-page GET).
 */
export async function startGatewayCheckout({ amount, currency, registrationData }) {
  const result = await invokeEdge("create-payment-order", {
    amount,
    currency,
    registrationData,
  });
  if (!result?.success) {
    throw new Error(result?.error || "Failed to create payment order");
  }

  if (result.orderId) {
    sessionStorage.setItem("pendingPaymentOrderId", result.orderId);
  }

  if (result.paymentUrl) {
    const safeGatewayUrl = assertGatewayRedirectUrl(result.paymentUrl);
    window.location.assign(safeGatewayUrl);
    return;
  }

  throw new Error("Payment URL missing from server response");
}
