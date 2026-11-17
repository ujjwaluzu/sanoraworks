import { requirePublicPage } from "@/data/public-content";
import {
  Breadcrumbs,
  PageStructuredData,
  PageLinks,
} from "@/components/ui/PublicContent";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { publicMetadata } from "@/lib/metadata";
import { ContactForm } from "@/components/contact/ContactForm";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const metadata = publicMetadata("/contact");

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const selected = services.find((item) => item.slug === service)?.title ?? "";
  let turnstileSiteKey = process.env.TURNSTILE_SITE_KEY ?? "";
  try {
    turnstileSiteKey = (await getCloudflareContext({ async: true })).env.TURNSTILE_SITE_KEY ?? turnstileSiteKey;
  } catch { /* Next.js standalone tests use the local environment. */ }
  return (
    <main id="main-content">
      <PageStructuredData path="/contact" />
      <Breadcrumbs path="/contact" />
      <section className="section contact-section">
        <div className="container contact-layout">
          <ContactForm
            turnstileSiteKey={turnstileSiteKey}
            initialProjectType={selected}
            heading={requirePublicPage("/contact").h1}
          />
          <aside className="contact-aside">
            <h2>{requirePublicPage("/contact").sections[0].heading}</h2>
            <p>{requirePublicPage("/contact").sections[0].paragraphs?.[0]}</p>
            <h2>{requirePublicPage("/contact").sections[1].heading}</h2>
            <p>{requirePublicPage("/contact").sections[1].paragraphs?.[0]}</p>
            <PageLinks path="/contact" />
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
