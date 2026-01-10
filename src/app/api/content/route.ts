import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { subTopicId, field, content } = body;

        if (!subTopicId || !field || content === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Validate allowed fields to prevent arbitrary updates
        const allowedFields = ['explanation', 'implementation'];
        if (!allowedFields.includes(field)) {
            return NextResponse.json({ error: "Invalid field" }, { status: 400 });
        }

        const updatedSubTopic = await prisma.subTopic.update({
            where: { id: subTopicId },
            data: {
                [field]: content
            }
        });

        return NextResponse.json(updatedSubTopic);

    } catch (error) {
        console.error("Error updating content:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
