## deploy edge function

`npx supabase functions deploy stripe-checkout --project-ref tecnyhitsivyeqzotqjf --no-verify-jwt`

Delete a trigger
`drop trigger on_auth_user_created on auth.users`

## edge functions

`stripe-inventory` (NO JWT) 
`stripe-webhook` (NO JWT) 
`customer-create` (NO JWT -> trigger on auth.user) 
`stripe-checkout` (JWT) 