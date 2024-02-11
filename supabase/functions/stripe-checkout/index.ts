import { corsHeaders } from "../_shared/cors.ts";
import {
  Customer,
  StripeCheckoutParams,
  StripeCheckoutResponse,
} from "../_shared/interface.ts";
import { stripe } from "../_shared/stripe.ts";
import { createOrRetrieveCustomer } from "../_shared/supabase.ts";

// Create a Stripe checkout session and return the session id
Deno.serve(async (req) => {
  // This is needed for executing edge function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const customer: Customer = await createOrRetrieveCustomer(
      req.headers.get("Authorization"),
    );
    console.log("Got stripe customer " + customer.stripe_customer_id);

    const i = await req.json() as StripeCheckoutParams;
    console.log(i);

    let res: StripeCheckoutResponse = {};

    // Depending on the params this function an perform different subscription
    // related tasks:

    // 1. Create a new checkout session
    // --------------------------------
    if (i.checkout) {
      const session = await stripe.checkout.sessions.create({
        customer: customer.stripe_customer_id,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: i.checkout.lineItems,
        success_url: `${i.checkout.redirectPath}/success`,
        cancel_url: `${i.checkout.redirectPath}/cancel`,
      });
      res.checkout = { sessionId: session.id };
    }

    // 2. Update an existing subscription
    // ----------------------------------
    if (i.update) {
      if (!customer.subscription_id) {
        throw new Error(`Can't update. No existing subscription found.`);
      }
      // retrieve customers subscription(s)
      const customerSubscription = await stripe.subscriptions.retrieve(
        customer.subscription_id,
      );
      if (!customerSubscription) {
        throw new Error(
          `Could not find subscription with ID '${customer.subscription_id}'.`,
        );
      }
      // update the subscription
      const subscription = await stripe.subscriptions.update(
        customer.subscription_id,
        {
          items: [
            {
              // ID of the subscription item to update
              id: customerSubscription.items.data[0].id,
              // ID of the new price
              price: i.update.newPrice,
            },
          ],
        },
      );
      res.update = { updatedSubscription: subscription };
    }

    // 3. Cancel an existing subscription
    // ----------------------------------
    if (i.cancel) {
      // retrieve customers subscription(s)
      const customerSubscription = await stripe.subscriptions.retrieve(
        customer.subscription_id,
      );
      console.log('sub',customerSubscription);
      
      if (!customerSubscription) {
        throw new Error(
          `Could not find subscription with ID '${customer.subscription_id}'.`,
        );
      }
      // cancel an existing subscription
      const subscription = await stripe.subscriptions.cancel(
        customerSubscription.id,
      );
      res.cancel = { canceledSubscription: subscription };
    }

    return new Response(
      JSON.stringify(res),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
