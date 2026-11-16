import Link from "next/link";
import { brandColors } from "@/lib/brand-colors";
import { brandSymbol } from "@/lib/brand-symbol";
import { brandLettering } from "@/lib/brand-paths";

type BrandVariant = "default" | "light" | "mono";

/** Shared original SW geometry; the existing component interface is retained. */
export function BrandMark({
  className = "", variant = "default", width = 80, height = 64,
}: {
  className?: string;
  variant?: BrandVariant;
  width?: number;
  height?: number;
}) {
  const fill = variant === "light" ? brandColors.white
    : variant === "mono" ? "currentColor" : brandColors.cobalt;
  return (
    <svg width={width} height={height} viewBox={brandSymbol.viewBox}
      fill={fill} className={className} aria-hidden="true" focusable="false">
      <path d={brandSymbol.s} />
      <path d={brandSymbol.w} />
    </svg>
  );
}

export function Logo({ variant = "default" }: { variant?: BrandVariant }) {
  const ink = variant === "light" ? brandColors.white
    : variant === "mono" ? "currentColor" : brandColors.ink;
  return (
    <Link href="/" aria-label="Sanora Works home" className={`brand brand-${variant}`}>
      <BrandMark className="brand-mark" variant={variant} />
      <svg className="brand-lettering" viewBox={`0 0 ${brandLettering.Sanora.width + brandLettering.Works.width} 60`}
        aria-hidden="true" focusable="false" fill={ink}>
        <path d={brandLettering.Sanora.path} />
        <path d={brandLettering.Works.path} transform={`translate(${brandLettering.Sanora.width} 0)`}
          fill={variant === "default" ? brandColors.cobalt : ink} />
      </svg>
    </Link>
  );
}
