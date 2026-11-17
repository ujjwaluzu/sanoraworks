import Link from "next/link";
import { projects } from "@/data/projects";
import { Panel } from "@/components/ui/Panel";
import { ProjectCard } from "@/components/ui/ProjectCard";
export function SelectedWork() {
  return (
    <Panel
      title="Projects in development"
      className="section-work"
      id="projects"
    >
      <p className="panel-intro">
        Four independent projects taking shape around everyday business tasks:
        booking appointments, reviewing client work, following up on enquiries,
        and keeping an eye on websites. Explore how a similar system could help your team.
      </p>
      <div className="selected-work-grid">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      <p className="directory-bottom">
        <Link href="/work">Open the complete project directory →</Link>
      </p>
    </Panel>
  );
}
