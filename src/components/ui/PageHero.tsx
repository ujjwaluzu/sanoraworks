import type { ReactNode } from "react";
import { Eyebrow } from "./SectionHeading";

export function PageHero({
  eyebrow,
  title,
  description,
  index,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  index: string;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="page-hero-top">
          <Eyebrow>{eyebrow}</Eyebrow>
          <span className="mono">SANORA WORKS / {index}</span>
        </div>
        <h1>{title}</h1>
        <p className="page-hero-description">{description}</p>
      </div>
    </section>
  );
}
