import { approach } from "@/data/site";
import { Panel } from "@/components/ui/Panel";
export function Approach({ detailed = false }: { detailed?: boolean }) {
  return (
    <Panel
      title="How we work"
      className="section-approach"
      id="process"
    >
      <ol
        className={`approach-directory ${detailed ? "approach-detailed" : ""}`}
      >
        {approach.map((stage) => (
          <li key={stage.number}>
            <span className="stage-number mono">{stage.number}</span>
            <div>
              <h3>{stage.name}</h3>
              <p>{stage.description}</p>
              {detailed && (
                <>
                  <p>{stage.detail}</p>
                  <p className="stage-output">
                    <strong>The outcome:</strong> {stage.output}
                  </p>
                </>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
