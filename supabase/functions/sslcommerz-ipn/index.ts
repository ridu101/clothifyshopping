// SSLCommerz IPN + redirect handler.
// Acts as success_url, fail_url, cancel_url, and ipn_url.
// Validates payment with SSLCommerz validator, updates order, then redirects
// user back to the frontend payment page.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const STORE_ID = Deno.env.get("SSLCZ_STORE_ID") ?? "testbox";
const STORE_PASS = Deno.env.get("SSLCZ_STORE_PASSWORD") ?? "qwerty";
const SANDBOX = (Deno.env.get("SSLCZ_SANDBOX") ?? "true") === "true";
const VALIDATOR = SANDBOX
  ? "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"
  : "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php";

const FALLBACK_ORIGIN = Deno.env.get("APP_ORIGIN") ?? "https://as-brand-future-fashion.vercel.app";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const action = url.searchParams.get("action") ?? "ipn";
  const orderId = url.searchParams.get("order") ?? "";

  // SSLCommerz POSTs application/x-www-form-urlencoded
  let payload: Record<string, string> = {};
  if (req.method === "POST") {
    const ct = req.headers.get("content-type") ?? "";
    if (ct.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      payload = Object.fromEntries(new URLSearchParams(text));
    } else if (ct.includes("application/json")) {
      payload = await req.json().catch(() => ({}));
    }
  }
  // value_a was set to the frontend origin during init
  const origin = payload.value_a || FALLBACK_ORIGIN;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let paymentStatus: "paid" | "failed" | "cancelled" | "pending" = "pending";

  if (action === "success" || action === "ipn") {
    // Validate with SSLCommerz
    const valId = payload.val_id;
    if (valId) {
      const v = new URL(VALIDATOR);
      v.searchParams.set("val_id", valId);
      v.searchParams.set("store_id", STORE_ID);
      v.searchParams.set("store_passwd", STORE_PASS);
      v.searchParams.set("format", "json");
      try {
        const r = await fetch(v.toString());
        const j = await r.json();
        if (j?.status === "VALID" || j?.status === "VALIDATED") {
          paymentStatus = "paid";
          await supabase.from("orders").update({
            payment_status: "paid",
            transaction_id: j.tran_id ?? payload.tran_id,
            card_type: j.card_type ?? null,
            bank_tran_id: j.bank_tran_id ?? null,
            status: "processing",
          }).eq("id", orderId);
        } else {
          paymentStatus = "failed";
          await supabase.from("orders").update({ payment_status: "failed" }).eq("id", orderId);
        }
      } catch (e) {
        console.error("validator failed", e);
        paymentStatus = "failed";
      }
    }
  } else if (action === "fail") {
    paymentStatus = "failed";
    await supabase.from("orders").update({ payment_status: "failed" }).eq("id", orderId);
  } else if (action === "cancel") {
    paymentStatus = "cancelled";
    await supabase.from("orders").update({ payment_status: "cancelled" }).eq("id", orderId);
  }

  // IPN endpoint just acknowledges
  if (action === "ipn") {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const target = `${origin.replace(/\/$/, "")}/payment/${paymentStatus === "paid" ? "success" : paymentStatus === "cancelled" ? "cancel" : "fail"}?order=${orderId}`;
  // 303 so the browser issues GET to the SPA route
  return new Response(null, { status: 303, headers: { Location: target } });
});
