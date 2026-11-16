import { Plus } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectGallery } from "@/components/work/ProjectGallery";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata = pageMetadata(
  "Our Work",
  "Explore UzzUTV, RepoTeam, and CrewLab: independent digital products and collaboration platforms developed by Sanora Works.",
  "/work",
);

export default function WorkPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Independent projects"
        index="02"
        title="The project directory"
        description="A growing collection of independently developed products. Different challenges, connected by a belief in thoughtful engineering."
      />
      <section className="section work-listing">
        <div className="container">
          <ProjectGallery />
          <p className="work-note">
            <Plus size={13} aria-hidden="true" />
            These are our own independent projects. All interface previews are
            illustrative concepts; they are not live product screenshots.
          </p>
        </div>
      </section>
      <FinalCTA />
    </main>
  );
}
