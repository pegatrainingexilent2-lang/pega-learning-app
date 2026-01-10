import { TopicSection } from "@/types";

export const performance: TopicSection = {
    id: "performance",
    title: "Performance & Debugging",
    subTopics: [
        {
            id: "performance-tuning",
            title: "Performance Tuning",
            content: {
                introduction: "Performance is critical. Pega provides built-in tools to identify bottlenecks.",
                explanation: "Key tools:\n- **PAL (Performance Analyzer)**: Gathering stats on system resource usage (CPU, DB time).\n- **Pega Alerts**: Logs generated when thresholds are exceeded (e.g., PEGA0001 - Long running interaction).\n- **DB Trace**: Detailed SQL query analysis.",
                implementation: "Using PAL:\n1. Click 'Performance' in the bottom toolbar.\n2. Click 'Add Reading' to start.\n3. Perform the UI action.\n4. Click 'Add Reading' again to stop.\n5. Click 'Delta' to see the resources used by that specific action.",
                example: "Debugging a slow flow action. PAL shows high 'RA' (Rule Assembly) time, indicating the First Use Assembly (FUA) was triggered, or high DB time indicating an inefficient report."
            }
        },
        {
            id: "debugging-tools",
            title: "Debugging Tools",
            content: {
                introduction: "The Tracer is the primary debugging tool in Pega, similar to a stepper in IDEs.",
                explanation: "- **Tracer**: Real-time event logging of rules execution.\n- **Clipboard**: View memory state (pages and properties).\n- **Live UI**: Inspect UI elements and find the underlying rule.",
                implementation: "Debugging an issue:\n1. Open the Case.\n2. Click 'Tracer' in the tollbar.\n3. Ensure 'Settings' capture the relevant Event Types (Activities, Data Transforms).\n4. Perform the action.\n5. Review the Tracer output for Red lines (Failures) or unexpected variable values.",
                example: "A value is not calculating correctly. Open Tracer, watch the 'Data Transform' step, and see the value before and after the step executes."
            }
        }
    ]
};
