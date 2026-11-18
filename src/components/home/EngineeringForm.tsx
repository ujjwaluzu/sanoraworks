import { BannerMotion } from "@/components/home/BannerMotion";
import { DnsComputer } from "@/components/home/DnsComputer";
import { OrbitLogo } from "@/components/home/OrbitLogo";

export function EngineeringForm({ compact = false }: { compact?: boolean }) {
  return (
    <BannerMotion compact={compact}>
      <div className="workshop-banner-copy">
        <h2>Websites, products, automation, and the cloud.</h2>
        <p>
          From a business website or product MVP to an AI workflow or cloud
          deployment, choose the service that fits your next step.
        </p>
      </div>
      <DnsComputer />
      <OrbitLogo />
    </BannerMotion>
  );
}
