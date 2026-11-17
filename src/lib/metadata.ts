import type { Metadata } from "next";
import { site } from "@/data/site";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | SanoraWorks`,
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
      title: `${title} | SanoraWorks`,
      description,
      images: [`${site.url}/opengraph-image`],
    },
  };
}
