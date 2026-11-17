import type { ReactNode } from "react";
import { Eyebrow } from "./SectionHeading";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: ReactNode;
  description: string;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        {eyebrow && (
          <div className="page-hero-top">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
        )}
        <h1>{title}</h1>
        <p className="page-hero-description">{description}</p>
      </div>
    </section>
  );
}
