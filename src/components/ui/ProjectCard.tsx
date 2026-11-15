import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { ProjectPreview } from "./ProjectPreview";

export function ProjectCard({ project, index, featured = false }: { project: Project; index: number; featured?: boolean }) {
  return <article className={`project-card ${featured ? "project-featured" : ""}`}><Link href={`/work/${project.slug}`} className="project-visual-link" aria-label={`Explore ${project.name}`}><ProjectPreview project={project} /></Link><div className="project-card-info"><div><p className="project-meta"><span className="mono">0{index + 1}</span>{project.category}<span className="independent-tag">Independent project</span></p><h3><Link href={`/work/${project.slug}`}>{project.name}<ArrowUpRight size={22} strokeWidth={1.3} aria-hidden="true" /></Link></h3><p>{project.description}</p>{project.technologies.length > 0 && <ul className="tags">{project.technologies.map(technology => <li key={technology}>{technology}</li>)}</ul>}</div><Link className="project-details" href={`/work/${project.slug}`}>Project details<ArrowUpRight size={13} aria-hidden="true" /></Link></div></article>;
}
