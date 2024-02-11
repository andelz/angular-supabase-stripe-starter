// import { Database } from "./db_types.ts";
import { Customer } from "./interface.ts";
import { stripe } from "./stripe.ts";
// Import Supabase client
import { createClient, User } from "https://esm.sh/@supabase/supabase-js@2";

// WARNING: The service role key has admin priviliges and should only be used in secure server environments!
export const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

export const getSupabaseUser = async (authHeader: string): Promise<User> => {
  // Get JWT from auth header
  const jwt = authHeader.replace("Bearer ", "");
  // Get the user object
  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(jwt);
  if (!user) throw new Error("No user found for JWT!");
  return user;
};

export const createOrRetrieveCustomer = async (
  authHeader: string,
): Promise<Customer> => {
  const user = await getSupabaseUser(authHeader);

  // Check if the user already has a Stripe customer ID in the Database.
  const { data, error } = await supabaseAdmin
    .from("customer")
    .select("*")
    .eq("id", user?.id);
  if (error) throw error;
  if (data?.length === 1) {
    // Exactly one customer found, return it.
    const customer = data[0];
    console.log(`Found customer:`, customer);
    return customer;
  }
  if (data?.length === 0) {
    // Create customer object in Stripe.
    const stripeCustomer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_id: user.id },
    });
    // Insert new customer into DB
    const customer = await supabaseAdmin
      .from("customer")
      .insert({
        id: user.id,
        stripe_customer_id: stripeCustomer.id,
      })
      .select()
      .throwOnError();
    console.log(
      `New stripe customer "${stripeCustomer.id}" created for user "${user.id}"`,
    );
    return customer;
  } else throw new Error(`Unexpected count of customer rows: ${data?.length}`);
};
