import { TopicSection } from "@/types";
import { fundamentals } from "./fundamentals";
import { appDevelopment } from "./application-development";
import { integration } from "./integration";
import { advanced } from "./advanced";
import { performance } from "./performance";
import { enterprise } from "./enterprise";
import { deployment } from "./deployment";
import { constellation } from "./constellation";

export const topics: TopicSection[] = [
    fundamentals,
    appDevelopment,
    integration,
    advanced,
    performance,
    enterprise,
    deployment,
    constellation
];

export function getTopic(id: string): TopicSection | undefined {
    return topics.find((t) => t.id === id);
}

export function getSubTopic(topicId: string, subTopicId: string) {
    const topic = getTopic(topicId);
    return topic?.subTopics.find((st) => st.id === subTopicId);
}
