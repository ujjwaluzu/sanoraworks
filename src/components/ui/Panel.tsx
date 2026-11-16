import type { ReactNode } from "react";
export function Panel({
  title,
  label,
  children,
  className = "",
  id,
}: {
  title: string;
  label?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section className={`workshop-panel ${className}`} id={id}>
      <div className="panel-titlebar">
        <h2>{title}</h2>
        {label && <span className="mono">{label}</span>}
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}
