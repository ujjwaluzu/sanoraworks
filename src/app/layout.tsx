import { brandColors } from "@/lib/brand-colors";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { Sidebar } from "@/components/layout/Sidebar";
import { site, socialProfiles } from "@/data/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata(site.tagline, site.description, "/"),
  metadataBase: new URL(site.url),
  title: {
    default: `SanoraWorks: ${site.tagline}`,
    template: "%s | SanoraWorks",
  },
  applicationName: "SanoraWorks",
  robots: { index: true, follow: true },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: brandColors.cobalt,
  colorScheme: "light",
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: "SanoraWorks",
  alternateName: "Sanora",
  url: site.url,
  logo: `${site.url}/icon.svg`,
  slogan: site.tagline,
  description: site.description,
  ...(site.email ? { email: site.email } : {}),
  sameAs: socialProfiles.map((profile) => profile.url),
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${site.url}/#website`,
              name: site.name,
              alternateName: "Sanora",
              url: site.url,
              publisher: { "@id": `${site.url}/#organization` },
              inLanguage: "en",
            }).replace(/</g, "\\u003c"),
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
        <BackToTop />
      </body>
    </html>
  );
}
