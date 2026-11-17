import { requirePublicPage } from "@/data/public-content";
import { publicMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/ui/PageHero";
import {
  Breadcrumbs,
  ContentSection,
  PageLinks,
  PageStructuredData,
} from "@/components/ui/PublicContent";
export const metadata = publicMetadata("/privacy");
export default function PolicyPage() {
  const page = requirePublicPage("/privacy");
  return (
    <main id="main-content">
      <PageStructuredData path={page.path} />
      <Breadcrumbs path={page.path} />
      <PageHero
        eyebrow="Website information"
        title={page.h1}
        description={page.intro}
      />
      <article className="container legal">
        <p className="legal-date">Last updated: 17 November 2026</p>
        {page.sections.map((section) => (
          <ContentSection key={section.heading} section={section} />
        ))}
        <PageLinks path={page.path} />
      </article>
    </main>
  );
}
