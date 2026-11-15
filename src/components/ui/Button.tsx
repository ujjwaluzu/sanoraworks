import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function Button({
  href,
  children,
  variant = "primary",
  arrow = "up",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "text";
  arrow?: "up" | "right";
  className?: string;
}) {
  const Icon = arrow === "up" ? ArrowUpRight : ArrowRight;
  return (
    <Link href={href} className={`button button-${variant} ${className}`}>
      {children}
      <Icon size={17} strokeWidth={1.5} aria-hidden="true" />
    </Link>
  );
}
