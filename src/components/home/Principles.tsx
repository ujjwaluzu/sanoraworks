import { principles } from "@/data/site";
import { Panel } from "@/components/ui/Panel";
export function Principles() {
  return (
    <Panel
      title="Built on engineering principles"
      label="THE WAY WE THINK"
      className="section-principles"
    >
      <div className="principle-list">
        {principles.map((principle) => (
          <article key={principle.title}>
            <h3>{principle.title}</h3>
            <p>{principle.description}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}
