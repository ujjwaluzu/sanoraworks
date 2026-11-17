import { requirePublicPage } from "@/data/public-content";
import { Breadcrumbs, PageStructuredData } from "@/components/ui/PublicContent";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import { ServiceExplainer } from "@/components/services/ServiceExplainer";
import { services, faqs } from "@/data/services";
import { publicMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/ui/PageHero";
import { Approach } from "@/components/home/Approach";
import { FinalCTA } from "@/components/home/FinalCTA";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = publicMetadata("/services");

export default function ServicesPage() {
  return (
    <main id="main-content">
      <PageStructuredData path="/services" />
      <Breadcrumbs path="/services" />
      <PageHero
        title={requirePublicPage("/services").h1}
        description={requirePublicPage("/services").intro}
      />
      <nav
        className="container service-jump-links"
        aria-label="Explore service categories"
      >
        {services.map((service) => (
          <a key={service.slug} href={`#${service.slug}`}>
            {service.shortTitle}
            <ArrowDown size={13} aria-hidden="true" />
          </a>
        ))}
      </nav>
      <div className="container service-details">
        {services.map((service) => (
          <section
            className="service-detail"
            id={service.slug}
            aria-labelledby={`${service.slug}-title`}
            key={service.slug}
          >
            <div className="service-detail-title">
              <div className="service-detail-heading">
                <div>
                  <h2 id={`${service.slug}-title`}>
                    <Link href={`/services/${service.slug}`}>
                      {service.title}
                    </Link>
                  </h2>
                  <p>{service.fit}</p>
                </div>
              </div>
              <Link
                href={`/contact?service=${service.slug}`}
                className="service-project-link"
                aria-label={`Tell us what you need for ${service.shortTitle.toLowerCase()}`}
              >
                Tell us what you need
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
            <div className="service-detail-body">
              <p className="service-detail-lead">{service.detail}</p>
              <p>
                <Link href={`/services/${service.slug}`}>
                  Explore {service.shortTitle.toLowerCase()} projects, scope,
                  and questions →
                </Link>
              </p>
              <div className="service-detail-columns">
                <div className="service-detail-panel">
                  <h3>Examples we can build</h3>
                  <ul className="capability-list">
                    {service.capabilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="service-detail-panel service-deliverables">
                  <h3>Typical deliverables</h3>
                  <ul className="capability-list">
                    {service.deliverables.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <ServiceExplainer slug={service.slug} />
              <div className="technology-note">
                <div>
                  <h3>Technology choices</h3>
                  <p>{service.tools}</p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
      <Approach detailed />
      <section className="section">
        <div className="container faq-layout">
          <SectionHeading>Frequently asked questions</SectionHeading>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details className="faq" key={faq.question}>
                <summary>
                  {faq.question}
                  <Plus size={16} aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <FinalCTA />
    </main>
  );
}
