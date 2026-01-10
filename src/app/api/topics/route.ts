import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (session?.user?.email !== 'pegatraining.exilent2@gmail.com') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, id } = await request.json();
        if (!title || !id) {
            return NextResponse.json({ error: "Title and ID are required" }, { status: 400 });
        }

        const topic = await prisma.topicSection.create({
            data: {
                id,
                title,
                order: (await prisma.topicSection.count()) + 1
            }
        });

        return NextResponse.json(topic);
    } catch (error) {
        console.error("Error creating topic:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await auth();
        if (session?.user?.email !== 'pegatraining.exilent2@gmail.com') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        // First delete sub-topics to avoid foreign key constraints
        await prisma.subTopic.deleteMany({
            where: { topicSectionId: id }
        });

        await prisma.topicSection.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting topic:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
