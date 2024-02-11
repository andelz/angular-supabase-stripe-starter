

// create subscription items using Stripe API
const path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname, '..', 'supabase', 'functions', '.env')
})
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a single product with multiple pricing intervals (monthly, annual)
const createPlans = async (cfg) => {

    const product = await stripe.products.create({ name: cfg.productName });

    for (const p of cfg.prices) {
        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: p.unit_amount,
            currency: p.currency,
            recurring: {
                interval: p.interval,
            },
            lookup_key: p.key
        });
    }
}


createPlans({
    productName: 'MyApp Plan',
    prices: [
        // monthly subscription for 3.99 EUR
        { key: 'monthly', interval: 'month', currency: 'eur', unit_amount: '399' },
        // annual subscription for 39.99 EUR
        { key: 'annual', interval: 'year', currency: 'eur', unit_amount: '3999' },
    ]
});