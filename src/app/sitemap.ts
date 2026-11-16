import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/work",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    ...projects.map((project) => `/work/${project.slug}`),
  ];
  return routes.map((path) => ({
    url: `${site.url}${path || "/"}`,
    lastModified: new Date("2026-11-16"),
    changeFrequency: "monthly",
    priority:
      path === "" ? 1 : ["/privacy", "/terms"].includes(path) ? 0.3 : 0.7,
  }));
}
