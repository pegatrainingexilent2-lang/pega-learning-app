export interface Content {
    introduction: string;
    explanation: string;
    implementation: string;
    example: string;
    pptUrl?: string; // URL to the presentation for Explanation tab
    implementationPptUrl?: string; // URL for Implementation tab
    examplePptUrl?: string; // URL for Example tab
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
