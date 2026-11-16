import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata(
    site.tagline,
    "Sanora Works is an independent technology and engineering company building digital products, software solutions, intelligent systems, and scalable infrastructure.",
    "/",
  ),
  metadataBase: new URL(site.url),
  title: {
    default: `Sanora Works — ${site.tagline}`,
    template: "%s | Sanora Works",
  },
  applicationName: "Sanora Works",
  robots: { index: true, follow: true },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#006666",
  colorScheme: "light",
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: "Sanora Works",
  url: site.url,
  logo: `${site.url}/icon.svg`,
  slogan: site.tagline,
  description:
    "An independent technology and engineering company building digital products, software solutions, intelligent systems, and scalable infrastructure.",
  ...(site.email ? { email: site.email } : {}),
  ...([site.linkedin, site.github].some(Boolean)
    ? { sameAs: [site.linkedin, site.github].filter(Boolean) }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body id="top">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
          }}
        />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="site-frame">
          <Navbar />
          <div className="site-columns">
            <div className="site-content">{children}</div>
            <Sidebar />
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
