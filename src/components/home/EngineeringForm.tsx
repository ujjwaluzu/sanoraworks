import { BannerMotion } from "@/components/home/BannerMotion";
import { DnsComputer } from "@/components/home/DnsComputer";
import { OrbitLogo } from "@/components/home/OrbitLogo";

export function EngineeringForm({ compact = false }: { compact?: boolean }) {
  return (
    <BannerMotion compact={compact}>
      <DnsComputer />
      <div className="workshop-banner-copy">
        <h2>A website, a team tool, or a first release.</h2>
        <p>
          A service website, an order dashboard, or a product prototype: the
          starting point depends on what you need people to do.
        </p>
      </div>
      <OrbitLogo />
    </BannerMotion>
  );
}
