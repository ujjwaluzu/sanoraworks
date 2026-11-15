import { Hero } from "@/components/home/Hero";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Approach } from "@/components/home/Approach";
import { Principles } from "@/components/home/Principles";
import { AboutPreview } from "@/components/home/AboutPreview";
import { BrandPhilosophy } from "@/components/home/BrandPhilosophy";
import { FinalCTA } from "@/components/home/FinalCTA";
import { pageMetadata } from "@/lib/metadata";

export const metadata = {
  ...pageMetadata(
    "Engineering the next.",
    "Sanora Works engineers ideas into meaningful digital solutions. Explore our software development, product engineering, AI automation, and cloud capabilities.",
    "/",
  ),
  title: { absolute: "Sanora Works — Engineering the next." },
};

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <ServicesOverview />
      <SelectedWork />
      <Approach />
      <Principles />
      <AboutPreview />
      <BrandPhilosophy />
      <FinalCTA />
    </main>
  );
}
