import { Hero } from "@/components/home/Hero";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Approach } from "@/components/home/Approach";
import { FinalCTA } from "@/components/home/FinalCTA";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/data/site";

export const metadata = {
  ...pageMetadata(
    site.tagline,
    site.description,
    "/",
  ),
  title: { absolute: `SanoraWorks: ${site.tagline}` },
};

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <ServicesOverview />
      <SelectedWork />
      <Approach />
      <FinalCTA />
    </main>
  );
}
