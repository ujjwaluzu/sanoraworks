import Link from "next/link";
import { services } from "@/data/services";
export function ServiceCard({
  service,
}: {
  service: (typeof services)[number];
}) {
  return (
    <article className="service-card">
      <div>
        <h3>
          <Link href={`/services/${service.slug}`}>{service.title}</Link>
        </h3>
        <p>{service.description}</p>
        <p>{service.fit}</p>
      </div>
    </article>
  );
}
