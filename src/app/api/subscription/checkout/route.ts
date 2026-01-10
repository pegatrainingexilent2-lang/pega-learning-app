import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { stripe } from '@/lib/stripe';

export async function POST() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

        // Create Stripe Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Pega Pro Lifetime Access',
                            description: 'Unlimited access to advanced Pega 25.1 curriculum and resources.',
                        },
                        unit_amount: 4900, // $49.00
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/upgrade?success=true`,
            cancel_url: `${baseUrl}/upgrade?canceled=true`,
            customer_email: session.user.email,
            metadata: {
                userEmail: session.user.email,
            },
        });

        return NextResponse.json({ url: checkoutSession.url });

    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
