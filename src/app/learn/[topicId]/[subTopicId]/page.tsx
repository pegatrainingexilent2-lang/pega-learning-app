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
            pptUrl: dbSubTopic.pptUrl || undefined,
            implementationPptUrl: (dbSubTopic as any).implementationPptUrl || undefined,
            examplePptUrl: (dbSubTopic as any).examplePptUrl || undefined
        },
        isPremium: dbSubTopic.isPremium
    };

    console.log(`[Server] Fetched subTopic ${subTopicId}:`, {
        ppt: dbSubTopic.pptUrl,
        imp: (dbSubTopic as any).implementationPptUrl,
        exp: (dbSubTopic as any).examplePptUrl
    });

    return <TopicViewer data={subTopic} />;
}
