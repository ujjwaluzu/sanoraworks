"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation } from "@/data/site";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    if (!open) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLAnchorElement>("a")?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === "Tab") {
        const items = [
          toggleRef.current,
          ...Array.from(panel?.querySelectorAll<HTMLAnchorElement>("a") ?? []),
        ].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }
    const media = window.matchMedia("(min-width: 960px)");
    const closeOnDesktop = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", keydown);
      media.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="container nav-bar">
        <div onClick={() => setOpen(false)}>
          <Logo />
        </div>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="nav-cta">
          Start a project
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
        <button
          ref={toggleRef}
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
      <div
        id="mobile-navigation"
        ref={panelRef}
        className="mobile-menu"
        hidden={!open}
      >
        <nav aria-label="Mobile navigation">
          {navigation.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active(item.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              <span className="mono">0{index + 1}</span>
              {item.label}
              <ArrowUpRight size={22} />
            </Link>
          ))}
          <Link
            className="mobile-project"
            href="/contact"
            onClick={() => setOpen(false)}
          >
            Start a project
            <ArrowUpRight size={22} />
          </Link>
        </nav>
        <p className="eyebrow">Engineering the next.</p>
      </div>
    </header>
  );
}
