import type { Metadata } from "next";
import { site } from "@/data/site";
import { requirePublicPage } from "@/data/public-content";

export function publicMetadata(path: string): Metadata {
  const page = requirePublicPage(path);
  return pageMetadata(page.title, page.description, path);
}

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "SanoraWorks",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `SanoraWorks: ${site.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${site.url}/opengraph-image`],
    },
  };
}
