import { TopicSection } from "@/types";

export const appDevelopment: TopicSection = {
    id: "app-development",
    title: "Pega Application Development",
    subTopics: [
        {
            id: "flows-flow-actions",
            title: "Designing Flows and Flow Actions",
            content: {
                introduction: "Flows represent the business process, while Flow Actions are the user interactions within that process.",
                explanation: "A **Flow** rule directs the path of a case. A **Flow Action** defines the screen (Section) a user sees to complete an assignment. Flow Actions can be Connector actions (moving flow forward) or Local actions (updating data without moving forward).",
                implementation: "Key Steps:\n1. Open a Case Type.\n2. Click 'Open Process' on a stage step.\n3. Add shapes (Assignment, Decision, Subprocess).\n4. On an Assignment shape, configure the 'Flow Action' to link the UI section.",
                example: "In a Leave Request: A Flow determines that after 'Submit', the case goes to 'Manager Approval'. The 'Approve' or 'Reject' buttons are defined in the Flow Action."
            }
        },
        {
            id: "activities-data-transforms",
            title: "Activities and Data Transforms",
            content: {
                introduction: "These are the two main ways to manipulate data in Pega. Data Transforms are preferred for their lightness and maintainability.",
                explanation: "**Data Transforms**: Used for setting properties, mapping data (copying clipboard pages), and simple logic. No Java generation, easier to trace.\n**Activities**: Powerful but heavy. Used for complex logic, DB operations, or calling external Java. Use Activities only when Data Transforms cannot achieve the goal.",
                implementation: "Creating a Data Transform:\n1. Right-click class -> Create -> Data Model -> Data Transform.\n2. Use 'Set' to assign values.\n3. Use 'Update Page' to loop through lists.\n\nCreating an Activity:\n1. Create -> Technical -> Activity.\n2. Add Steps (e.g., Obj-Save, Property-Set).",
                example: "Use a Data Transform to copy 'ShippingAddress' to 'BillingAddress' if the user checks 'Same as Shipping'. Use an Activity to send a complex email with attachments or call a legacy SOAP service that requires custom headers."
            }
        },
        {
            id: "ui-design",
            title: "User Interface (UI) Design",
            content: {
                introduction: "Pega UI is built using Sections, Harnesses, and Controls, moving towards the Constellation architecture.",
                explanation: "- **Section**: The building block of UI (layouts, fields).\n- **Harness**: The container for sections (defines the full page structure).\n- **Portal**: The improved workspace where harnesses live.\n- **Dynamic UI**: Using 'Visible When' conditions and Action sets (OnClick -> Refresh Section).",
                implementation: "To build a UI:\n1. Open a Section rule.\n2. Drag and drop Layouts (Dynamic Layouts).\n3. Add Controls (Text Input, Dropdown).\n4. Configure events in the 'Actions' tab of a control for dynamic behavior.",
                example: "A 'Customer Details' section containing First Name, Last Name, and Email fields. This section is embedded in the 'Create Case' Harness."
            }
        }
    ]
};
