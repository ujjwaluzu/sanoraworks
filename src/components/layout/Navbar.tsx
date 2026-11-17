"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { navigation } from "@/data/site";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);

  function closeMenu() {
    if (menu.current) menu.current.open = false;
  }

  useEffect(() => {
    const disclosure = menu.current;
    const desktop = window.matchMedia("(width > 900px)");
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !disclosure?.contains(event.target)) closeMenu();
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && disclosure?.open) {
        closeMenu();
        disclosure.querySelector("summary")?.focus();
      }
    }
    function resize() {
      if (desktop.matches) closeMenu();
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    desktop.addEventListener("change", resize);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
      desktop.removeEventListener("change", resize);
    };
  }, [pathname]);

  const links = navigation.map((item) => {
    const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
    return (
      <Link key={item.href} href={item.href} onNavigate={closeMenu}
        className={item.href === "/contact" ? "nav-contact" : undefined}
        aria-current={active ? "page" : undefined}>
        {item.label}
        {item.href === "/contact" && <ArrowUpRight size={16} aria-hidden="true" />}
      </Link>
    );
  });

  return (
    <header className="site-header">
      <div className="masthead">
        <Logo />
      </div>
      <nav className="primary-nav" aria-label="Main navigation">
        {links}
      </nav>
      <details key={pathname} ref={menu} className="mobile-navigation">
        <summary>
          <span>Menu</span>
          <Menu className="menu-open-icon" size={18} aria-hidden="true" />
          <X className="menu-close-icon" size={18} aria-hidden="true" />
        </summary>
        <nav className="mobile-nav-links" aria-label="Main navigation">{links}</nav>
      </details>
    </header>
  );
}
