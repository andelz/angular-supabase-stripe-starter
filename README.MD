# Subscription Starter

Starter project for an [Angular](https://angular.io) SAAS application backed by a [Supabase](https://supabase.com) backend and [Stripe](https://stripe.com) as payment provider. It is build to be reusable in different subscription based apps. Core is the `subscription.module`. It contains user login/signup as well as onboarding and subscribing to a plan configured in Stripe.


- [How to start](docs/start.md)
- [Setup Stripe](docs/stripe.md)
- [Setup Supabase](docs/supabase.md)

## Usage in your app
This is just a starting point for your own application. Everything important is wrapped in `subscription.module`. So all you need to do is copy the modules folder into your project and import it in your `app.module`:

```ts
@NgModule({
  imports: [
    SubscriptionModule.forRoot({
      auth: {
        disableLoginWithEmail: false,
        providers: [{ id: "google", label: "Google" }],
      },
      supabase: {
        key: environment.SUPABASE_KEY,
        url: environment.SUPABASE_URL,
      },
      tables: {
        profile: "user_profile",
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

As you see, there is a config you have to pass to the module. This way you can use it without having to code anything. But you might also tweak the code so it fits your special needs. It should just give you a starting point that covers most of the basic stuff related to subscriptions.

If you followed the setup guides for Supabase and Stripe, you'll end up with the following tables:

- `customer` table: This table is only accessible by the Supabase service account (and therefore pretty private). It contains details of the customer registered in Stripe. 
- `user_profile` table: This table is only accessible by the user itself. The user may change the data. This table also contains a `subscribed` column that holds the plan the user has subscribed to through Stripe. 

## Protect your app data
In order to only allow subscribed users access to your content/data, `init.sql` defines a function (`check_user_subscribed (user_id uuid)`) to check whether or not the user is subscribed. You could use that function and define a RLS rule for your tables:

```sql
create policy "subscribed user access" on my_apps_table as permissive for
all to authenticated using (check_user_subscribed(auth.uid())) with check(check_user_subscribed(auth.uid()));
```

## Something missing?
