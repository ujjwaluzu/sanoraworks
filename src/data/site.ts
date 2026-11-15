function httpsUrl(value: string | undefined) {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === "https:" ? url.href : null; } catch { return null; }
}

const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

export const site = {
  name: "SANORA WORKS",
  url: "https://sanoraworks.com",
  tagline: "Engineering the next.",
  email: email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null,
  linkedin: httpsUrl(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  github: httpsUrl(process.env.NEXT_PUBLIC_GITHUB_URL),
  founders: [] as { name: string; role: string; bio: string }[],
};

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const philosophy = [
  { letter: "S", word: "Solutions", detail: "Start with the problem. Build what matters." },
  { letter: "A", word: "Architecture", detail: "Give every idea a considered foundation." },
  { letter: "N", word: "Networks", detail: "Connect people, products, and possibilities." },
  { letter: "O", word: "Operations", detail: "Make reliability part of the everyday." },
  { letter: "R", word: "Research", detail: "Ask better questions. Explore what comes next." },
  { letter: "A", word: "Automation", detail: "Make space for more meaningful work." },
];

export const principles = [
  { title: "Engineering-first mindset.", description: "We look beneath the interface. Sound architecture, considered trade-offs, and careful implementation shape every decision." },
  { title: "Purpose-driven solutions.", description: "Technology should solve a real problem. We connect what we build to the people who use it and the work it needs to do." },
  { title: "Scalable foundations.", description: "Build for today with a clear path forward. We favour maintainable systems that can evolve without unnecessary complexity." },
  { title: "Continuous improvement.", description: "A launch is a starting point. Feedback, observation, and iteration help a good product become a more useful one." },
];

export const approach = [
  { number: "01", name: "Discover", description: "Understand the challenge, business requirements, and opportunities.", detail: "We align on the people, constraints, and desired outcomes before deciding what to build.", output: "A clear problem statement and shared priorities" },
  { number: "02", name: "Architect", description: "Define the technical strategy, architecture, and implementation roadmap.", detail: "We map the system, explore trade-offs, and break the work into practical, reviewable milestones.", output: "A technical direction and delivery roadmap" },
  { number: "03", name: "Engineer", description: "Design, develop, test, and refine the solution.", detail: "We work in focused iterations, keeping the product accessible, maintainable, and aligned with the original purpose.", output: "A tested product, with progress you can review" },
  { number: "04", name: "Deploy & Evolve", description: "Launch, monitor, maintain, and improve the product.", detail: "We plan the handover, document key decisions, and identify what to observe and improve after launch.", output: "A considered launch and a plan for what follows" },
];
