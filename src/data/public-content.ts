import { services, faqs } from "./services.ts";
import { projects } from "./projects.ts";
import { approach, site } from "./site.ts";

export type PublicSection = {
  heading: string;
  paragraphs?: string[];
  items?: string[];
};
export type PublicPage = {
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  revised: string;
  kind: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  sections: PublicSection[];
  links: { label: string; href: string }[];
  questions?: { question: string; answer: string }[];
  status?: string;
};
const serviceTitles = [
  "Web Development for Businesses & Startups | SanoraWorks",
  "Product Engineering & MVP Development | SanoraWorks",
  "AI & Workflow Automation Services | SanoraWorks",
  "Cloud Deployment & DevOps Services | SanoraWorks",
];
const serviceHeadings = [
  "Web development for businesses and startups",
  "Product engineering and MVP development",
  "AI and workflow automation services",
  "Cloud deployment and DevOps services",
];
export const serviceBoundaries: Record<string, string> = {
  "software-web-development":
    "Pages, user roles, integrations, content responsibilities, and maintenance are agreed in the scope. A website launch does not guarantee enquiries or search rankings.",
  "product-engineering":
    "An MVP focuses on a defined user journey. Features beyond that first release, ownership, licensing, and later development are agreed separately. A prototype does not establish market demand.",
  "ai-intelligent-automation":
    "We agree on data access, provider costs, human review, and exception handling before implementation. AI output can be wrong; consequential decisions and outgoing drafts need the agreed review process.",
  "cloud-infrastructure":
    "Hosting costs, account access, alerts, backup needs, and ongoing operational responsibilities are agreed in scope. Monitoring does not guarantee uninterrupted service or round-the-clock incident response.",
};
const serviceQuestions = [
  {
    question: "What can a business website or web application include?",
    answer:
      "A project can include company and service pages, enquiry forms, booking flows, customer portals, internal dashboards, and connections to existing tools. The agreed scope defines which pages, workflows, and integrations are included.",
  },
  {
    question: "What is included in an MVP development project?",
    answer:
      "We define the intended users and core journey, prioritise requirements, review a prototype, and scope a first release around the essential features. Further features are considered after that initial scope.",
  },
  {
    question: "Does every workflow need AI?",
    answer:
      "No. An API integration or scheduled task may be enough for a repeatable process. We consider AI where interpretation or drafting is useful, with sample-input testing, human review, and a defined failure path.",
  },
  {
    question: "Can you deploy an existing application?",
    answer:
      "We can review the application, current hosting, access requirements, usage expectations, and budget, then scope environment setup, a repeatable release workflow, and monitoring where needed.",
  },
];
const processSection: PublicSection = {
  heading: "How a project moves forward",
  items: approach.map((step) => `${step.name}: ${step.detail}`),
};
const serviceLinks = services.map((s) => ({
  label: s.title,
  href: `/services/${s.slug}`,
}));
const projectLinks = projects.map((p) => ({
  label: `${p.name} — In development`,
  href: `/work/${p.slug}`,
}));

