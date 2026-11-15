import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import localFont from "next/font/local";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/metadata";

const manrope = localFont({
  src: "./fonts/manrope-latin.woff2",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
});

export const metadata: Metadata = {
  ...pageMetadata(
    "Engineering the next.",
    "Sanora Works is an independent technology and engineering company building digital products, software solutions, intelligent systems, and scalable infrastructure.",
    "/",
  ),
  metadataBase: new URL(site.url),
  title: {
    default: "Sanora Works — Engineering the next.",
    template: "%s | Sanora Works",
  },
  applicationName: "Sanora Works",
  robots: { index: true, follow: true },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#101112",
  colorScheme: "dark",
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
    <html lang="en" className={manrope.variable}>
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
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
