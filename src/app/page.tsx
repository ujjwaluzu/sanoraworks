import { Hero } from "@/components/home/Hero";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Approach } from "@/components/home/Approach";
import { FinalCTA } from "@/components/home/FinalCTA";
import { publicMetadata } from "@/lib/metadata";
import { PageStructuredData } from '@/components/ui/PublicContent';

export const metadata = publicMetadata('/');

export default function Home() {
  return (
    <main id="main-content">
      <PageStructuredData path="/" />
      <Hero />
      <ServicesOverview />
      <SelectedWork />
      <Approach />
      <FinalCTA />
    </main>
  );
}
