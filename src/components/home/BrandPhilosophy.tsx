import { philosophy } from "@/data/site";
import { Panel } from "@/components/ui/Panel";
export function BrandPhilosophy() {
  return (
    <Panel
      title="The SANORA philosophy"
      label="SIX IDEAS. ONE DIRECTION."
      className="section-philosophy"
    >
      <dl className="philosophy-rows">
        {philosophy.map((item, index) => (
          <div key={index}>
            <dt>
              <span className="philosophy-initial" aria-hidden="true">
                {item.letter}
              </span>
              {item.word}
            </dt>
            <dd>{item.detail}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