const core: PublicPage[] = [
  {
    path: "/",
    title: "Web Development, Products, AI & Cloud | SanoraWorks",
    description:
      "Web development, product engineering, AI workflow automation, and cloud deployment for businesses and startups. Explore all four SanoraWorks services.",
    h1: "Web development, product engineering, AI automation, and cloud services",
    intro: site.description,
    revised: "2026-11-17",
    kind: "WebPage",
    sections: services
      .map<PublicSection>((s) => ({
        heading: s.title,
        paragraphs: [s.description, s.fit],
      }))
      .concat([processSection]),
    links: [
      ...serviceLinks,
      ...projectLinks,
      { label: "Discuss your project", href: "/contact" },
    ],
  },
  {
    path: "/services",
    title: "Web, Product, AI & Cloud Services | SanoraWorks",
    description:
      "Compare SanoraWorks web development, product engineering, AI workflow automation, and cloud deployment services. Explore suitable projects and deliverables.",
    h1: "Explore web development, product engineering, AI automation, and cloud services",
    intro:
      "Choose the service closest to your situation. The examples below show what we can build; we agree on the deliverables for your project before work starts.",
    revised: "2026-11-17",
    kind: "CollectionPage",
    sections: services
      .map<PublicSection>((s) => ({
        heading: s.title,
        paragraphs: [s.detail, s.fit, s.tools],
        items: [...s.capabilities, ...s.deliverables],
      }))
      .concat([processSection]),
    links: [
      ...serviceLinks,
      { label: "Discuss your project", href: "/contact" },
    ],
    questions: [...faqs],
  },
  {
    path: "/about",
    title: "About SanoraWorks | Websites, Software & Automation",
    description:
      "Learn about SanoraWorks, an independent company building websites, software, and automation for businesses and startups, and how we scope, review, and hand over work.",
    h1: "About SanoraWorks",
    intro:
      "An independent company building websites and software for business owners and startup founders.",
    revised: "2026-11-17",
    kind: "AboutPage",
    sections: [
      {
        heading: "From a business task to a working application",
        paragraphs: [
          "You might need a website that explains your services, an internal tool to replace a spreadsheet, or a first version of a product. We work with you to decide what it needs to do, then design, build, test, and prepare it for use.",
          "Before development begins, we agree on the scope, deliverables, and milestones. You review the work as it develops, and we plan the documentation, handover, and any ongoing support with you.",
          "Alongside our services, we are working on four independent projects: SlotBreeze for service bookings, ProofHuddle for client feedback and approvals, EnquiryWing for organising enquiries, and UptimePerch for website monitoring and cloud operations. All four are in development.",
        ],
      },
      processSection,
    ],
    links: [
      ...serviceLinks,
      { label: "Projects in development", href: "/work" },
      { label: "Contact SanoraWorks", href: "/contact" },
    ],
  },
  {
    path: "/contact",
    title: "Contact SanoraWorks | Discuss Your Project",
    description:
      "Contact SanoraWorks about a website, software product, automation, or cloud project. Share your needs, current tools, and constraints so we can discuss the next step.",
    h1: "Contact SanoraWorks about your project",
    intro: "Describe your business, a task to improve, or a product idea.",
    revised: "2026-11-17",
    kind: "ContactPage",
    sections: [
      {
        heading: "What to include",
        paragraphs: [
          "Tell us who will use it, what they need to do, and how you handle the task today. Include any timing or budget constraints you already know. A rough description is enough to begin.",
        ],
      },
      {
        heading: "What happens after an enquiry?",
        paragraphs: [
          "We review your message, reply with any questions, and discuss a suitable next step. Scope, deliverables, pricing, and support are agreed before implementation begins. Sending an enquiry does not create a project agreement.",
        ],
      },
    ],
    links: [
      ...serviceLinks,
      { label: "Privacy Policy", href: "/privacy" },
      ...(site.email
        ? [{ label: site.email, href: `mailto:${site.email}` }]
        : []),
    ],
  },
  {
    path: "/work",
    title: "Software Projects in Development | SanoraWorks",
    description:
      "Explore SlotBreeze, ProofHuddle, EnquiryWing, and UptimePerch: SanoraWorks projects in development for bookings, approvals, AI enquiries, and website monitoring.",
    h1: "Software projects in development",
    intro:
      "Four projects we are working on to make bookings, client reviews, incoming enquiries, and website operations easier to manage. Previews are illustrative interface concepts; public products are not available yet.",
    revised: "2026-11-17",
    kind: "CollectionPage",
    status: "In development",
    sections: projects.map((p) => ({
      heading: p.name,
      paragraphs: [p.description, p.status],
    })),
    links: [
      ...projectLinks,
      ...serviceLinks,
      { label: "Discuss a similar project", href: "/contact" },
    ],
  },
];

