import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { pageMetadata } from "@/lib/metadata";
import { ContactForm } from "@/components/contact/ContactForm";
import { SocialLinks } from "@/components/ui/SocialLinks";

export const metadata = pageMetadata(
  "Tell Us What You Need",
  "Tell SanoraWorks about your website, internal tool, or product idea. We’ll review your message, reply with any questions, and agree on the next step.",
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
            <h2>What to include</h2>
            <p>
              Tell us who will use it, what they need to do, and how you handle
              the task today. Include any timing or budget constraints you
              already know. A rough description is enough to begin.
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
          </aside>
        </div>
      </section>
    </main>
  );
}
