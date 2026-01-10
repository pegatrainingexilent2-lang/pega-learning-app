import { TopicSection } from "@/types";

export const advanced: TopicSection = {
    id: "advanced",
    title: "Pega Advanced Features",
    subTopics: [
        {
            id: "agents-sla",
            title: "Agents and SLAs",
            content: {
                introduction: "Background processing and time management are handled by Agents and Service Level Agreements (SLAs).",
                explanation: "- **Agents**: Background processes that run mostly on a schedule (Standard vs Advanced agents). **Note**: In Pega 8+, Queue Processors and Job Schedulers replace most Agents.\n- **SLA**: Defines timelines (Goal, Deadline, Passed Deadline) and actions (escalation email, transfer assignment).",
                implementation: "Defining an SLA:\n1. Create -> Process -> Service Level Agreement.\n2. Set intervals for Goal and Deadline (e.g., 2 hours).\n3. Add Escalation Actions (Run Activity -> SendEmail).\n4. Reference this SLA in the Flow (Assignment shape settings).",
                example: "An Urgent Request must be approved within 4 hours (Goal). If not, notify the Manager. If not approved in 8 hours (Deadline), auto-reject or escalate to Director."
            }
        },
        {
            id: "security",
            title: "Security (Access Groups, Roles)",
            content: {
                introduction: "Pega uses a Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC) model.",
                explanation: "- **Access Group**: Determines the Portal and available Application.\n- **Access Role**: Bundles privileges (e.g., CanView, CanUpdate).\n- **Privileges**: Granular rights on specific rules.\n- **Access of Role to Object (ARO)**: Maps a Role to a Class with Read/Write permissions (0-5 scale).",
                implementation: "Setup:\n1. Open Operator ID.\n2. Assign Access Group (e.g., HR:Manager).\n3. Open Access Group -> Lists Access Roles.\n4. Open Access Role -> Configure ARO for specific classes (Work- vs Data-).",
                example: "A 'Manager' can view and update all Cases. A 'User' can only view cases they created. This is handled by modifying the ARO for the Work class."
            }
        }
    ]
};
