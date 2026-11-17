export const services = [
  {
    slug: "software-web-development",
    title: "Software & Web Development",
    shortTitle: "Software & web",
    icon: "code",
    description:
      "Company websites, customer portals, and internal tools for tasks such as enquiries, orders, and bookings.",
    detail:
      "If customers cannot find your services online, or your team manages requests across spreadsheets and email, we can build a website or application around that job. A project might include service pages, an enquiry form, a customer portal, or an order dashboard, with integrations where needed.",
    capabilities: [
      "Company and service websites",
      "Customer portals and booking tools",
      "Order and enquiry dashboards",
      "APIs connecting your existing tools",
    ],
    deliverables: [
      "Responsive, accessible interfaces",
      "The agreed pages and application features",
      "Tested APIs and integrations where scoped",
      "Deployment and handover documentation",
    ],
    fit: "You need a website for your business or a web application to manage work currently handled by hand.",
    tools:
      "This website uses Next.js, React, TypeScript, and Tailwind CSS. For your project, we choose the framework, database, and integrations after reviewing the features and maintenance needs.",
  },
  {
    slug: "product-engineering",
    title: "Product Engineering",
    shortTitle: "Product engineering",
    icon: "layers",
    description:
      "Prototypes and first releases for a new product, with scope, user journeys, and features agreed before development.",
    detail:
      "If you have a product idea but need to decide what to build first, we can map the main user journey and make a prototype for feedback. The next stage could be a first release with the essential screens, accounts, and features needed to try it with users.",
    capabilities: [
      "User journeys and feature priorities",
      "Interactive product prototypes",
      "First releases with core features",
      "New features for an existing product",
    ],
    deliverables: [
      "Prioritised product requirements",
      "Prototypes for reviewing key interactions",
      "A first release scoped around the core journey",
      "A list of possible next features",
    ],
    fit: "You want to test a product idea, plan a first release, or add a defined feature to an existing product.",
    tools:
      "We use prototypes to review interactions before committing to implementation. Frameworks, storage, and testing tools depend on the product features and any existing codebase.",
  },
  {
    slug: "ai-intelligent-automation",
    title: "AI & Intelligent Automation",
    shortTitle: "AI & automation",
    icon: "workflow",
    description:
      "Workflows that move information between tools, prepare drafts, or sort incoming documents for your team to review.",
    detail:
      "If your team copies the same information between tools or sorts incoming requests by hand, we can map the steps and automate the repeatable parts. Possible uses include routing enquiries, extracting fields from documents, or preparing a draft response for a person to check. We test the workflow with sample inputs and define what happens when it fails.",
    capabilities: [
      "Enquiry routing between tools",
      "Document field extraction",
      "Scheduled reports and data transfers",
      "Draft responses with human review",
    ],
    deliverables: [
      "A map of the workflow and integrations",
      "A proof of concept for the core task",
      "Defined failure and human review paths",
      "Instructions for operating the workflow",
    ],
    fit: "Your team repeats the same data entry, document sorting, or handoffs between tools.",
    tools:
      "Some workflows need only an API integration or a scheduled task. When AI is useful, we evaluate providers against data handling, cost, and reliability requirements, and agree on human review steps.",
  },
  {
    slug: "cloud-infrastructure",
    title: "Cloud & Infrastructure",
    shortTitle: "Cloud & infrastructure",
    icon: "cloud",
    description:
      "Hosting, deployment workflows, and monitoring for a new application or an existing one that is difficult to release.",
    detail:
      "If your application runs locally but needs to go online, or each release requires manual fixes, we can set up hosting and a repeatable deployment process. The scope could include separate test and production environments, error monitoring, or a review of slow requests.",
    capabilities: [
      "Hosting and environment setup",
      "Automated build and release workflows",
      "Application performance reviews",
      "Error monitoring and alerts",
    ],
    deliverables: [
      "An environment and deployment plan",
      "Repeatable release workflows",
      "Monitoring and operational guidance",
      "Documented maintenance considerations",
    ],
    fit: "You need to put an application online, make releases repeatable, or investigate hosting and performance issues.",
    tools:
      "We review your current hosting, expected usage, and budget before choosing a platform. Deployment and monitoring tools must fit the application and the people who will operate it.",
  },
] as const;

export const faqs = [
  {
    question: "What kind of projects are a good fit?",
    answer:
      "Business websites, customer portals, internal tools, product prototypes, workflow automation, and cloud deployments. Describe the job you need done and we will discuss whether it fits our services.",
  },
  {
    question: "Can we start with an idea rather than a full brief?",
    answer:
      "Yes. Tell us who the website or product is for, what they need to do, and any existing tools or constraints. We will ask questions to help define the scope.",
  },
  {
    question: "How do you estimate timelines and cost?",
    answer:
      "We review the features, integrations, existing code, and support needed. We then agree on deliverables, assumptions, milestones, and pricing before implementation begins.",
  },
  {
    question: "Can you work with an existing product or team?",
    answer:
      "We can discuss a focused feature, a system integration, or a technical review. Access to the existing codebase and documentation helps us assess compatibility and identify a starting point.",
  },
  {
    question: "What happens after launch?",
    answer:
      "We agree on documentation, handover, and any maintenance needs as part of the scope. Ongoing support and future improvements can be planned separately around the product’s requirements.",
  },
  {
    question: "Who owns the code and project deliverables?",
    answer:
      "Ownership, licensing, third-party dependencies, and handover arrangements are defined in the project agreement before work begins.",
  },
] as const;
