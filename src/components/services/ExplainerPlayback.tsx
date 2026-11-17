"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { canPlay, LOOP_DURATION, type ServiceExplainerDefinition, type ServiceSlug } from "@/lib/service-explainer";
import { serviceAnimations, settledFrame } from "@/lib/service-animation";
import styles from "./service-explainer.module.css";

export function ExplainerPlayback({ children, definition, slug, titleId }: {
  children: ReactNode; definition: ServiceExplainerDefinition; slug: ServiceSlug; titleId: string;
}) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const figure = root.current;
    if (!figure) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = serviceAnimations[slug].flatMap(({ part, frames }) =>
      [...figure.querySelectorAll<SVGElement>(`[data-motion="${part}"]`)].map((element) => {
        const animation = element.animate(frames, { duration: LOOP_DURATION, iterations: Infinity, fill: "both", easing: "linear" });
        animation.pause();
        animation.currentTime = 0;
        return animation;
      }),
    );
    let visible = false;
    function sync() {
      const running = canPlay({ visible, hidden: document.hidden, reduced: preference.matches });
      figure!.dataset.playing = String(running);
      animations.forEach((animation) => {
        if (running && animation.playState !== "running") animation.play();
        if (!running && animation.playState !== "paused") animation.pause();
      });
    }
    function preferenceChanged() {
      // A composed final frame, with no continuous motion for this preference.
      if (preference.matches) animations.forEach((animation) => { animation.pause(); animation.currentTime = settledFrame[slug]; });
      sync();
    }
    const observer = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      sync();
    }, { threshold: .05 });
    observer.observe(figure);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", preferenceChanged);
    preferenceChanged();
    return () => {
      animations.forEach((animation) => animation.cancel());
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", preferenceChanged);
    };
  }, [slug]);

  return (
    <figure ref={root} className={styles.figure} data-service-explainer={slug} aria-labelledby={titleId}>
      {children}
      <figcaption className="sr-only">{definition.description} Simplified conceptual example.</figcaption>
    </figure>
  );
}
