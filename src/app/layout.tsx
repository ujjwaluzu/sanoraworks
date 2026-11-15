import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import localFont from "next/font/local";

const manrope = localFont({ src: "./fonts/manrope-latin.woff2", variable: "--font-manrope", display: "swap", weight: "200 800" });

export const metadata: Metadata = {
  title: "Sanora Works — Engineering the next.",
  description: "Independent technology and engineering. Digital products, intelligent systems, and scalable infrastructure.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={manrope.variable}><body id="top"><a href="#main-content" className="skip-link">Skip to content</a><Navbar />{children}<Footer /></body></html>;
}
