import { TopicSection } from "@/types";

export const enterprise: TopicSection = {
    id: "enterprise",
    title: "Enterprise Class Structure",
    subTopics: [
        {
            id: "ecs-design",
            title: "Designing Scalable Applications (ECS)",
            content: {
                introduction: "The Enterprise Class Structure (ECS) is the foundation of reuse in Pega.",
                explanation: "Layers:\n1. **Pega Platform**: The core engine.\n2. **Organization**: Enterprise-wide logic (MyOrg-).\n3. **Division**: Specific line of business (MyOrg-Finance-).\n4. **Framework**: Reusable application layer (MyOrg-Finance-AppFW-).\n5. **Implementation**: Specific deployable app (MyOrg-Finance-App-).",
                implementation: "Creating a new App with ECS:\n1. Use the 'New Application Wizard'.\n2. Select 'Built on' (e.g., Theme Cosmos).\n3. Define the Organization Name (MyCorp) and Division (Sales).\n4. Pega generates the class hierarchy automatically.",
                example: "A 'Payments' rule created in the Organization layer can be reused by both the 'Retail Banking' and 'Commercial Banking' divisions."
            }
        }
    ]
};
