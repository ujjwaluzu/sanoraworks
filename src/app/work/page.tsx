import { requirePublicPage } from "@/data/public-content";
import { Breadcrumbs, PageStructuredData } from "@/components/ui/PublicContent";
import { publicMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectGallery } from "@/components/work/ProjectGallery";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata = publicMetadata("/work");

export default function WorkPage() {
  return (
    <main id="main-content">
      <PageStructuredData path="/work" />
      <Breadcrumbs path="/work" />
      <PageHero
        eyebrow="Independent projects / In development"
        title={requirePublicPage("/work").h1}
        description={requirePublicPage("/work").intro}
      />
      <section className="section work-listing">
        <div className="container">
          <ProjectGallery />
          <p className="work-note">
            All four projects are in development. Features describe the planned
            direction. Previews are illustrative interface concepts; public
            products are not available yet.
          </p>
        </div>
      </section>
      <FinalCTA />
    </main>
  );
}
