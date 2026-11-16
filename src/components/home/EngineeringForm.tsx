import { BannerMotion } from "@/components/home/BannerMotion";
import { DnsComputer } from "@/components/home/DnsComputer";
import { OrbitLogo } from "@/components/home/OrbitLogo";

export function EngineeringForm({ compact = false }: { compact?: boolean }) {
  return (
    <BannerMotion compact={compact}>
      <DnsComputer />
      <div className="workshop-banner-copy">
        <h2>Websites, business tools, and automation.</h2>
        <p>
          Reach customers online, organise day-to-day operations, and spend less
          time on repetitive tasks with software built around your business.
        </p>
      </div>
      <OrbitLogo />
    </BannerMotion>
  );
}
