import { requirePublicPage } from "@/data/public-content";
import {
  Breadcrumbs,
  PageStructuredData,
  PageLinks,
} from "@/components/ui/PublicContent";
import { publicMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/ui/PageHero";
import { LogoReveal } from "@/components/about/LogoReveal";
import { Approach } from "@/components/home/Approach";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata = publicMetadata("/about");

export default function AboutPage() {
  return (
    <main id="main-content">
      <PageStructuredData path="/about" />
      <Breadcrumbs path="/about" />
      <PageHero
        title={requirePublicPage("/about").h1}
        description={requirePublicPage("/about").intro}
      />
      <section className="section">
        <div className="container about-intro">
          <div>
            <h2>{requirePublicPage("/about").sections[0].heading}</h2>
            {requirePublicPage("/about").sections[0].paragraphs?.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <PageLinks path="/about" />
          </div>
          <LogoReveal />
        </div>
      </section>
      <Approach detailed />
      <FinalCTA />
    </main>
  );
}
