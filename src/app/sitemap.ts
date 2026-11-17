import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { publicPages } from "@/data/public-content";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages.map(({path, revised}) => ({
    url: `${site.url}${path}`,
    lastModified: revised,
    changeFrequency: "monthly",
    priority:
      path === "/" ? 1 : ["/privacy", "/terms"].includes(path) ? 0.3 : 0.7,
  }));
}
