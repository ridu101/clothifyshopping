// SSLCommerz session initiator (sandbox)
// Creates a pending order and returns the GatewayPageURL for redirection.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const STORE_ID = Deno.env.get("SSLCZ_STORE_ID") ?? "testbox";
const STORE_PASS = Deno.env.get("SSLCZ_STORE_PASSWORD") ?? "qwerty";
const SANDBOX = (Deno.env.get("SSLCZ_SANDBOX") ?? "true") === "true";
const API_URL = SANDBOX
  ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
  : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: cErr } = await supabase.auth.getClaims(token);
    if (cErr || !claims?.claims) return json({ error: "Unauthorized" }, 401);
    const userId = claims.claims.sub as string;

    const body = await req.json();
    const {
      customerName, phone, address, city, deliveryType,
      items, subtotal, deliveryCharge, totalPrice, returnOrigin,
    } = body ?? {};

    if (!customerName || !phone || !address || !city || !Array.isArray(items) || !totalPrice) {
      return json({ error: "Missing required fields" }, 400);
    }

    // Insert pending order
    const { data: inserted, error: insErr } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        customer_name: customerName,
        phone, address, city,
        delivery_type: deliveryType,
        items, subtotal, delivery_charge: deliveryCharge,
        total_price: totalPrice,
        payment_method: "sslcommerz",
        payment_status: "pending",
        status: "pending",
      })
      .select()
      .single();
    if (insErr || !inserted) {
      console.error("order insert failed", insErr);
      return json({ error: "Failed to create order" }, 500);
    }

    const tranId = `CLF-${inserted.id.slice(0, 8)}-${Date.now()}`;
    await supabase.from("orders").update({ transaction_id: tranId }).eq("id", inserted.id);

    const origin = (returnOrigin && typeof returnOrigin === "string")
      ? returnOrigin.replace(/\/$/, "")
      : (req.headers.get("origin") ?? "");
    const projectRef = (Deno.env.get("SUPABASE_URL") ?? "").match(/https:\/\/([^.]+)/)?.[1];
    const fnBase = `https://${projectRef}.functions.supabase.co/sslcommerz-ipn`;

    const params = new URLSearchParams({
      store_id: STORE_ID,
      store_passwd: STORE_PASS,
      total_amount: String(totalPrice),
      currency: "BDT",
      tran_id: tranId,
      success_url: `${fnBase}?action=success&order=${inserted.id}`,
      fail_url: `${fnBase}?action=fail&order=${inserted.id}`,
      cancel_url: `${fnBase}?action=cancel&order=${inserted.id}`,
      ipn_url: `${fnBase}?action=ipn&order=${inserted.id}`,
      shipping_method: "Courier",
      product_name: items.map((i: any) => i.product?.title ?? "Item").slice(0, 3).join(", ").slice(0, 200),
      product_category: "Apparel",
      product_profile: "general",
      cus_name: customerName,
      cus_email: claims.claims.email ?? "customer@clothify.local",
      cus_add1: address,
      cus_city: city,
      cus_country: "Bangladesh",
      cus_phone: phone,
      ship_name: customerName,
      ship_add1: address,
      ship_city: city,
      ship_country: "Bangladesh",
      ship_postcode: "1200",
      // Custom data so IPN/redirect knows where to send the user back
      value_a: origin,
      value_b: inserted.id,
    });

    const sslRes = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const sslJson = await sslRes.json();

    if (sslJson?.status !== "SUCCESS" || !sslJson?.GatewayPageURL) {
      console.error("SSLCommerz init failed", sslJson);
      await supabase.from("orders").update({ payment_status: "failed" }).eq("id", inserted.id);
      return json({ error: sslJson?.failedreason ?? "Gateway init failed", details: sslJson }, 502);
    }

    return json({
      gatewayUrl: sslJson.GatewayPageURL,
      orderId: inserted.id,
      transactionId: tranId,
    });
  } catch (e) {
    console.error(e);
    return json({ error: String(e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
