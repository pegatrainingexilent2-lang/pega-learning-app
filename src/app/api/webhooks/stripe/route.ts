import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get('Stripe-Signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        );
    } catch (error: any) {
        return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
    }

    const session = event.data.object as any;

    if (event.type === 'checkout.session.completed') {
        const userEmail = session.metadata?.userEmail;

        if (userEmail) {
            await prisma.user.update({
                where: { email: userEmail },
                data: { isPremium: true },
            });
            console.log(`User ${userEmail} upgraded to Premium via Stripe.`);
        }
    }

    return NextResponse.json({ received: true });
}

// Important: Next.js by default parses the body as JSON, but Stripe needs the raw body
export const config = {
    api: {
        bodyParser: false,
    },
};
