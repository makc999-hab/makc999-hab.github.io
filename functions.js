import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler() {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: 'YOUR_PRICE_ID', quantity: 1 }],
        mode: 'subscription',
        success_url: 'https://yourdomain.com/success',
        cancel_url: 'https://yourdomain.com/cancel',
    });

    return { statusCode: 200, body: JSON.stringify({ id: session.id }) };
}
