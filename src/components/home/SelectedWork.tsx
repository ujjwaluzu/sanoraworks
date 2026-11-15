import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function SelectedWork() {
  return <section className="section section-work"><div className="container"><div className="section-topline"><SectionHeading eyebrow="Selected work" number="02">Built with purpose.<br />Engineered to perform.</SectionHeading><div className="section-aside"><p>Independent projects. Shared ambition.<br />A look at what we’re building.</p><Button href="/work" variant="text">View all projects</Button></div></div><div className="selected-work-grid">{projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} featured={index === 0} />)}</div></div></section>;
}
