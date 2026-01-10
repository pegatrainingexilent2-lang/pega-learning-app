import { prisma } from "@/lib/prisma";
import { TopicViewer } from "@/components/ui/topic-viewer";
import { notFound } from "next/navigation";

// Force dynamic rendering to ensure fresh content from DB is always shown
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        topicId: string;
        subTopicId: string;
    }>;
}

export default async function LearnPage({ params }: PageProps) {
    const { topicId, subTopicId } = await params;

    // Fetch from SQLite DB
    const dbSubTopic = await prisma.subTopic.findUnique({
        where: { id: subTopicId }
    });

    if (!dbSubTopic || dbSubTopic.topicSectionId !== topicId) {
        notFound();
    }

    // Transform DB flat structure to Frontend nested structure
    const subTopic = {
        id: dbSubTopic.id,
        title: dbSubTopic.title,
        content: {
            introduction: dbSubTopic.introduction,
            explanation: dbSubTopic.explanation,
            implementation: dbSubTopic.implementation,
            example: dbSubTopic.example,
            pptUrl: dbSubTopic.pptUrl || undefined
        },
        isPremium: dbSubTopic.isPremium
    };

    return <TopicViewer data={subTopic} />;
}
