export interface Content {
    introduction: string;
    explanation: string;
    implementation: string;
    example: string;
    pptUrl?: string; // URL to the presentation file (e.g., /presentations/topic.pptx)
}

export interface SubTopic {
    id: string;
    title: string;
    isPremium?: boolean;
    content: Content;
}

export interface TopicSection {
    id: string;
    title: string;
    subTopics: SubTopic[];
}
