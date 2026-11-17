function httpsUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "enquiries@sanoraworks.com";

export const site = {
  name: "SanoraWorks",
  url: "https://sanoraworks.com",
  tagline: "Websites and software for businesses and startups.",
  description: "SanoraWorks builds websites, internal tools, and web applications for business owners and startup founders. Bring us a workflow to improve or a product idea to test.",
  email: email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null,
  linkedin: httpsUrl(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  github: httpsUrl(process.env.NEXT_PUBLIC_GITHUB_URL),
  x: "https://x.com/sanoraworks",
  instagram: "https://www.instagram.com/sanoraworks/",
  youtube: "https://www.youtube.com/@sanoraworks",
};

/** Shared by the page chrome, contact page, and Organization metadata. */
export const socialProfiles = [
  { label: "X", url: site.x },
  { label: "Instagram", url: site.instagram },
  { label: "YouTube", url: site.youtube },
  ...(site.github ? [{ label: "GitHub", url: site.github }] : []),
  ...(site.linkedin ? [{ label: "LinkedIn", url: site.linkedin }] : []),
];

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const approach = [
  {
    name: "Describe the job",
    description: "Show us the task, the people doing it, and what needs to change.",
    detail: "We ask about your current tools, who will use the website or application, and any constraints on time or budget.",
    output: "A written summary of the problem and priorities",
  },
  {
    name: "Agree on the scope",
    description: "Decide what to build first and how you will review it.",
    detail: "We define the screens, features, integrations, and acceptance criteria, then agree on milestones and costs before development starts.",
    output: "A scope with deliverables, assumptions, and milestones",
  },
  {
    name: "Build and review",
    description: "Review working versions, give feedback, and check the agreed requirements.",
    detail: "We develop in stages and test the main user journeys, including validation and failure cases. You can review progress at each milestone.",
    output: "Working software checked against the agreed scope",
  },
  {
    name: "Launch and hand over",
    description: "Prepare the release, documentation, and access your team needs.",
    detail: "We agree on deployment, explain how to operate the software, and document the handover. Maintenance or later changes can be scoped separately.",
    output: "The release, handover documentation, and agreed support arrangements",
  },
];
