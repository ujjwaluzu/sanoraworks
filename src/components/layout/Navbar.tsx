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
        <div className="masthead-stamp" aria-hidden="true">
          <svg
            viewBox="0 0 52 40"
            width="52"
            height="40"
            shapeRendering="crispEdges"
          >
            <path
              fill="#006666"
              d="M8 0h32v4H8zM4 4h4v24H4zM40 4h4v24h-4zM8 28h32v4H8zM20 32h8v4h12v4H8v-4h12z"
            />
            <path fill="#fff" d="M8 4h32v24H8z" />
            <path
              fill="#00334d"
              d="M16 8h4v4h-4zM12 12h4v4h-4zM16 16h4v4h-4zM28 8h4v4h-4zM32 12h4v4h-4zM28 16h4v4h-4zM22 20h8v4h-8z"
            />
          </svg>
          <span>
            INDEPENDENT THINKING
            <br />
            PURPOSEFUL ENGINEERING
          </span>
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
        <span className="nav-note mono">THE ENGINEERING WORKSHOP</span>
      </nav>
    </header>
  );
}
