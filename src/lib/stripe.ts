import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
    throw new Error('STRIPE_SECRET_KEY is missing');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key', {
    apiVersion: '2024-12-18.acacia', // Use a stable version
    typescript: true,
});