export const servicePages: PublicPage[] = services.map((s, i) => {
  const project = projects.find((p) => p.serviceSlug === s.slug)!;
  return {
    path: `/services/${s.slug}`,
    title: serviceTitles[i],
    description: [
      "Business websites, customer portals, and custom web applications from SanoraWorks. Explore suitable projects, deliverables, integrations, and the enquiry process.",
      "Scope a prototype, MVP, or product improvement with SanoraWorks. Explore product engineering deliverables, user journeys, review stages, and handover.",
      "Automate enquiry routing, document handling, and repeatable business workflows with SanoraWorks. Explore integrations, reviewed AI drafts, and exception handling.",
      "Plan application hosting, repeatable deployments, monitoring, and release workflows with SanoraWorks. Explore cloud and DevOps services for businesses and startups.",
    ][i],
    h1: serviceHeadings[i],
    intro: s.description,
    revised: "2026-11-17",
    kind: "WebPage",
    sections: [
      { heading: "When this service fits", paragraphs: [s.fit, s.detail] },
      { heading: "Suitable projects", items: [...s.capabilities] },
      { heading: "Typical deliverables", items: [...s.deliverables] },
      {
        heading: "Business applications",
        paragraphs: project.businessUses.map(
          (u) => `${u.title}: ${u.description}`,
        ),
      },
      processSection,
      {
        heading: "Scope and responsibilities",
        paragraphs: [serviceBoundaries[s.slug]],
      },
      { heading: "Technology choices", paragraphs: [s.tools] },
      {
        heading: `Explore ${project.name}`,
        paragraphs: [
          project.description,
          `${project.name} is in development. Images are illustrative concepts; a public product is not available yet.`,
        ],
      },
    ],
    questions: [serviceQuestions[i], ...faqs.slice(2)],
    links: [
      {
        label: `Discuss ${s.shortTitle.toLowerCase()}`,
        href: `/contact?service=${s.slug}`,
      },
      {
        label: `${project.name} — In development`,
        href: `/work/${project.slug}`,
      },
      ...serviceLinks.filter((l) => l.href !== `/services/${s.slug}`),
      { label: "Compare all services", href: "/services" },
    ],
  };
});
const projectTitles: Record<string, string> = {
  slotbreeze: "SlotBreeze: Booking Website Project",
  proofhuddle: "ProofHuddle: Client Approval Workspace",
  enquirywing: "EnquiryWing: AI Enquiry Assistant",
  uptimeperch: "UptimePerch: Website Monitoring Project",
};
const projectDescriptions: Record<string, string> = {
  slotbreeze:
    "Explore SlotBreeze, a SanoraWorks booking website project in development for service businesses. View its intended appointment workflows and illustrative concept.",
  proofhuddle:
    "Explore ProofHuddle, a SanoraWorks client approval workspace in development. See planned deliverable reviews, feedback, versions, and approval workflows.",
  enquirywing:
    "Explore EnquiryWing, a SanoraWorks AI enquiry assistant in development. See planned request summaries, follow-up questions, and reply drafts with human review.",
  uptimeperch:
    "Explore UptimePerch, a SanoraWorks website monitoring project in development. See planned availability checks, incident history, alerts, and release visibility.",
};
const projectPages: PublicPage[] = projects.map((p) => ({
  path: `/work/${p.slug}`,
  title: `${projectTitles[p.slug]} | SanoraWorks`,
  description: projectDescriptions[p.slug],
  h1: `${p.name}: ${p.category.toLowerCase()}`,
  intro: p.description,
  revised: "2026-11-17",
  kind: "WebPage",
  status: p.status,
  sections: [
    { heading: `What is ${p.name}?`, paragraphs: [p.overview] },
    {
      heading: "Development status",
      paragraphs: [
        `${p.name} is in development. Features describe the planned direction. Previews are illustrative interface concepts; a public product is not available yet.`,
      ],
    },
    {
      heading: "The problem it is designed to help with",
      paragraphs: [p.problem],
    },
    {
      heading: "What we are working towards",
      paragraphs: p.features.map((f) => `${f.title}: ${f.description}`),
    },
    {
      heading: "How a similar system could help your business",
      paragraphs: [
        ...p.businessUses.map((u) => `${u.title}: ${u.description}`),
        p.businessValue,
      ],
    },
    { heading: "Who it could be useful for", items: p.audience },
  ],
  links: [
    { label: p.discipline, href: `/services/${p.serviceSlug}` },
    {
      label: "Discuss a similar project",
      href: `/contact?service=${p.serviceSlug}`,
    },
    ...projectLinks.filter((l) => l.href !== `/work/${p.slug}`),
  ],
}));

