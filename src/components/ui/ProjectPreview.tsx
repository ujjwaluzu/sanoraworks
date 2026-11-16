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
      <div className="concept-window" aria-hidden="true">
        <div className="concept-title">
          <span>{project.name}</span>
          <span>_ □ ×</span>
        </div>
        <div className="concept-toolbar">
          File <span>Explore</span> <span>Workspace</span>
        </div>
        {project.theme === "uzzu" && (
          <div className="concept-entertainment">
            <div className="concept-planet" />
            <span className="concept-star star-one">✦</span>
            <span className="concept-star star-two">✦</span>
            <strong>
              UzzU<span>TV</span>
            </strong>
            <span className="concept-play">▶</span>
            <div className="concept-filmstrip">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        )}
        {project.theme === "repo" && (
          <div className="concept-repo">
            <div className="concept-repo-side">
              {`{ }`}
              <i />
              <i />
              <i />
            </div>
            <div className="concept-code">
              <strong>Better, together.</strong>
              <span>
                <b>▸</b> platform-core
              </span>
              <span>
                <b>▸</b> design-system
              </span>
              <span>
                <b>▸</b> api-gateway
              </span>
              <small>⌘ SHARED WORKSPACE</small>
            </div>
          </div>
        )}
        {project.theme === "crew" && (
          <div className="concept-crew">
            <strong>A place for the next idea.</strong>
            <div className="concept-notes">
              <div>
                <span>01 / THINK</span>
                <b>What if?</b>
                <i />
              </div>
              <div>
                <span>02 / BUILD</span>
                <b>Together.</b>
                <i />
              </div>
            </div>
          </div>
        )}
      </div>
      <span className="preview-disclaimer mono">ILLUSTRATIVE CONCEPT</span>
    </div>
  );
}
