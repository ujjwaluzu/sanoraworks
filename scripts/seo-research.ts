import { writeFileSync } from "node:fs";
import { publicPages } from "../src/data/public-content.ts";

const web =
  "[GR8R Studio product engineering](https://gr8rstudio.com/services/product-engineering)";
const ai = "[Artificial Workflow](https://artificialworkflow.com/)";
const cloud =
  "[Startwyse cloud and DevOps](https://www.startwyse.com/services/cloud-devops)";
const notes: Record<
  string,
  {
    primary: string;
    secondary: string;
    intent: string;
    issue: string;
    examples: string;
    answer: string;
    priority: string;
  }
> = {
  "/": {
    primary: "SanoraWorks; web development; product engineering; AI automation; cloud services",
    secondary:
      "Sanora (secondary brand query); business websites; custom web applications; MVP development; workflow automation; cloud deployment",
    intent: "Branded navigation and commercial discovery",
    issue:
      "Existing title and hero focus on websites and software; AI automation and service fit are harder to identify. Service cards link to shared anchors rather than distinct buying-intent pages.",
    examples: `${web}; ${ai} (service positioning benchmarks, not evidence of brand-query competitors)`,
    answer:
      "Who does SanoraWorks help, what does it build, and which of the four services fits a particular need?",
    priority: "P1",
  },
  "/services": {
    primary: "software development and automation services",
    secondary:
      "website development; product engineering; AI automation; cloud deployment",
    intent: "Commercial comparison of four service categories",
    issue:
      "Four distinct commercial offers share one URL. Existing scope/process/FAQ copy is useful, but intent is diluted and service-specific entry pages are absent.",
    examples: `${web}; ${ai}; ${cloud}`,
    answer:
      "How do web development, product engineering, workflow automation, and deployment differ? What deliverables and review steps should a buyer expect?",
    priority: "P0",
  },
  "/services/software-web-development": {
    primary:
      "web development agency; web development for businesses and startups",
    secondary:
      "business websites; custom web applications; customer portals; booking website development",
    intent:
      "Commercial investigation of a website or business application project",
    issue:
      "New page: this intent previously existed only at /services#software-web-development, which has no independent title, description, or canonical.",
    examples: `${web} (broader engineering comparator); [MicroPyramid product engineering](https://micropyramid.com/product-engineering/) (application-delivery comparator)`,
    answer:
      "Which pages, portals, dashboards, booking flows, and integrations can be scoped? Can an existing application be improved?",
    priority: "P0",
  },
  "/services/product-engineering": {
    primary: "product engineering services; MVP development",
    secondary:
      "startup product development; product prototypes; improve an existing software product",
    intent:
      "Commercial investigation of a prototype, MVP, or defined product improvement",
    issue:
      "New page: existing product-engineering section cannot independently answer a searcher comparing an MVP engagement. Avoid conflating a prototype with demonstrated demand.",
    examples: `${web}; [Inventh product engineering](https://inventh.com/services/custom-software-development-services/product-engineering-services/)`,
    answer:
      "What belongs in the first release, what does a prototype establish, and how are later features and scope assessed?",
    priority: "P0",
  },
  "/services/ai-intelligent-automation": {
    primary: "AI automation services; business workflow automation",
    secondary:
      "enquiry automation; document automation; human-reviewed AI replies; API integrations",
    intent:
      "Commercial investigation of repeated handoffs, routing, extraction, and drafting",
    issue:
      "New page: existing automation section lacks a dedicated search landing page. Explain the choice between ordinary integration and AI, and keep human review and exception handling explicit.",
    examples: ai,
    answer:
      "Does every workflow need AI? What inputs, integrations, sample tests, exceptions, provider costs, and review responsibilities are agreed?",
    priority: "P0",
  },
  "/services/cloud-infrastructure": {
    primary: "cloud deployment services; startup DevOps",
    secondary:
      "application monitoring; deployment workflows; hosting setup; repeatable releases",
    intent:
      "Commercial investigation of taking an application online or improving releases",
    issue:
      "New page: cloud intent is buried within the general services page. Clarify operational responsibility without inventing an SLA, guaranteed uptime, or 24-hour response.",
    examples: cloud,
    answer:
      "Can an existing application be deployed? What environments, release steps, monitoring, handover, and ongoing responsibilities can be included?",
    priority: "P0",
  },
  "/about": {
    primary: "SanoraWorks company",
    secondary:
      "about SanoraWorks; software and automation capabilities; project approach",
    intent: "Branded credibility and capability assessment",
    issue:
      "Verified company and process information exists, but metadata is generic and contextual links to capabilities and independent projects are limited. No verified clients, founder biography, locations, or results are available to add.",
    examples: `${web}; ${cloud} (capability and process presentation only)`,
    answer:
      "What does this company build? How are scope, reviews, handover, and its independent projects described?",
    priority: "P1",
  },
  "/contact": {
    primary: "contact SanoraWorks",
    secondary: "discuss a software project; automation project enquiry",
    intent: "Branded transactional contact",
    issue:
      "Title/H1 “Tell us what you need” is weakly branded. Service selection already works and must be preserved; the post-enquiry process should be clearer without promising a response deadline.",
    examples: `${ai}; ${cloud} (enquiry journey benchmarks, not comparable response promises)`,
    answer:
      "What should a buyer include, what follows the enquiry, and when are scope and commercial terms agreed?",
    priority: "P1",
  },
  "/work": {
    primary: "SanoraWorks projects",
    secondary:
      "software projects in development; booking, approval, enquiry, monitoring concepts",
    intent: "Branded portfolio exploration and assessment of project direction",
    issue:
      "Existing status and illustrative labels are good. Title/H1 should state software and development status; related service links should reach dedicated pages. Do not imply client case studies or available products.",
    examples: `${web}; [Startwyse](https://www.startwyse.com/) (portfolio navigation comparisons only; their released products are not evidence about ours)`,
    answer:
      "What are the four projects designed to do, who are they for, and are they available?",
    priority: "P1",
  },
  "/work/slotbreeze": {
    primary: "SlotBreeze",
    secondary:
      "service business booking website concept; appointment workflow project",
    intent:
      "Branded project information; explore a similar scoped business application",
    issue:
      "Existing product-name-plus-status metadata is less descriptive than the booking intent. Preserve status, planned workflows, and original artwork; link the related service directly.",
    examples: `${web} (engineering scope comparator; no live-product equivalence asserted)`,
    answer:
      "How could service discovery, availability, booking changes, and an owner view fit together? Is SlotBreeze available?",
    priority: "P1",
  },
  "/work/proofhuddle": {
    primary: "ProofHuddle",
    secondary:
      "client feedback and approval workspace concept; deliverable review project",
    intent: "Branded project information and product-workflow exploration",
    issue:
      "A product name alone does not explain the review and approval workflow. Keep planned features distinct from shipped capability; no client outcomes or testimonials can be claimed.",
    examples: `${web} (product lifecycle comparator; not a claimed competing released workspace)`,
    answer:
      "Who reviews each version, where is feedback kept, and how would requests for changes and approvals be recorded?",
    priority: "P1",
  },
  "/work/enquirywing": {
    primary: "EnquiryWing",
    secondary:
      "AI enquiry management; enquiry summaries; reviewed reply drafts",
    intent: "Branded concept information and automation-workflow exploration",
    issue:
      "Project status is already accurate. Strengthen descriptive metadata and service connection while retaining unknown details and human approval for outgoing replies.",
    examples: `${ai} (workflow and review comparator)`,
    answer:
      "Which details come from the sender, what remains unknown, and who approves a prepared reply?",
    priority: "P1",
  },
  "/work/uptimeperch": {
    primary: "UptimePerch",
    secondary:
      "website monitoring project; incident visibility; release visibility",
    intent: "Branded concept information and operations-workflow exploration",
    issue:
      "Metadata should describe monitoring rather than only status. Keep availability checking separate from an uptime guarantee and use CreativeWork instead of purchasable SoftwareApplication markup.",
    examples: `${cloud} (operational scope comparator)`,
    answer:
      "What would checks observe, how could incidents and recoveries be visible, and what does monitoring not guarantee?",
    priority: "P1",
  },
  "/privacy": {
    primary: "SanoraWorks privacy policy",
    secondary:
      "SanoraWorks enquiry data; email delivery; technical request information",
    intent: "Navigational policy and data-handling information",
    issue:
      "Existing policy is readable and describes enquiry delivery. New public APIs and MCP require a factual description of public content access and separate IP rate limiting. No invented retention period or legal certification.",
    examples:
      "No direct competitor benchmark: accuracy against the implemented enquiry and public-interface data flow takes priority over copying another company’s policy.",
    answer:
      "Which enquiry details are collected, where are they delivered, what technical information is processed, and how can a person ask about deletion?",
    priority: "P1",
  },
  "/terms": {
    primary: "SanoraWorks website terms",
    secondary:
      "project agreements; illustrative project previews; website content terms",
    intent: "Navigational website and project-information terms",
    issue:
      "Existing terms correctly distinguish enquiries, agreements, and concepts. Keep the content readable, use branded metadata, and share policy copy with public machine representations.",
    examples:
      "No direct competitor benchmark: preserve the existing factual boundaries and separate project agreement rather than importing another business’s terms.",
    answer:
      "Does an enquiry create an agreement? Are the projects available? Where are ownership, pricing, schedule, and support defined?",
    priority: "P2",
  },
};
let text = `# SanoraWorks search, answer, and discovery research\n\nReviewed: 17 November 2026. Audience: businesses and startups searching in international English. Primary brand: SanoraWorks; monitor Sanora separately because it may include unrelated intent. This is qualitative page and search-intent research, not measured keyword demand, difficulty, ranking position, or a promise of indexing, rankings, leads, or AI citations.\n\n## Evidence and limitations\n\nThe source baseline is main commit 7c9f4a6: eleven existing public pages, server-rendered copy, canonical metadata, robots.txt, and sitemap. Four commercial service intents previously lived at one URL. Existing artwork and development notices are retained. The release adds four dedicated service URLs for fifteen public marketing/legal pages.\n\nSearches reviewed on 17 November 2026: “web development agency business websites customer portals services”; “product engineering services MVP development startups”; “AI workflow automation services enquiry documents”; “cloud deployment DevOps services startups monitoring”. Results and the linked primary business pages support separating these buying intents; they do not establish volume or difficulty. GR8R Studio presents product engineering as a distinct offer; Artificial Workflow describes repeatable work and review paths; Startwyse gives cloud operations its own service page. These observations inform topic separation only; their claims, delivery times, clients, prices, and results are not adopted.\n\nRanking, search volume, keyword difficulty, backlinks, indexed-page counts, Core Web Vitals field data, organic clicks, impressions, CTR, and average position: **unavailable**, not zero. Search Console and Bing Webmaster access are not connected in this session. No visitor analytics scripts are added.\n\n[Google AI search guidance](https://developers.google.com/search/docs/appearance/ai-features) says ordinary SEO practices apply, with no special AI files or schema required. [Google’s updates](https://developers.google.com/search/updates) record that FAQ rich results stopped appearing on 7 May 2026. Buyer questions remain useful content; there is no FAQ-snippet promise.\n\n## Priorities\n\nP0: shared public content, dedicated services, canonical/404 safety, read-only public interfaces, negotiation, and access boundaries. P1: home, services navigation, project and company context, metadata, breadcrumbs, policies reflecting the new public interfaces, mobile and accessibility review. P2: routine terms presentation and measurement follow-up. DNSSEC/DS and webmaster account work depend on suitable access and must not be marked passed without live evidence.\n\n## Page-by-page plan and implemented copy\n\n`;
for (const page of publicPages) {
  const n = notes[page.path];
  text += `### ${page.path}\n\n- Current issue/gap: ${n.issue}\n- Primary queries: ${n.primary}.\n- Secondary queries: ${n.secondary}.\n- Search intent: ${n.intent}.\n- Competitor/format examples: ${n.examples}.\n- Proposed browser title: **${page.title}**\n- Proposed description: ${page.description}\n- H1: ${page.h1}\n- Supporting headings: ${page.sections.map((s) => s.heading).join("; ")}.\n- Answer opportunity: ${n.answer}\n- Buyer questions: ${page.questions?.map((q) => q.question).join("; ") || "Use the direct explanatory sections above; do not add repetitive FAQ blocks merely for schema."}\n- Internal links: ${page.links.map((l) => `[${l.label}](${l.href})`).join(", ")}. Existing /services section anchors and /contact?service= selections remain valid.\n- Implementation priority: ${n.priority}.\n- Ranking / volume / difficulty: unavailable; connect Search Console for measured query and landing-page data.\n- Content revision: ${page.revised}, explicitly recorded in the shared page model. All fifteen entries were substantively reviewed or changed in this release; dates are not generated from build/deployment time.\n\n`;
}
text += `## Representation and structured-data policy\n\nThe shared model in src/data/public-content.ts composes the existing service/project/site data. Page copy, absolute browser titles, descriptions, H1s, page JSON-LD, REST, MCP and negotiated Markdown use it. Reusable service/project/process sections retain the underlying data sources. Organization and WebSite have stable apex @ids, Sanora is an alternate brand name, and pages reference those identities. Services use Service; unfinished projects use CreativeWork with In development status. BreadcrumbList describes the visible hierarchy. No reviews, clients, locations, prices, or launch promises are invented.\n\nThe sitemap includes exactly fifteen marketing/legal pages. Utility documentation, catalog, REST, Markdown index, MCP and registry are excluded and carry noindex response headers. Known-page lookup is an allowlist; it does not read filesystem paths or fetch arbitrary URLs. Existing private PDFs remain untracked and are not copied into public assets, links, APIs, resources, or the sitemap.\n\n## Discovery references and interpretation\n\n- [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288): append Link relations without replacing existing preloads.\n- [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727.txt): application/linkset+json with its registered profile, linking real endpoints and descriptions.\n- [Official MCP web-standard serving](https://ts.sdk.modelcontextprotocol.io/v2/serving/web-standard): official fetch-native handler, a fresh server per request, stateless compatibility.\n- [Cloudflare Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/): plan-specific native offering; this repository uses its own Worker wrapper and keeps the Free plan.\n- [Cloudflare robots preferences](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/): managed directives can be prepended; live robots must be inspected for contradictions. Content Signals state preferences rather than enforcing access.\n- [DNS-AID draft 00](https://datatracker.ietf.org/doc/html/draft-mozleywilliams-dawn-dnsaid-00): evolving November 2026 work in progress. Publish standard SVCB transport parameters, and put unregistered discovery parameters in TXT fallback. Only implemented MCP is advertised. The JSON organization registry uses an organization-owned format, not an invented DNS-AID standardized schema.\n\n## Measurement baseline and 30/60/90-day review\n\nBaseline status: **pending account connection**. Do not substitute synthetic traffic or guessed rankings. When connected, verify the domain property in Google Search Console and Bing Webmaster Tools using account-provided DNS/meta values; submit https://sanoraworks.com/sitemap.xml and record account-reported success. No verification tokens are fabricated.\n\nAt D0 record property, verification/submission date, measurement timezone, release SHA, date range, country/device filters, indexed and excluded URLs with reasons, canonical selection, and any indexing warnings. Export the preceding 28 days of Web search data by query and page, including impressions, clicks, CTR, and average position. Record branded SanoraWorks and secondary Sanora separately, manually checking ambiguous Sanora queries; keep all other relevant service queries as non-branded. Retain raw exports privately and document unavailable or privacy-filtered query rows. Inspect all fifteen landing pages, especially the four new services.\n\nAt 30, 60, and 90 days after the measured baseline, compare equal-length 28-day windows using the same filters and record indexing, branded/non-branded impressions, clicks, CTR, average position, and relevant landing-page performance. For new URLs, identify the first indexed date rather than treating an absent historical row as zero demand. Track observed AI citations with date, exact prompt, engine, and cited canonical URL if sampled; sampling is variable and cannot establish a complete citation count. Search Console Web data includes AI search feature traffic without a guaranteed separate AI breakdown.\n\n| Metric | D0 | 30 days | 60 days | 90 days |\n|---|---|---|---|---|\n| Verified properties / sitemap submission | Pending access | Pending | Pending | Pending |\n| Indexed / excluded pages and reasons | Unavailable | Pending | Pending | Pending |\n| SanoraWorks impressions / clicks / CTR / position | Unavailable | Pending | Pending | Pending |\n| Sanora secondary-brand queries (disambiguated) | Unavailable | Pending | Pending | Pending |\n| Relevant non-branded queries | Unavailable | Pending | Pending | Pending |\n| Four service landing pages | Unavailable | Pending | Pending | Pending |\n| Mobile field LCP / INP / CLS | Unavailable | Pending | Pending | Pending |\n\nSee seo-verification.md for actual implementation checks and unresolved account dependencies.\n`;
writeFileSync(new URL("../docs/seo-research.md", import.meta.url), text);
console.log("Wrote research for all 15 public pages.");
