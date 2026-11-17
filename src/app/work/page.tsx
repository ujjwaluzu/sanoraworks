import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectGallery } from "@/components/work/ProjectGallery";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata = pageMetadata(
  "Projects in Development",
  "Meet SlotBreeze, ProofHuddle, EnquiryWing, and UptimePerch: four SanoraWorks projects in development for bookings, client approvals, AI enquiries, and website monitoring.",
  "/work",
);

export default function WorkPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Independent projects / In development"
        title="Useful software, taking shape"
        description="Four projects we are working on to make bookings, client reviews, incoming enquiries, and website operations easier to manage. Explore what each is designed to do and where a similar system could fit your business."
      />
      <section className="section work-listing">
        <div className="container">
          <ProjectGallery />
          <p className="work-note">All four projects are in development. Features describe the planned direction. Previews are illustrative interface concepts; public products are not available yet.</p>
        </div>
      </section>
      <FinalCTA />
    </main>
  );
}
