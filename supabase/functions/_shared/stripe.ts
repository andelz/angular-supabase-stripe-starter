import Stripe from "https://esm.sh/stripe@14.9.0?target=deno&deno-std=0.132.0&no-check";

export const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2022-08-01",
});

export const stripeCryptoProvider = Stripe.createSubtleCryptoProvider()