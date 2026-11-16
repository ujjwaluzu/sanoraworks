import Link from "next/link";
import type { Project } from "@/data/projects";
import { ProjectPreview } from "./ProjectPreview";
export function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: Project;
  index: number;
  featured?: boolean;
}) {
  return (
    <article className={`project-card ${featured ? "project-featured" : ""}`}>
      <Link
        href={`/work/${project.slug}`}
        className="project-visual-link"
        aria-label={`Explore ${project.name}`}
      >
        <ProjectPreview project={project} />
      </Link>
      <div className="project-card-info">
        <p className="project-meta mono">
          <span>
            0{index + 1} / {project.category}
          </span>
          <span>Independent project</span>
        </p>
        <h3>
          <Link href={`/work/${project.slug}`}>{project.name}</Link>
        </h3>
        <p>{project.description}</p>
        <Link className="project-details" href={`/work/${project.slug}`}>
          Project details →
        </Link>
        {project.technologies.length > 0 && (
          <ul className="tags">
            {project.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
