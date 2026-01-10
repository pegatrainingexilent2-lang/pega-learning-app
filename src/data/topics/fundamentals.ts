import { TopicSection } from "@/types";

export const fundamentals: TopicSection = {
    id: "fundamentals",
    title: "Pega Fundamentals",
    subTopics: [
        {
            id: "intro-pega-prpc",
            title: "Introduction to Pega Platform & PRPC",
            content: {
                introduction: "Pega Platform is a low-code application development platform focused on business process management (BPM), case management, and customer engagement. Historically known as PRPC (Pega Rules Process Commander), it emphasizes model-driven development where business rules, processes, and user interfaces are defined declaratively rather than through traditional coding. In version 25.1 (part of Pega Infinity '25 series), the platform incorporates advanced generative AI features like Pega GenAI Autopilot and Blueprint for accelerated application design, while maintaining its core rule-based architecture for building scalable, agile enterprise applications.",
                explanation: "The explanation for this topic is referencing an external file path (C:\\Users\\rajen\\OneDrive\\Desktop\\BOA Training PPTs\\PEGA 7_8 _ Presentations\\3.Creating application in PEGA\\Introduction to Pega.ppt) which cannot be accessed directly.\n\nPlease copy and paste the text content from the presentation here so I can populate this section for you.",
                implementation: "In Pega 25.1, getting started involves:\n1. Accessing the Pega Personal Edition or Cloud environment.\n2. Logging in as Administrator (usually requests@pega.com).\n3. Exploring the Dev Studio to understand the 4 Studios: App Studio, Dev Studio, Admin Studio, and Prediction Studio.",
                example: "Imagine a Bank Loan Application. Instead of writing Java code for each step (Application, Review, Approval), in Pega you create a 'Case Type' called 'LoanApplication' and drag-drop stages like 'Capture Details', 'Underwriting', and 'Fulfillment'."
            }
        },
        {
            id: "bpm-concepts",
            title: "Understanding Pega’s BPM Concepts",
            content: {
                introduction: "BPM (Business Process Management) in Pega is about managing the lifecycle of a piece of work from inception to completion.",
                explanation: "Key concepts include:\n- **Case**: A specific instance of work (e.g., Loan #123).\n- **Stage**: High-level milestone (e.g., Approval Stage).\n- **Step**: Granular action within a stage (e.g., Send Email).\n- **Flow**: The diagrammatic representation of the path a case takes.",
                implementation: "To apply BPM concepts:\n1. Open App Studio.\n2. Click on 'Case Types'.\n3. Create a new Case Type (e.g., 'Onboarding').\n4. Define the high-level 'Stages' (lifecycle).\n5. Add 'Steps' to each stage.",
                example: "For an Employee Onboarding case:\n- **Stages**: New Hire Data -> Equipment Provisioning -> Orientation -> Complete.\n- **Steps in Provisioning**: Select Laptop -> Manager Approval -> IT Fulfillment."
            }
        },
        {
            id: "app-structure",
            title: "Application Structure: Classes, RuleSets, Inheritance",
            content: {
                introduction: "Pega's reusability is driven by its Class Structure, RuleSets, and Inheritance models.",
                explanation: "1. **Classes**: Templates for data or cases (e.g., Work-, Data-).\n2. **RuleSets**: Containers for rules (code), versioned for deployment.\n3. **Inheritance**: \n   - **Pattern Inheritance**: Based on naming convention (Org-App-Work).\n   - **Directed Inheritance**: Explicitly defined parent class (reusing Pega core features).",
                implementation: "To view structure:\n1. Go to App Explorer in Dev Studio.\n2. Right-click the Class name -> Definition.\n3. Observe the 'Inheritance' tab to see the hierarchy.\n4. Open the Application Definition to see the 'RuleSets' stack.",
                example: "Class: `MyOrg-Finance-Work-ExpenseReport`\n- Inherits from `MyOrg-Finance-Work` (Division layer)\n- Inherits from `MyOrg-Work` (Org layer)\n- Finally inherits from `Work-` (Pega OOTB layer)."
            }
        }
    ]
};
