export const services = [
  {
    number: "01", slug: "software-web-development", title: "Software & Web Development", shortTitle: "Software & web", icon: "code",
    description: "Custom websites, web applications, APIs, backend systems, and scalable digital platforms.",
    detail: "From a focused company website to a connected web application, we turn requirements into purposeful software. We consider the interface, the underlying system, and the way your team will maintain it.",
    capabilities: ["Websites & web applications", "APIs & backend systems", "Digital platforms", "System integrations"],
    deliverables: ["Responsive, accessible interfaces", "Documented application architecture", "Tested APIs and integration boundaries", "Deployment and handover documentation"],
    fit: "You need a new digital platform, a dependable business tool, or a clearer path for an existing application.",
    tools: "Technology choices follow the requirements. This website uses Next.js, React, TypeScript, and Tailwind CSS; the right stack for your project will be agreed during discovery.",
  },
  {
    number: "02", slug: "product-engineering", title: "Product Engineering", shortTitle: "Product engineering", icon: "layers",
    description: "End-to-end digital product development, technical architecture, prototyping, and application ecosystems.",
    detail: "Bring a new idea into focus, test the assumptions, and build a useful first release. We connect product thinking with engineering decisions so that each stage has a clear purpose and a foundation for the next.",
    capabilities: ["Product strategy & discovery", "Prototyping & MVPs", "Technical architecture", "Application ecosystems"],
    deliverables: ["Prioritised product requirements", "Prototypes for validating key interactions", "A scoped, usable first release", "A roadmap for future development"],
    fit: "You have a product idea to validate or an existing product that needs a more considered technical direction.",
    tools: "Prototypes, architecture diagrams, version control, and testing tools are selected around the product and your existing environment.",
  },
  {
    number: "03", slug: "ai-intelligent-automation", title: "AI & Intelligent Automation", shortTitle: "AI & automation", icon: "workflow",
    description: "AI-powered workflows, integrations, process automation, and intelligent business tools.",
    detail: "Make repetitive work easier and give teams more room to think. We look for practical applications of automation and AI, with clear inputs, measurable acceptance criteria, and appropriate human oversight.",
    capabilities: ["Workflow automation", "AI-powered integrations", "Process optimisation", "Intelligent business tools"],
    deliverables: ["Workflow and integration mapping", "A proof of concept for the core use case", "Defined failure and review paths", "Documentation for operating the workflow"],
    fit: "Your team spends time on repeatable tasks, disconnected tools, or information that is difficult to put to work.",
    tools: "Model providers and workflow tools are evaluated against privacy, cost, reliability, and the needs of the use case. We do not prescribe a platform before understanding the problem.",
  },
  {
    number: "04", slug: "cloud-infrastructure", title: "Cloud & Infrastructure", shortTitle: "Cloud & infrastructure", icon: "cloud",
    description: "Cloud architecture, deployment, infrastructure engineering, integrations, and performance optimisation.",
    detail: "Give your product a dependable place to run. We think through deployment, environments, visibility, and maintenance together, with infrastructure that fits the actual workload and the team operating it.",
    capabilities: ["Cloud architecture", "Deployment workflows", "Performance optimisation", "Monitoring & integrations"],
    deliverables: ["An environment and deployment plan", "Repeatable release workflows", "Monitoring and operational guidance", "Documented maintenance considerations"],
    fit: "You need to launch a product, simplify deployments, or improve the reliability of your current environment.",
    tools: "Hosting and infrastructure choices depend on workload, operational requirements, and budget. We review your current platform before proposing changes.",
  },
] as const;

export const faqs = [
  { question: "What kind of projects are a good fit?", answer: "Web applications, digital products, internal tools, practical automation, and the infrastructure behind them. We start by understanding the problem and will be straightforward about whether the work fits our capabilities." },
  { question: "Can we start with an idea rather than a full brief?", answer: "Yes. A short description of the problem, who it affects, and what you hope to achieve is enough for an initial conversation. Discovery helps turn those early thoughts into a practical scope." },
  { question: "How do you estimate timelines and cost?", answer: "We assess scope, dependencies, technical uncertainty, and the level of support required. A proposal should make deliverables, assumptions, milestones, and pricing clear before implementation starts. We do not publish a fixed promise without understanding the work." },
  { question: "Can you work with an existing product or team?", answer: "We can discuss a focused feature, a system integration, or a broader technical review. Access to the existing codebase and documentation helps us assess compatibility and identify a useful starting point." },
  { question: "What happens after launch?", answer: "We agree on documentation, handover, and any maintenance needs as part of the scope. Ongoing support and future improvements can be planned separately around the product's requirements." },
  { question: "Who owns the code and project deliverables?", answer: "Ownership, licensing, third-party dependencies, and handover arrangements should be defined in the project agreement before work begins. We aim to make those terms clear from the start." },
] as const;
