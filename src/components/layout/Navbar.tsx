"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { navigation, site } from "@/data/site";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="masthead">
        <div>
          <Logo />
          <p className="masthead-tagline">{site.tagline}</p>
        </div>
      </div>
      <nav className="primary-nav" aria-label="Main navigation">
        {navigation.map((item, index) => {
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
              <span className="nav-index" aria-hidden="true">
                0{index + 1}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
