import Link from "next/link";
import { projects } from "@/data/projects";
import { Panel } from "@/components/ui/Panel";
import { ProjectCard } from "@/components/ui/ProjectCard";
export function SelectedWork() {
  return (
    <Panel
      title="From the project directory"
      label="03 INDEPENDENT PROJECTS"
      className="section-work"
      id="projects"
    >
      <p className="panel-intro">
        Ideas we’re exploring, and the products taking shape.
      </p>
      <div className="selected-work-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
      <p className="directory-bottom">
        <Link href="/work">Open the complete project directory →</Link>
      </p>
    </Panel>
  );
}
