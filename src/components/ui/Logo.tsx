import Image from "next/image";
import Link from "next/link";

type BrandVariant = "default" | "light" | "mono";
const suffix = (variant: BrandVariant) =>
  variant === "light" ? "-white" : variant === "mono" ? "-black" : "";

/** The supplied SW/orbit bitmap, with its star removed. Props remain compatible. */
export function BrandMark({
  className = "",
  variant = "default",
  width = 80,
  height = 64,
}: {
  className?: string;
  variant?: BrandVariant;
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src={`/brand/sanoraworks-mark${suffix(variant)}.png`}
      width={width}
      height={height}
      className={className}
      alt=""
      aria-hidden="true"
      style={{ objectFit: "contain" }}
      unoptimized
    />
  );
}

export function Logo({ variant = "default" }: { variant?: BrandVariant }) {
  return (
    <Link
      href="/"
      aria-label="Sanora Works home"
      className={`brand brand-${variant}`}
    >
      <picture>
        <source
          type="image/webp"
          srcSet={`/brand/sanoraworks-logo${suffix(variant)}-340.webp 340w, /brand/sanoraworks-logo${suffix(variant)}-640.webp 640w`}
          sizes="(max-width: 400px) calc(100vw - 150px), (max-width: 900px) 260px, 300px"
        />
        <Image
          src={`/brand/sanoraworks-logo${suffix(variant)}.png`}
          className="brand-image"
          width={1671}
          height={299}
          alt="SanoraWorks: Practical technology for business"
          loading="eager"
          unoptimized
        />
      </picture>
    </Link>
  );
}
