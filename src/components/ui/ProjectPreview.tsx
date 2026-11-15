import {
  Braces,
  Command,
  GitBranch,
  Play,
  Plus,
  Search,
  ArrowUpRight,
  Circle,
  MessageSquare,
  LayoutGrid,
} from "lucide-react";
import type { Project } from "@/data/projects";

export function ProjectPreview({
  project,
  large = false,
}: {
  project: Project;
  large?: boolean;
}) {
  return (
    <div
      className={`project-preview preview-${project.theme} ${large ? "preview-large" : ""}`}
      role="img"
      aria-label={`Illustrative interface concept for ${project.name}; not a screenshot of the live product`}
    >
      <div className="preview-grain" />
      <span className="preview-label mono">{project.discipline}</span>
      <span className="preview-corner" aria-hidden="true">
        ↗
      </span>
      {project.theme === "uzzu" && (
        <div className="entertainment-mock" aria-hidden="true">
          <div className="mock-nav">
            <span className="uzzu-logo">
              UzzU<span>TV</span>
            </span>
            <div>
              Discover<span>Films</span>
              <span>Series</span>
            </div>
            <Search size={10} />
          </div>
          <div className="entertainment-hero">
            <div className="orbit-sun" />
            <div className="orbit-line orbit-one" />
            <div className="orbit-line orbit-two" />
            <div className="orbit-horizon" />
            <div className="entertainment-copy">
              <span className="mono">A WORLD BEYOND THE ORDINARY</span>
              <strong>
                Stories worth
                <br />
                getting lost in.
              </strong>
              <span className="mock-play">
                <Play size={8} fill="currentColor" />
                Explore the collection
              </span>
            </div>
            <span className="orbit-word mono">O R B I T</span>
          </div>
          <div className="entertainment-bottom">
            <span>Find your next story</span>
            <span>
              Made for discovery
              <ArrowUpRight size={8} />
            </span>
          </div>
        </div>
      )}
      {project.theme === "repo" && (
        <div className="repo-mock" aria-hidden="true">
          <div className="repo-sidebar">
            <span className="repo-logo">
              <Braces size={14} />
              RepoTeam
            </span>
            <span className="mock-sidebar-active">
              <LayoutGrid size={9} />
              Workspace
            </span>
            <span>
              <GitBranch size={9} />
              Repositories
            </span>
            <span>
              <MessageSquare size={9} />
              Discussions
            </span>
            <div className="repo-sidebar-bottom">
              <span className="avatar">S</span>Sanora workspace
            </div>
          </div>
          <div className="repo-body">
            <div className="repo-breadcrumb">
              Workspace <span>/</span> Overview
              <Command size={10} />
            </div>
            <div className="repo-title">
              <div>
                <span className="mono">LET’S BUILD SOMETHING</span>
                <strong>Better, together.</strong>
              </div>
              <span className="mock-add">
                <Plus size={9} />
                New project
              </span>
            </div>
            <div className="repo-stats">
              <div>
                <GitBranch size={13} />
                <span>Repositories</span>
                <i />
              </div>
              <div>
                <Circle size={13} />
                <span>In progress</span>
                <i />
              </div>
              <div>
                <MessageSquare size={13} />
                <span>Discussions</span>
                <i />
              </div>
            </div>
            <div className="repo-list-title">
              Your projects <span>View all ↗</span>
            </div>
            {["platform-core", "design-system", "api-gateway"].map(
              (name, i) => (
                <div className="repo-list" key={name}>
                  <span className={`repo-file file-${i}`}>
                    <Braces size={10} />
                  </span>
                  <span>
                    {name}
                    <small>Illustrative workspace</small>
                  </span>
                  <span className="repo-branch">
                    <GitBranch size={8} />
                    main
                  </span>
                  <span className="repo-dot" />
                </div>
              ),
            )}
          </div>
        </div>
      )}
      {project.theme === "crew" && (
        <div className="crew-mock" aria-hidden="true">
          <div className="mock-nav">
            <span className="crew-logo">
              <span>✳</span>crewlab
            </span>
            <div>
              Workspace<span>Explore</span>
            </div>
            <span className="avatar">S</span>
          </div>
          <div className="crew-title">
            <span className="mono">A LITTLE SPARK. A SHARED POSSIBILITY.</span>
            <strong>
              Good ideas grow
              <br />
              with good company.
            </strong>
          </div>
          <div className="crew-board">
            <div className="crew-note note-one">
              <span className="note-pin" />
              <span className="mono">THE FIRST SPARK</span>
              <strong>
                What if we
                <br />
                built it together?
              </strong>
              <span className="note-bottom">
                A place to begin
                <ArrowUpRight size={10} />
              </span>
            </div>
            <div className="crew-note note-two">
              <span className="mono">IN EXPLORATION</span>
              <strong>
                From a thought.
                <br />
                To a thing.
              </strong>
              <div className="crew-avatars">
                <span>A</span>
                <span>B</span>
                <span>C</span>
              </div>
            </div>
            <div className="crew-small-note">
              <Plus size={17} />
              <span>
                Room for
                <br />
                your next idea.
              </span>
            </div>
          </div>
        </div>
      )}
      <span className="preview-disclaimer">Illustrative concept preview</span>
    </div>
  );
}
