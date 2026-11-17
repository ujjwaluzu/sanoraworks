import type { ReactNode } from "react";

export function Eyebrow({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p className="eyebrow">
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  children,
  description,
}: {
  eyebrow?: string;
  children: ReactNode;
  description?: string;
}) {
  return (
    <div className="section-heading">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2>{children}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
