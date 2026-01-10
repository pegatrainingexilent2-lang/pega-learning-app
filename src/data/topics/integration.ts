import { TopicSection } from "@/types";

export const integration: TopicSection = {
    id: "integration",
    title: "Pega Integration",
    subTopics: [
        {
            id: "connectors-services",
            title: "Connectors and Services Overview",
            content: {
                introduction: "Integration allows Pega to talk to external systems (Connectors) or external systems to talk to Pega (Services).",
                explanation: "- **Connectors**: Outbound. Pega is the client. (Connect-REST, Connect-SOAP).\n- **Services**: Inbound. Pega is the server. (Service-REST, Service-SOAP).\nSupported protocols include HTTP, JMS, MQ, File, SAP, etc.",
                implementation: "Wizard approach:\n1. Configure -> Integration -> Connectors -> Create REST Integration.\n2. Provide the endpoint URL/Swagger file.\n3. Pega automatically creates Classes, Properties, and Data Pages.",
                example: "Fetching 'Credit Score' from an external Equifax API (Connect-REST). Exposing a 'CreateCase' API so a mobile app can create Pega cases (Service-REST)."
            }
        },
        {
            id: "service-rest",
            title: "Service REST",
            content: {
                introduction: "Service REST rules execute Pega logic in response to an incoming HTTP request.",
                explanation: "Service REST is exposed using the **Service Package** (which defines auth and pooling). The Service REST rule maps URI patterns (e.g., /cases/{ID}) to an Activity. It handles parsing the Request (JSON/XML) and mapping the Response.",
                implementation: "1. Create a Service Package (Define Auth, e.g., Basic/OAuth).\n2. Create Service REST rule.\n3. Define Resource Path (e.g., /customer).\n4. Choose Method (GET, POST).\n5. Map Request Body to Clipboard Property.\n6. Run Activity.\n7. Map Clipboard Property to Response Body.",
                example: "Exposing `POST /api/v1/claims` to allow an external portal to submit insurance claims into Pega."
            }
        },
        {
            id: "connect-rest",
            title: "Connect REST",
            content: {
                introduction: "Connect REST rules allow Pega to consume external RESTful APIs.",
                explanation: "It involves:\n- **Connect REST rule**: Defines the endpoint, methods, and timeout.\n- **Data Page**: Usually wraps the connector for easy UI usage.\n- **Authentication Profile**: Stores credentials for the external API.",
                implementation: "Integration Wizard is best, but manually:\n1. Create Connect REST rule.\n2. Define Service Endpoint URL.\n3. Add Methods (GET/POST).\n4. Map Request (Header/Query/Body).\n5. Map Response (JSON to Clipboard).",
                example: "Calling a Google Maps API to validate an address entered by the user in a Flow Action."
            }
        },
        {
            id: "listeners",
            title: "Listeners (File, MQ)",
            content: {
                introduction: "Listeners run in the background, waiting for messages on specific protocols like File Systems or Message Queues (JMS/MQ).",
                explanation: "- **File Listener**: Monitors a folder. When a file arrives, it parses it (Service File) and creates a case.\n- **MQ Listener**: Listens to a Queue. When a message lands, it triggers a Service JMS/MQ.",
                implementation: "File Listener Setup:\n1. Create a Service File rule (Parse Delimited/XML).\n2. Create a File Listener rule.\n3. Point to the Server Directory.\n4. Define file pattern (*.csv).\n5. Start Listener in Admin Studio.",
                example: "A bank receives a daily batch of transactions via CSV file. A File Listener picks it up, parses each line, and creates a 'TransactionReview' case for each."
            }
        },
        {
            id: "sso-auth",
            title: "External Authentication & SSO",
            content: {
                introduction: "SSO (Single Sign-On) ensures users can access Pega without re-entering credentials if they are already authenticated by an IDP.",
                explanation: "Pega supports SAML 2.0 and OIDC (OpenID Connect). An 'Authentication Service' rule matches the incoming token to a Pega Operator ID.",
                implementation: "1. Configure -> Org & Security -> Authentication -> Create Authentication Service.\n2. Choose 'SAML 2.0'.\n3. Import the IdP metadata (from Okta, Azure AD).\n4. Map attributes (email, name) to the Operator record.",
                example: "Logging into Pega using your Corporate Microsoft Azure AD credentials."
            }
        },
        {
            id: "java-integration",
            title: "Integration with Java",
            content: {
                introduction: "Pega allows executing custom Java code when certain logic cannot be achieved effectively with Rules.",
                explanation: "You can write Java in:\n- **Activities**: 'Java' method (Avoid if possible).\n- **Functions**: Reusable code snippets (Rule-Utility-Function).\n- **External Jars**: Import 3rd party libraries via the Database/Repository.",
                implementation: "Creating a Function:\n1. Create a Library (Rule-Utility-Library).\n2. Create a Function in that Library.\n3. Write standard Java code.\n4. Save and Compile.\n5. Call in Data Transform using `@(LibName:FuncName)(param)`.",
                example: "Using a custom Java library to perform complex AES encryption which isn't natively supported by Pega OOTB functions."
            }
        }
    ]
};
