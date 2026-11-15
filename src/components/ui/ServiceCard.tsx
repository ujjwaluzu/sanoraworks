import Link from "next/link";
import { ArrowUpRight, Braces, Layers3, Workflow, Cloud } from "lucide-react";
import { services } from "@/data/services";

const icons = { code: Braces, layers: Layers3, workflow: Workflow, cloud: Cloud };

export function ServiceCard({ service }: { service: typeof services[number] }) {
  const Icon = icons[service.icon];
  return <Link href={`/services#${service.slug}`} className="service-card"><div className="service-card-top"><span className="mono">{service.number}</span><Icon size={26} strokeWidth={1.2} aria-hidden="true" /></div><h3>{service.title}</h3><p>{service.description}</p><ul>{service.capabilities.slice(0, 3).map(item => <li key={item}>{item}</li>)}</ul><span className="service-card-link">Explore service<ArrowUpRight size={16} aria-hidden="true" /></span></Link>;
}
