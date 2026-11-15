import { approach } from "@/data/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Approach({ detailed = false }: { detailed?: boolean }) {
  return (
    <section className="section section-approach">
      <div className="container">
        <div className="section-topline">
          <SectionHeading eyebrow="How we work" number="03">
            From concept
            <br />
            to execution.
          </SectionHeading>
          <p className="approach-intro">
            A considered process.
            <br />
            Clear direction at every step.
          </p>
        </div>
        <ol className="approach-timeline">
          {approach.map((stage) => (
            <li key={stage.number}>
              <div className="timeline-marker">
                <span className="mono">{stage.number}</span>
                <span className="timeline-dot" />
              </div>
              <h3>{stage.name}</h3>
              <p>{stage.description}</p>
              {detailed && (
                <>
                  <p className="stage-detail">{stage.detail}</p>
                  <div className="stage-output">
                    <span className="eyebrow">The outcome</span>
                    {stage.output}
                  </div>
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
