import { services } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ui/ServiceCard";

export function ServicesOverview() {
  return <section className="section section-services" id="capabilities"><div className="container"><div className="section-topline"><SectionHeading eyebrow="Our capabilities" number="01">Technology built around<br />real-world needs.</SectionHeading><div className="section-aside"><p>From the first idea to the systems behind it.<br />The right expertise, connected by purpose.</p><Button href="/services" variant="text">Explore our services</Button></div></div><div className="services-grid">{services.map(service => <ServiceCard key={service.slug} service={service} />)}</div></div></section>;
}
