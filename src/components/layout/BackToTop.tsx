"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 400);
    const initialFrame = window.requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("pageshow", update);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("pageshow", update);
    };
  }, []);

  if (!visible) return null;

  function goToTop() {
    // Keep keyboard focus at the destination when this button disappears.
    document.querySelector<HTMLAnchorElement>(".site-header .brand")?.focus({ preventScroll: true });
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  return (
    <button type="button" className="back-to-top" aria-label="Back to top" title="Back to top" onClick={goToTop}>
      <ArrowUp size={22} aria-hidden="true" />
    </button>
  );
}
