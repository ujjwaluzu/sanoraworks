import Link from "next/link";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 5h23L16 22H4L21 5M30 35H7l17-17h12L19 35"
        fill="currentColor"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" aria-label="Sanora Works home" className="brand">
      <BrandMark className="brand-mark" />
      <span>
        SANORA<span className="brand-light">WORKS</span>
      </span>
    </Link>
  );
}
