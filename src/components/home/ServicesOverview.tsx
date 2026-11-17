import Link from "next/link";
import { services } from "@/data/services";
import { Panel } from "@/components/ui/Panel";
import { ServiceCard } from "@/components/ui/ServiceCard";
export function ServicesOverview() {
  return (
    <Panel
      title="Services"
      id="capabilities"
      className="section-services"
    >
      <p className="panel-intro">
        Build a website, develop a product, automate a workflow, or deploy an
        application to the cloud.
      </p>
      <div className="service-directory">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
      <p className="directory-bottom">
        <Link href="/services">
          Service details and frequently asked questions →
        </Link>
      </p>
    </Panel>
  );
}
