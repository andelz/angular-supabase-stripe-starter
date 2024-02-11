import { corsHeaders } from "../_shared/cors.ts";
import { Plan } from "../_shared/interface.ts";
import { stripe } from "../_shared/stripe.ts";

//  Fetching products and prices created on Stripe 
Deno.serve(async (req) => {
  // CORS: This is needed for executing edge function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {   
    const prices = await stripe.prices.list({
      expand: ["data.product"],
      active: true,
    });

    if (prices.error) throw Error(prices.error);

    const plans: Plan[] = prices.data.map((p: any) => (<Plan>{
      id: p.id,
      name: p.product.name,
      lookup_key: p.lookup_key,
      price: {
        currency: p.currency,
        value: p.unit_amount,
      },
      recurring: {
        interval: p.recurring.interval,
        interval_count: p.recurring.interval_count,
      }
    }));

    return new Response(
      JSON.stringify(plans),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
