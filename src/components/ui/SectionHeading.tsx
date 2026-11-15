import type { ReactNode } from "react";

export function Eyebrow({ children, number }: { children: ReactNode; number?: string }) {
  return <p className="eyebrow">{number && <span className="section-number">{number} /</span>}{children}</p>;
}

export function SectionHeading({ eyebrow, number, children, description }: { eyebrow: string; number?: string; children: ReactNode; description?: string }) {
  return <div className="section-heading"><Eyebrow number={number}>{eyebrow}</Eyebrow><h2>{children}</h2>{description && <p className="section-description">{description}</p>}</div>;
}
