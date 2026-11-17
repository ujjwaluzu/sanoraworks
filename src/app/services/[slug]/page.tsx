import { notFound } from "next/navigation";
import { servicePages } from "@/data/public-content";
import { publicMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/ui/PageHero";
import {
  Breadcrumbs,
  ContentSection,
  PageLinks,
  PageStructuredData,
} from "@/components/ui/PublicContent";
import { Button } from "@/components/ui/Button";
import { ServiceExplainer } from "@/components/services/ServiceExplainer";

export const dynamicParams = false;
export function generateStaticParams() {
  return servicePages.map((p) => ({ slug: p.path.split("/").pop()! }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!servicePages.some((p) => p.path === `/services/${slug}`)) notFound();
  return publicMetadata(`/services/${slug}`);
}
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = servicePages.find((p) => p.path === `/services/${slug}`);
  if (!page) notFound();
  return (
    <main id="main-content">
      <PageStructuredData path={page.path} />
      <Breadcrumbs path={page.path} />
      <PageHero
        eyebrow="SanoraWorks services"
        title={page.h1}
        description={page.intro}
      />
      <div className="container public-service-content">
        <Button href={`/contact?service=${slug}`}>Discuss your project</Button>
        {page.sections.map((s) => (
          <ContentSection key={s.heading} section={s} />
        ))}
        <ServiceExplainer
          slug={
            slug as
              | "software-web-development"
              | "product-engineering"
              | "ai-intelligent-automation"
              | "cloud-infrastructure"
          }
        />
        <section className="public-copy-section">
          <h2>Questions about this service</h2>
          <div className="faq-list">
            {page.questions?.map((q) => (
              <details className="faq" key={q.question}>
                <summary>{q.question}</summary>
                <p>{q.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <PageLinks path={page.path} />
      </div>
    </main>
  );
}
