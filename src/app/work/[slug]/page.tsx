import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectPreview } from "@/components/ui/ProjectPreview";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FinalCTA } from "@/components/home/FinalCTA";

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return pageMetadata(project.name, project.description, `/work/${slug}`);
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const related = projects.filter((item) => item.slug !== slug);
  return (
    <main id="main-content">
      <PageHero
        eyebrow={`Independent project / ${project.category}`}
        index="WORK"
        title={
          <>
            {project.name}
            <br />
            <span>{project.discipline}.</span>
          </>
        }
        description={project.description}
      />
      <div className="container project-detail-visual">
        <Link href="/work" className="back-link">
          <ArrowLeft size={14} aria-hidden="true" />
          Back to all projects
        </Link>
        <ProjectPreview project={project} large />
      </div>
      <section className="section">
        <div className="container project-detail-layout">
          <div>
            <p className="eyebrow">An independent exploration</p>
            <h2>
              {project.name}.<br />
              Built with purpose.
            </h2>
            <p>{project.overview}</p>
            <p>
              This is a Sanora Works independent project. The visual above is an
              illustrative interface concept, shared to communicate the
              project’s direction.
            </p>
            <div className="project-external-links">
              {project.liveUrl && (
                <Button href={project.liveUrl} variant="secondary">
                  Visit the project
                </Button>
              )}
              {project.repositoryUrl && (
                <Button href={project.repositoryUrl} variant="secondary">
                  View repository
                </Button>
              )}
              <Button href="/contact" variant="text">
                Discuss a similar idea
              </Button>
            </div>
          </div>
          <dl className="project-facts">
            <div>
              <dt>Project</dt>
              <dd>{project.name}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{project.category}</dd>
            </div>
            <div>
              <dt>Development</dt>
              <dd>Independent Sanora Works project</dd>
            </div>
            <div>
              <dt>Technology stack</dt>
              <dd>
                {project.technologies.length
                  ? project.technologies.join(" / ")
                  : "Technology details forthcoming"}
              </dd>
            </div>
            <div>
              <dt>Live project</dt>
              <dd>
                {project.liveUrl
                  ? "Available via the project link"
                  : "Public URL not yet published"}
              </dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-topline">
            <SectionHeading eyebrow="Keep exploring">
              More from
              <br />
              the workshop.
            </SectionHeading>
            <Button href="/work" variant="text">
              All projects
            </Button>
          </div>
          <div className="selected-work-grid">
            {related.map((item) => (
              <ProjectCard
                key={item.slug}
                project={item}
                index={projects.indexOf(item)}
              />
            ))}
          </div>
        </div>
      </section>
      <FinalCTA />
    </main>
  );
}
