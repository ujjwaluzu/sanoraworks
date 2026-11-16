import Link from "next/link";
import { Braces, Layers3, Workflow, Cloud } from "lucide-react";
import { services } from "@/data/services";
const icons = {
  code: Braces,
  layers: Layers3,
  workflow: Workflow,
  cloud: Cloud,
};
export function ServiceCard({
  service,
}: {
  service: (typeof services)[number];
}) {
  const Icon = icons[service.icon];
  return (
    <article className="service-card">
      <div className="service-directory-icon" aria-hidden="true">
        <Icon size={25} strokeWidth={1.7} />
      </div>
      <div>
        <h3>
          <Link href={`/services#${service.slug}`}>{service.title}</Link>
        </h3>
        <p>{service.description}</p>
      </div>
    </article>
  );
}
