import Link from "next/link";

type BrandVariant = "default" | "light" | "mono";

/** The static orbital emblem, shared by the masthead and metadata images. */
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
  const ink =
    variant === "light"
      ? "#ffffff"
      : variant === "mono"
        ? "currentColor"
        : "#002f49";
  const teal =
    variant === "light"
      ? "#a8e4df"
      : variant === "mono"
        ? "currentColor"
        : "#006666";
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="40" cy="32" r="25" stroke={teal} strokeWidth="2" />
      <ellipse
        cx="40"
        cy="32"
        rx="12"
        ry="25"
        stroke={teal}
        strokeWidth="1"
        opacity=".5"
      />
      <path d="M17 23h46M15 40h50" stroke={teal} strokeWidth="1" opacity=".5" />
      <path d="M51 17H34l-9 10v9h20v4H26v8h20l9-10v-9H35v-4h16z" fill={ink} />
      <ellipse
        cx="40"
        cy="33"
        rx="38"
        ry="11"
        transform="rotate(-25 40 33)"
        stroke={teal}
        strokeWidth="2.5"
      />
      <path d="m65 8 7 3-3 7-7-3z" fill={ink} />
    </svg>
  );
}

export function Logo({ variant = "default" }: { variant?: BrandVariant }) {
  return (
    <Link
      href="/"
      aria-label="Sanora Works home"
      className={`brand brand-${variant}`}
    >
      <BrandMark className="brand-mark" variant={variant} />
      <span>
        Sanora<span className="brand-light">Works</span>
      </span>
    </Link>
  );
}
