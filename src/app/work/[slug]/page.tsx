import { requirePublicPage } from '@/data/public-content';
import { PageStructuredData } from '@/components/ui/PublicContent';
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { publicMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectPreview } from "@/components/ui/ProjectPreview";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FinalCTA } from "@/components/home/FinalCTA";
import styles from "@/components/ui/project-content.module.css";

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return publicMetadata(`/work/${slug}`);
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const related = projects.filter((item) => item.slug !== slug);
  const enquiryUrl = `/contact?service=${project.serviceSlug}`;
  return (
    <main id="main-content">
      <PageStructuredData path={`/work/${slug}`} />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span aria-hidden="true"> / </span>
        <Link href="/work">Project directory</Link><span aria-hidden="true"> / </span>
        <span aria-current="page">{project.name}</span>
      </nav>
      <PageHero eyebrow={`In development / ${project.category}`} title={requirePublicPage(`/work/${slug}`).h1} description={project.description} />
      <div className="container project-detail-visual">
        <Link href="/work" className="back-link"><ArrowLeft size={14} aria-hidden="true" />Back to all projects</Link>
        <ProjectPreview project={project} large />
      </div>
      <section className="section">
        <div className="container project-detail-layout">
          <div>
            <div className={styles.notice}>
              <span className={styles.status}>{project.status}</span>
              <p>We are working on {project.name}. The features below describe its planned direction, and the preview is an illustrative concept. A public product is not available yet.</p>
            </div>
            <h2>What is {project.name}?</h2>
            <p>{project.overview}</p>
            <section className={styles.section} aria-labelledby="project-problem">
              <h2 id="project-problem">The problem it is designed to help with</h2>
              <p>{project.problem}</p>
            </section>
            <section className={styles.section} aria-labelledby="project-features">
              <h2 id="project-features">What we are working towards</h2>
              {project.features.map((feature) => <article key={feature.title}><h3>{feature.title}</h3><p>{feature.description}</p></article>)}
            </section>
            <section className={styles.section} aria-labelledby="project-business-use">
              <h2 id="project-business-use">How a similar system could help your business</h2>
              {project.businessUses.map((use) => <article key={use.title}><h3>{use.title}</h3><p>{use.description}</p></article>)}
              <p>{project.businessValue}</p>
            </section>
            <section className={styles.section} aria-labelledby="project-audience">
              <h2 id="project-audience">Who it could be useful for</h2>
              <ul className={styles.audience}>{project.audience.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <div className="project-external-links">
              <Button href={enquiryUrl} variant="secondary">Discuss a similar project</Button>
            </div>
          </div>
          <dl className="project-facts">
            <div><dt>Project</dt><dd>{project.name}</dd></div>
            <div><dt>Status</dt><dd><span className={styles.status}>{project.status}</span></dd></div>
            <div><dt>Category</dt><dd>{project.category}</dd></div>
            <div><dt>Related service</dt><dd><Link href={`/services/${project.serviceSlug}`}>{project.discipline}</Link></dd></div>
            <div><dt>Development</dt><dd>Independent SanoraWorks project</dd></div>
          </dl>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-topline"><SectionHeading eyebrow="Keep exploring">More projects in development</SectionHeading><Button href="/work" variant="text">All projects</Button></div>
          <div className="selected-work-grid">{related.map((item) => <ProjectCard key={item.slug} project={item} />)}</div>
        </div>
      </section>
      <FinalCTA />
    </main>
  );
}
