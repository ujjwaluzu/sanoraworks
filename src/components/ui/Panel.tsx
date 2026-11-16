import type { ReactNode } from "react";
export function Panel({
  title,
  children,
  className = "",
  id,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section className={`workshop-panel ${className}`} id={id}>
      <div className="panel-titlebar">
        <h2>{title}</h2>
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}
