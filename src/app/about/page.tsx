import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/ui/PageHero";
import { LogoReveal } from "@/components/about/LogoReveal";
import { Approach } from "@/components/home/Approach";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata = pageMetadata(
  "About SanoraWorks",
  "An independent software company for business owners and startup founders. Learn how SanoraWorks scopes, builds, tests, and hands over websites and applications.",
  "/about",
);

export default function AboutPage() {
  return (
    <main id="main-content">
      <PageHero
        title="About SanoraWorks"
        description="An independent company building websites and software for business owners and startup founders."
      />
      <section className="section">
        <div className="container about-intro">
          <div>
            <h2>From a business task to a working application</h2>
            <p>
              You might need a website that explains your services, an internal
              tool to replace a spreadsheet, or a first version of a product.
              We work with you to decide what it needs to do, then design, build,
              test, and prepare it for use.
            </p>
            <p>
              Before development begins, we agree on the scope, deliverables,
              and milestones. You review the work as it develops, and we plan
              the documentation, handover, and any ongoing support with you.
            </p>
            <p>
              Alongside our services, we are working on four independent
              projects: SlotBreeze for service bookings, ProofHuddle for client
              feedback and approvals, EnquiryWing for organising enquiries,
              and UptimePerch for website monitoring and cloud operations.
              All four are in development.
            </p>
          </div>
          <LogoReveal />
        </div>
      </section>
      <Approach detailed />
      <FinalCTA />
    </main>
  );
}
