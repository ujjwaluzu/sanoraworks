import Link from "next/link";
import { services } from "@/data/services";
import { Panel } from "@/components/ui/Panel";
import { ServiceCard } from "@/components/ui/ServiceCard";
export function ServicesOverview() {
  return (
    <Panel
      title="What we can build together"
      id="capabilities"
      className="section-services"
    >
      <p className="panel-intro">
        Practical engineering, from the first idea to the systems behind it.
      </p>
      <div className="service-directory">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
      <p className="directory-bottom">
        <Link href="/services">
          Browse capabilities & frequently asked questions →
        </Link>
      </p>
    </Panel>
  );
}
