# Stripe payment provider
We are using Stripe as payment provider. Here are the steps to setup your Stripe account for this starter.

## Setting up a webhook
As part of setting up Supabase we created and published the `stripe-webhook` edge function. Now it's time to wire it up to receive events from Stripe. Go to `Developers -> Webhooks` and click `add endpoint`. Enter the URL of the `stripe-webhook` edge function as the endpoint URL for the hook (looks something like this: `https://<SUPABASE_PROJECT_ID>.supabase.co/functions/v1/stripe-webhook`). After that choose the events to listen to:

- `customer.subscription.updated`
- `customer.subscription.deleted`

That's it.

## Setting up the keys
In this project we are using Stripes API. In order to be able to connect to Stripe you need to get a couple of keys and store them in your local `.env` file (`./supabase/functions/.env`). The projects `.gitignore` is set up to prevent this file from being published in your git repository. It should contain the following keys:

```
STRIPE_PUBLISHABLE_KEY=pk_****
STRIPE_SECRET_KEY=sk_****
STRIPE_WEBHOOK_SIGNING_SECRET=whsec_****
```

You'll get those keys from the Stripe developer dashboard. The first two are located under `Developers -> API key` and the signing secret you'll find in `Developers -> Webhooks`. There select the webhook you created earlier an click `Reveal` on the signing secret tab. 

Once you got the keys you need to publish them to Supabase. This is pretty easy using the Supabase CLI. Just run `npx supabase secrets set --env-file ./supabase/functions/.env --project-ref <SUPABASE_PROJECT_ID>` from your project root.

## Create product(s) ...
In this example we'll build a 'hard paywall'. So we'll only add one product that enables using the application. The product will have two prices. One for monthly and one for annual payments.

### ... use the script
In `./stripe` you'll find a `create-plan.js` script. You could use this script to setup the products for your plan(s) in Stripe:

```js
createPlans({
    productName: 'MyApp Plan',
    prices: [
        // monthly subscription for 3.99 EUR
        { 
            key: 'monthly', 
            interval: 'month', 
            currency: 'eur', 
            unit_amount: '399' 
        },
        // annual subscription for 39.99 EUR
        { 
            key: 'annual', 
            interval: 'year', 
            currency: 'eur', 
            unit_amount: '3999' 
        },
    ]
});
```

Once you configured your product and prices run `node create-plans`.

### ... using Stripe dashboard
Go to `Product catalog` and click `Add a product`. Add a fancy name. For pricing choose `More pricing options`.

Choose `recurring` and add `Flat rate` as pricing model. Add your price as well as `monthly` for the billing period. Also setup a `Lookup key` of `monthly_subscription`. We'll use that key inside our app later on. Klick `next` to save and `Add another price` to add the annual price (again assigning a `Lookup key` of `annual_subscription`). After that click `Add product` to save what you created.





