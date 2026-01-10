import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();
    if (session?.user?.email !== 'pegatraining.exilent2@gmail.com') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            where: { isApproved: false },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();
    if (session?.user?.email !== 'pegatraining.exilent2@gmail.com') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { userId, approve } = await request.json();

        const user = await prisma.user.update({
            where: { id: userId },
            data: { isApproved: approve }
        });

        if (approve && user.email && user.name) {
            const { sendUserApprovalEmail } = await import('@/lib/email');
            await sendUserApprovalEmail(user.email, user.name);
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
