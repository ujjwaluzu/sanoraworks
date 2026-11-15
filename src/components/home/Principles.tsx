import { principles } from "@/data/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BrandMark } from "@/components/ui/Logo";

export function Principles() {
  return (
    <section className="section section-principles">
      <div className="container principles-layout">
        <div className="principles-intro">
          <SectionHeading
            eyebrow="The way we think"
            number="04"
            description="Good engineering is more than writing code. It’s the thinking that makes the whole system work."
          >
            Beyond development.
            <br />
            Built on engineering
            <br />
            principles.
          </SectionHeading>
          <div className="principles-signature">
            <BrandMark />
            <span>
              Independent by choice.
              <br />
              Intentional by design.
            </span>
          </div>
        </div>
        <div className="principle-list">
          {principles.map((principle, index) => (
            <article key={principle.title}>
              <span className="principle-number mono">0{index + 1}</span>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
