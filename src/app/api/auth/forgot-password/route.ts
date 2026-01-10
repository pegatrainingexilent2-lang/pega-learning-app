import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        // For security, don't reveal if user exists or not
        if (!user) {
            return NextResponse.json({ message: "If an account exists with that email, a reset link has been sent." });
        }

        // Generate token
        const token = crypto.randomBytes(32).toString('hex');

        // Token expires in 1 hour
        const expiry = new Date(Date.now() + 3600000);

        // Update user
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: token,
                resetTokenExpiry: expiry,
            },
        });

        const resetLink = `${process.env.NEXTAUTH_URL || 'https://pega-learning-app1.vercel.app'}/reset-password?token=${token}`;

        console.log('>>> Triggering email utility...');
        try {
            await sendPasswordResetEmail(email, resetLink);
            console.log('>>> Email utility finished successfully.');
        } catch (emailError: any) {
            console.error('>>> Email sending failed:', emailError.message);
            return NextResponse.json({ error: "Email delivery failed: " + emailError.message }, { status: 500 });
        }

        return NextResponse.json({ message: "If an account exists with that email, a reset link has been sent." });

    } catch (error: any) {
        console.error(">>> Forgot password CRASH:", error);
        return NextResponse.json({ error: "Server Error: " + error.message }, { status: 500 });
    }
}
