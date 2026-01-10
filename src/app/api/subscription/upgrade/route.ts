import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: { isPremium: true },
        });

        return NextResponse.json({ success: true, isPremium: user.isPremium });

    } catch (error) {
        console.error("Upgrade error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
