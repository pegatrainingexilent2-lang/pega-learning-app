import { TopicSection } from "@/types";

export const deployment: TopicSection = {
    id: "deployment",
    title: "Pega Deployment & Implementation",
    subTopics: [
        {
            id: "packaging-migration",
            title: "Application Packaging & Migration",
            content: {
                introduction: "Moving code from Dev to QA/Prod is done via Product Rules (RAPs).",
                explanation: "- **Product Rule**: Defines what to export (Application version, RuleSets, Data).\n- **Archive**: The .zip or .jar file created.\n- **Deployment Manager**: Pega's CI/CD pipeline tool.",
                implementation: "Manual Export:\n1. Configure -> Application -> Distribution -> Package.\n2. Select the Application.\n3. Preview and 'Export' to download the ZIP.\n\nManual Import:\n1. Configure -> Application -> Distribution -> Import.\n2. Upload the ZIP.\n3. Follow the wizard to commit changes.",
                example: "Deploying 'v01.01.01' of the Loan App to the Staging server for UAT."
            }
        }
    ]
};
