"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { BANNER_DURATION, dnsSteps, orbitFrames, phaseFrames } from "@/lib/banner-motion";

export function BannerMotion({
  children,
  compact = false,
}: {
  children: ReactNode;
  compact?: boolean;
}) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const manuallyPaused = useRef(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    const logo = banner.querySelector<HTMLImageElement>(".banner-monogram img");
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let animations: Animation[] = [];

    function track(element: Element | null, frames: Keyframe[], easing = "linear") {
      if (!element) return;
      const animation = element.animate(frames.map((frame) => ({ ...frame, easing })), {
        duration: BANNER_DURATION, iterations: Infinity, easing: "linear", fill: "both",
      });
      animation.pause();
      animation.currentTime = 0;
      animations.push(animation);
    }

    function createTracks() {
      if (!banner) return;
      for (const [part, frames] of Object.entries(orbitFrames)) {
        track(banner.querySelector(`[data-orbit="${part}"]`), frames, "cubic-bezier(0.22, 1, 0.36, 1)");
      }
      dnsSteps.forEach((step, index) => {
        track(banner.querySelector(`[data-dns-caption="${index}"]`), phaseFrames(step.at, step.until));
        if (!step.route) return;
        const path = banner.querySelector<SVGPathElement>(`[data-dns-route="${step.route}"]`);
        if (!path) return;
        const length = path.getTotalLength();
        const frames = phaseFrames(step.at, step.until);
        const start = path.getPointAtLength(step.reverse ? length : 0);
        const end = path.getPointAtLength(step.reverse ? 0 : length);
        const sampleCount = 32;
        const movement: Keyframe[] = [
          { transform: `translate(${start.x}px, ${start.y}px)`, offset: 0 },
          ...Array.from({ length: sampleCount + 1 }, (_, i) => {
            const progress = i / sampleCount;
            const point = path.getPointAtLength((step.reverse ? 1 - progress : progress) * length);
            return { transform: `translate(${point.x}px, ${point.y}px)`, offset: (step.at + (step.until - step.at) * progress) / BANNER_DURATION };
          }),
          { transform: `translate(${end.x}px, ${end.y}px)`, offset: 1 },
        ];
        const packet = banner.querySelector(`[data-dns-packet="${index}"]`);
        track(packet, frames);
        track(packet, movement);
      });
      for (const name of ["resolver", "root", "tld", "authority"]) {
        const active = name === "resolver" ? [1000, 9100] : name === "root" ? [2200, 4100] : name === "tld" ? [4100, 6000] : [6000, 7900];
        track(banner.querySelector(`[data-dns-light="${name}"]`), phaseFrames(active[0], active[1]));
      }
      const answerAt = dnsSteps[dnsSteps.length - 1].at / BANNER_DURATION;
      const answerVisibleAt = answerAt + 150 / BANNER_DURATION;
      track(banner.querySelector('[data-dns-screen="pending"]'), [
        { opacity: 1, offset: 0 }, { opacity: 1, offset: answerAt },
        { opacity: 0, offset: answerVisibleAt }, { opacity: 0, offset: 0.96 }, { opacity: 1, offset: 1 },
      ]);
      track(banner.querySelector('[data-dns-screen="answer"]'), [
        { opacity: 0, offset: 0 }, { opacity: 0, offset: answerAt },
        { opacity: 1, offset: answerVisibleAt }, { opacity: 1, offset: 0.96 }, { opacity: 0, offset: 1 },
      ]);
    }

    function updatePlayback() {
      if (!banner) return;
      const canPlay = visible && !document.hidden && !motionPreference.matches;
      if (motionPreference.matches) {
        animations.forEach((animation) => animation.cancel());
        animations = [];
      } else if (!animations.length && canPlay && logo?.complete && logo.naturalWidth > 0) {
        createTracks();
      }
      const playing = canPlay && !manuallyPaused.current;
      animations.forEach((animation) => {
        if (playing && animation.playState !== "running") animation.play();
        if (!playing && animation.playState !== "paused") animation.pause();
      });
      banner.dataset.motion = String(animations.length > 0);
      banner.dataset.playing = String(animations.length > 0 && playing);
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      visible = entry.isIntersecting;
      updatePlayback();
    });
    observer.observe(banner);
    logo?.addEventListener("load", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);
    motionPreference.addEventListener("change", updatePlayback);
    banner.addEventListener("bannerpausechange", updatePlayback);

    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      logo?.removeEventListener("load", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      motionPreference.removeEventListener("change", updatePlayback);
      banner.removeEventListener("bannerpausechange", updatePlayback);
    };
  }, []);

  return (
    <div
      ref={bannerRef}
      className={`workshop-banner ${compact ? "banner-compact" : ""}`}
      data-paused={paused}
    >
      {children}
      <div className="banner-motion-controls">
        <button
          type="button"
          className="banner-motion-toggle"
          onClick={() => {
            manuallyPaused.current = !manuallyPaused.current;
            setPaused(manuallyPaused.current);
            bannerRef.current?.dispatchEvent(new Event("bannerpausechange"));
          }}
        >
          {paused ? "Resume animations" : "Pause animations"}
        </button>
      </div>
    </div>
  );
}
