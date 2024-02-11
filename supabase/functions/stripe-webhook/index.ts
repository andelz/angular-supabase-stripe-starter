import { stripe, stripeCryptoProvider } from "../_shared/stripe.ts";
import { supabaseAdmin } from "../_shared/supabase.ts";

Deno.serve(async (request) => {
  const signature = request.headers.get("Stripe-Signature");

  // First step is to verify the event. The .text() method must be used as the
  // verification relies on the raw request body rather than the parsed JSON.
  const body = await request.text();
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET")!,
      undefined,
      stripeCryptoProvider,
    );
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.deleted": {
      const evt = event.data.object;
      console.log("subscription.deleted", evt);
      await supabaseAdmin
        .from("customer")
        .update({
          subscription_id: null,
          lookup_key: null,
        })
        .match({ stripe_customer_id: evt.customer });
      break;
    }
    case "customer.subscription.updated": {
      const evt = event.data.object;
      console.log("subscription.updated", evt);
      const item = evt.items.data[0];
      await supabaseAdmin
        .from("customer")
        .update({
          subscription_id: evt.id,
          lookup_key: item.price.lookup_key,
        })
        .match({ stripe_customer_id: evt.customer });
      break;
    }
    // ... handle other event types
    default: {
      console.log(`Unhandled event type ${event.type}`);
    }
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});
