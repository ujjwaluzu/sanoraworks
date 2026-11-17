import { ArrowUpRight, MessageSquare, MoveRight } from "lucide-react";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { pageMetadata } from "@/lib/metadata";
import { ContactForm } from "@/components/contact/ContactForm";
import { SocialLinks } from "@/components/ui/SocialLinks";

export const metadata = pageMetadata(
  "Start a Project",
  "Have an idea worth engineering? Discuss your next digital product, software project, or technology challenge with Sanora Works.",
  "/contact",
);

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const selected = services.find((item) => item.slug === service)?.title ?? "";
  return (
    <main id="main-content">
      <section className="section contact-section">
        <div className="container contact-layout">
          <ContactForm
            initialProjectType={selected}
          />
          <aside className="contact-aside">
            <MessageSquare size={27} strokeWidth={1} aria-hidden="true" />
            <h2>Every good build starts with an idea.</h2>
            <p>
              You don’t need all the answers. A clear starting point, a rough
              brief, or a question is enough.
            </p>
            <div className="contact-email-block">
              <span className="eyebrow">Prefer email?</span>
              {site.email ? (
                <a href={`mailto:${site.email}`}>
                  {site.email}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              ) : (
                <>
                  <p className="contact-placeholder">
                    Contact email coming soon.
                  </p>
                  <span className="contact-small">
                    Use the form on this page to send your enquiry.
                  </span>
                </>
              )}
            </div>
            <div className="contact-email-block">
              <span className="eyebrow">Follow SanoraWorks</span>
              <SocialLinks label="Contact social media" />
            </div>
            <div className="contact-next">
              <span className="eyebrow">A considered beginning</span>
              <ol>
                <li>
                  <span className="mono">01</span>Share the idea
                  <MoveRight size={12} aria-hidden="true" />
                </li>
                <li>
                  <span className="mono">02</span>Explore the possibilities
                  <MoveRight size={12} aria-hidden="true" />
                </li>
                <li>
                  <span className="mono">03</span>Define a useful next step
                  <MoveRight size={12} aria-hidden="true" />
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