// Policy copy is public; no enquiry contents, private files, or operational secrets enter this model.
export const legalPages: PublicPage[] = [
  {
    path: "/privacy",
    title: "Privacy Policy | SanoraWorks",
    description:
      "Read how SanoraWorks handles project enquiry details, email delivery, public service requests, and technical information used to operate this website.",
    h1: "Privacy Policy",
    intro:
      "An explanation of the information this website uses and what happens when you send a project enquiry.",
    revised: "2026-11-17",
    kind: "WebPage",
    sections: [
      {
        heading: "Project enquiry information",
        paragraphs: [
          "The enquiry form asks for your name, email address, project type, and description. Company and estimated budget are optional. Please avoid including passwords, financial account details, or other sensitive information in your message.",
        ],
      },
      {
        heading: "When you send an enquiry",
        paragraphs: [
          "The form sends your details through our Cloudflare-hosted website and Cloudflare Email Service to our Gmail inbox, where Google processes the email. We use this information to respond to your enquiry. Your email address is included as the Reply-To address so we can reply directly. We do not add you to a marketing list.",
          "The website does not save form drafts in browser storage or a project database. A failed submission keeps your entries on the page so you can retry. Enquiries received in our mailbox are retained as business correspondence; you can contact us to request deletion.",
        ],
      },
      {
        heading: "Website operation",
        paragraphs: [
          "This website does not include advertising trackers or visitor analytics scripts. Fonts and interface assets are served with the website. The hosting provider may process technical request information, such as IP addresses and request timestamps, to operate the service. We use a digest of the connecting IP address to limit repeated form submissions, together with a hidden field to reject automated spam. Application error logs contain delivery error codes, not enquiry contents.",
          "Public read-only APIs and MCP provide only published website information. A separate IP-based request limit protects MCP access. These public interfaces cannot retrieve enquiry messages or private files.",
        ],
      },
      {
        heading: "External links",
        paragraphs: [
          "Links to external services take you to services with their own privacy policies.",
        ],
      },
      {
        heading: "Questions and requests",
        paragraphs: [
          `For questions about information you have shared, contact ${site.email || "us through the Contact page"}.`,
        ],
      },
      {
        heading: "Updates",
        paragraphs: [
          "This notice will be updated as the website’s services and handling of information change. The date above identifies the current version.",
        ],
      },
    ],
    links: [{ label: "Contact SanoraWorks", href: "/contact" }],
  },
  {
    path: "/terms",
    title: "Terms of Service | SanoraWorks",
    description:
      "Read the SanoraWorks website terms covering project enquiries, separate service agreements, independent projects in development, and illustrative previews.",
    h1: "Terms of Service",
    intro:
      "Information about the website, the work presented here, and the starting point for a project conversation.",
    revised: "2026-11-17",
    kind: "WebPage",
    sections: [
      {
        heading: "About this website",
        paragraphs: [
          "The SanoraWorks website introduces our technology and engineering services and independent projects. Its content is general information. A project enquiry or conversation does not create a service agreement or a commitment to deliver work.",
        ],
      },
      {
        heading: "Project agreements",
        paragraphs: [
          "Scope, deliverables, schedule, pricing, ownership, support, and other commercial terms are defined in a separate written project agreement. Budget ranges in the enquiry form help describe a project; they are not quotes or published service prices.",
        ],
      },
      {
        heading: "Independent projects and previews",
        paragraphs: [
          "SlotBreeze, ProofHuddle, EnquiryWing, and UptimePerch are independent projects in development. Descriptions explain their planned direction and possible uses. Interface previews are illustrative concepts, not screenshots of available products. Features may change as development progresses; technology stacks and external URLs are only published when confirmed.",
        ],
      },
      {
        heading: "Website content",
        paragraphs: [
          "SanoraWorks branding and original website content are reserved by their respective owners. Third-party software, fonts, and other licensed materials retain their own licenses. Linking to this website does not transfer rights to its content.",
        ],
      },
      {
        heading: "Responsible use",
        paragraphs: [
          "Please use the website and enquiry form for legitimate conversations. Do not submit malicious code, unwanted bulk messages, private credentials, or information you are not authorised to share.",
        ],
      },
      {
        heading: "Availability and external services",
        paragraphs: [
          "Website content and availability may change. External links lead to services operated separately from this website. A form error means delivery has not been confirmed; keep a copy of your brief if needed.",
        ],
      },
      {
        heading: "Questions",
        paragraphs: [
          "Visit the Contact page for the current contact options, and read the Privacy Policy for details about enquiry information.",
        ],
      },
    ],
    links: [
      { label: "Contact page", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];
export const publicPages: PublicPage[] = [
  ...core,
  ...servicePages,
  ...projectPages,
  ...legalPages,
];
export function getPublicPage(path: string) {
  return publicPages.find((p) => p.path === path);
}
export function requirePublicPage(path: string): PublicPage {
  const page = getPublicPage(path);
  if (!page) throw new Error("Unknown public page");
  return page;
}
export function pageMarkdown(page: PublicPage): string {
  return (
    [
      `# ${page.h1}`,
      `Canonical: ${site.url}${page.path}`,
      `Content revised: ${page.revised}`,
      ...(page.status
        ? [`Status: ${page.status}. Previews are illustrative concepts.`]
        : []),
      page.intro,
      ...page.sections.flatMap((s) => [
        `## ${s.heading}`,
        ...(s.paragraphs ?? []),
        ...(s.items?.map((item) => `- ${item}`) ?? []),
      ]),
      ...(page.questions?.flatMap((q) => [`## ${q.question}`, q.answer]) ?? []),
      "## Related pages",
      ...page.links.map(
        (l) => `- [${l.label}](${new URL(l.href, site.url).href})`,
      ),
    ].join("\n\n") + "\n"
  );
}
export function publicSiteInfo() {
  return {
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.email,
    services: serviceLinks,
    pages: publicPages.map((p) => ({
      path: p.path,
      title: p.title,
      url: `${site.url}${p.path}`,
    })),
    contentPreferences: { search: true, aiInput: true, aiTrain: false },
  };
}
export function publicServices() {
  return services.map((s) => ({
    ...s,
    url: `${site.url}/services/${s.slug}`,
    page: requirePublicPage(`/services/${s.slug}`),
  }));
}
export function publicProjects() {
  return projects.map((p) => ({
    ...p,
    url: `${site.url}/work/${p.slug}`,
    previewNotice:
      "Illustrative interface concept. In development; not a public product.",
  }));
}
