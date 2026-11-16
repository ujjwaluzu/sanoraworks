"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { navigation } from "@/data/site";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="masthead">
        <div>
          <Logo />
        </div>
      </div>
      <nav className="primary-nav" aria-label="Main navigation">
        {navigation.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
