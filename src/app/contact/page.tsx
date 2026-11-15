import { ArrowUpRight, MessageSquare, MoveRight } from "lucide-react";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { pageMetadata } from "@/lib/metadata";
import { getContactEndpoint } from "@/lib/contact-server";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";

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
      <PageHero
        eyebrow="Let’s start a conversation"
        index="04"
        title={
          <>
            Every good build
            <br />
            <span>starts with an idea.</span>
          </>
        }
        description="A new product, a complex challenge, or a possibility you’d like to explore. Tell us what you’re thinking, and let’s find a useful way forward."
      />
      <section className="section contact-section">
        <div className="container contact-layout">
          <aside className="contact-aside">
            <MessageSquare size={27} strokeWidth={1} aria-hidden="true" />
            <h2>
              What’s next
              <br />
              starts here.
            </h2>
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
                    In the meantime, prepare a brief using the form.
                  </span>
                </>
              )}
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
          <ContactForm
            deliveryEnabled={Boolean(getContactEndpoint())}
            initialProjectType={selected}
          />
        </div>
      </section>
    </main>
  );
}
