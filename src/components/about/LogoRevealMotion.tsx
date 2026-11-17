"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { logoRevealTracks, REVEAL_DURATION, REVEAL_STILL } from "@/lib/logo-reveal";
import styles from "./logo-reveal.module.css";

export function LogoRevealMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let ready = false;
    let disposed = false;
    const animations: Animation[] = [];
    function sync() {
      const running = ready && visible && !document.hidden && !preference.matches;
      element!.dataset.playing = String(running);
      animations.forEach((animation) => running ? animation.play() : animation.pause());
    }
    function motionChanged() {
      animations.forEach((animation) => { animation.pause(); animation.currentTime = preference.matches ? REVEAL_STILL : 0; });
      sync();
    }
    // Wait for the supplied bitmap before replacing the static assembled artwork.
    Promise.all(["sanoraworks-mark.png", "sanoraworks-lettering.png"].map((file) => {
      const image = new Image();
      image.src = `/brand/${file}`;
      return image.decode();
    })).then(() => {
      if (disposed) return;
      for (const { part, frames } of logoRevealTracks) {
        const target = element.querySelector(`[data-reveal="${part}"]`);
        if (!target) continue;
        const animation = target.animate(frames, { duration: REVEAL_DURATION, iterations: Infinity, fill: "both" });
        animation.pause();
        animation.currentTime = 0;
        animations.push(animation);
      }
      ready = true;
      motionChanged();
    }).catch(() => { /* Keep the server-rendered composition if decoding fails. */ });
    const observer = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      sync();
    }, { threshold: .15 });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", motionChanged);
    return () => {
      disposed = true;
      animations.forEach((animation) => animation.cancel());
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", motionChanged);
    };
  }, []);

  return <div ref={root} className={styles.stage} data-logo-reveal>{children}</div>;
}
