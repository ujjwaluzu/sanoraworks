import {
  ArrowDown,
  ArrowUpRight,
  Braces,
  Check,
  Cloud,
  Layers3,
  Plus,
  Settings2,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { ServiceExplainer } from "@/components/services/ServiceExplainer";
import { services, faqs } from "@/data/services";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/ui/PageHero";
import { Approach } from "@/components/home/Approach";
import { FinalCTA } from "@/components/home/FinalCTA";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = pageMetadata(
  "Services",
  "Software development, product engineering, AI automation, and cloud infrastructure. Technology solutions built around real-world needs by Sanora Works.",
  "/services",
);

const serviceIcons = {
  code: Braces,
  layers: Layers3,
  workflow: Workflow,
  cloud: Cloud,
};

export default function ServicesPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="The service directory"
        title="Engineering services"
        description="Connected capabilities, from the first question to the systems that keep your product moving. Built around what your business actually needs."
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
        {services.map((service) => {
          const Icon = serviceIcons[service.icon];
          return (
            <section
              className="service-detail"
              id={service.slug}
              aria-labelledby={`${service.slug}-title`}
              key={service.slug}
            >
              <div className="service-detail-title">
                <div className="service-detail-heading">
                  <span className="service-detail-icon" aria-hidden="true">
                    <Icon size={26} strokeWidth={1.6} />
                  </span>
                  <div>
                    <h2 id={`${service.slug}-title`}>{service.title}</h2>
                    <p>{service.fit}</p>
                  </div>
                </div>
                <Link
                  href={`/contact?service=${service.slug}`}
                  className="service-project-link"
                  aria-label={`Discuss your ${service.shortTitle.toLowerCase()} project`}
                >
                  Discuss your project
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
              <div className="service-detail-body">
                <p className="service-detail-lead">{service.detail}</p>
                <div className="service-detail-columns">
                  <div className="service-detail-panel">
                    <h3>What we can build</h3>
                    <ul className="capability-list">
                      {service.capabilities.map((item) => (
                        <li key={item}>
                          <Plus size={14} aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="service-detail-panel service-deliverables">
                    <h3>Typical deliverables</h3>
                    <ul className="capability-list">
                      {service.deliverables.map((item) => (
                        <li key={item}>
                          <Check size={14} aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="technology-note">
                  <Settings2 size={18} aria-hidden="true" />
                  <div>
                    <h3>A considered toolkit</h3>
                    <p>{service.tools}</p>
                  </div>
                </div>
                <ServiceExplainer slug={service.slug} />
              </div>
            </section>
          );
        })}
      </div>
      <Approach detailed />
      <section className="section">
        <div className="container faq-layout">
          <SectionHeading eyebrow="A few useful answers">
            Frequently asked questions
          </SectionHeading>
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
