import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (session?.user?.email !== 'pegatraining.exilent2@gmail.com') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, id, topicSectionId } = await request.json();
        if (!title || !id || !topicSectionId) {
            return NextResponse.json({ error: "Title, ID, and TopicSectionID are required" }, { status: 400 });
        }

        const subTopic = await prisma.subTopic.create({
            data: {
                id,
                title,
                topicSectionId,
                order: (await prisma.subTopic.count({ where: { topicSectionId } })) + 1,
                introduction: "Default introduction content...",
                explanation: "Default explanation content...",
                implementation: "Default implementation content...",
                example: "Default example content..."
            }
        });

        return NextResponse.json(subTopic);
    } catch (error) {
        console.error("Error creating sub-topic:", error);
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

        await prisma.subTopic.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting sub-topic:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
