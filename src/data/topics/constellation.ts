import { TopicSection } from "@/types";

export const constellation: TopicSection = {
    id: "constellation",
    title: "Pega Constellation",
    subTopics: [
        {
            id: "design-system",
            title: "Design System & Architecture",
            content: {
                introduction: "Constellation is Pega's new UI architecture, separating the View (React) from the Model (Pega Engine).",
                explanation: "Unlike the Section-based UI (JSP/HTML generation), Constellation uses a JSON-based API (DX API) to drive a React-based frontend. It enforces prescriptive design patterns for consistency and performance.",
                implementation: "Using Constellation:\n1. When creating a new App, select 'Constellation' as the UI architecture.\n2. Use 'App Studio' primarily for view configuration.\n3. Views are configured as 'Templates' (e.g., List View, Details View) rather than free-form sections.",
                example: "A 'Customer 360' dashboard in Constellation loads data via REST APIs instantly, without full page reloads, providing a Single Page App (SPA) experience."
            }
        }
    ]
};
