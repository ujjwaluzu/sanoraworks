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
        className="project-card-link"
        aria-labelledby={`project-title-${project.slug}`}
        aria-describedby={`project-summary-${project.slug}`}
      >
        <div className="project-visual-link">
          <ProjectPreview project={project} />
        </div>
        <div className="project-card-info">
          <p className="project-meta mono">
            <span>
              0{index + 1} / {project.category}
            </span>
            <span>Independent project</span>
          </p>
          <h3 id={`project-title-${project.slug}`}>{project.name}</h3>
          <p id={`project-summary-${project.slug}`}>{project.description}</p>
          <span className="project-details">View project →</span>
          {project.technologies.length > 0 && (
            <ul className="tags">
              {project.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </article>
  );
}
