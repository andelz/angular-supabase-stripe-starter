# Supabase backend
Searching for a backend solution I came across [Supabase](https://supabase.com). They claim to be 'an open source Firebase alternative'. Don't know if that's true by all means but what they're offering is pretty impressing. What finally convinced me (beside being open source) is their tooling and most of all the excellent documentation. You should definitly check them out.

You need to sign up for their free plan and create a project. This is pretty straightforward. Once this is done you can continue. 

## Database
Setting up the Supabase backend is done by running the `supabase/sql/init.sql` in the SQL-Editor of your Supabase Studio. This will create the required tables as well as database functions, triggers and RLS (Row Level Security) rules.

## Edge functions
Second part are a set of Edge Functions that you need to deploy to your Supabase project:

- `stripe-inventory` (Browser): Returns a list of plans configured in Stripe
- `stripe-checkout` (Browser): Init a Stripe checkout session to subscribe to a plan
- `stripe-webhook` (API deploy with --no-verify-jwt): Callback for stripe webhooks

To deploy them we're gonna use the Supabase CLI. You need to [connect your CLI to your Supabase account](https://supabase.com/docs/reference/cli/supabase-login).

Edge functions triggered from the browser should be deloyed like this:
```
npx supabase functions deploy stripe-inventory --project-ref <SUPABASE_PROJECT_ID>
npx supabase functions deploy stripe-checkout --project-ref <SUPABASE_PROJECT_ID>
```
They, by default, check requests for a valid JWT or otherwise reject.

The `stripe-webhook` edge function is supposed to be triggered by Stripe webhooks. So It's an API request and there is no user or browser session involved. Therefore we need to deploy it with the `--no-validate-jwt` flag:
```
npx supabase functions deploy stripe-webhook --project-ref <SUPABASE_PROJECT_ID> --no-verify-jwt
```