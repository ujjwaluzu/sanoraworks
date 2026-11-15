export type Project = {
  slug: string;
  name: string;
  category: string;
  discipline: string;
  description: string;
  overview: string;
  theme: "uzzu" | "repo" | "crew";
  technologies: string[];
  liveUrl: string | null;
  repositoryUrl: string | null;
};

// Add verified technology stacks and real URLs here. Preview interfaces are illustrative.
export const projects: Project[] = [
  {
    slug: "uzzutv",
    name: "UzzUTV",
    category: "Digital entertainment",
    discipline: "Digital platform",
    description:
      "A digital home for entertainment. An independent exploration of content, discovery, and the viewing experience.",
    overview:
      "UzzUTV is an independently developed digital entertainment platform. It represents our interest in building focused digital experiences around the way people discover and engage with content.",
    theme: "uzzu",
    technologies: [],
    liveUrl: null,
    repositoryUrl: null,
  },
  {
    slug: "repoteam",
    name: "RepoTeam",
    category: "Developer tools",
    discipline: "Collaboration platform",
    description:
      "Bringing developers and their work together. A platform built around the practice of collaboration.",
    overview:
      "RepoTeam is an independently developed developer collaboration platform. It explores how a shared digital space can support people working together on software.",
    theme: "repo",
    technologies: [],
    liveUrl: null,
    repositoryUrl: null,
  },
  {
    slug: "crewlab",
    name: "CrewLab",
    category: "Collaboration",
    discipline: "Digital product",
    description:
      "A space for ideas to become something more. Connecting collaboration with the process of building.",
    overview:
      "CrewLab is an independently developed collaboration and idea-building platform. It reflects our interest in the space between an early thought and a project that people can develop together.",
    theme: "crew",
    technologies: [],
    liveUrl: null,
    repositoryUrl: null,
  },
];
