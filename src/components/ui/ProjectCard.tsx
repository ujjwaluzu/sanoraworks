import Link from "next/link";
import type { Project } from "@/data/projects";
import { ProjectPreview } from "./ProjectPreview";
import styles from "./project-content.module.css";
export function ProjectCard({
  project,
}: {
  project: Project;
}) {
  return (
    <article className={`project-card ${styles.card}`}>
      <Link
        href={`/work/${project.slug}`}
        className={`project-card-link ${styles.cardLink}`}
        aria-labelledby={`project-title-${project.slug}`}
        aria-describedby={`project-summary-${project.slug}`}
      >
        <div className={`project-visual-link ${styles.visual}`}>
          <ProjectPreview project={project} />
        </div>
        <div className="project-card-info">
          <p className="project-meta mono">
            <span>{project.category}</span>
            <span className={styles.status}>{project.status}</span>
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
