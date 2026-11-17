import { LOOP_DURATION, type ServiceSlug } from "./service-explainer.ts";

export interface MotionTrack { part: string; frames: Keyframe[] }
// Milliseconds are the source of truth. Responses start at the arrival beat.
export const beats = {
  software: { code: 0, send: 3000, arrive: 4100, resolved: 6000, approach: 6000, anticipate: 7350, press: 7700, release: 8000, update: 8400, result: 9000, hold: 10000, reset: 13000, end: LOOP_DURATION },
  product: { nav: 0, content: 1200, feature: 2500, assembled: 4000, inspected: 7000, release: 7000, replace: 8150, hold: 10000, reset: 13000, end: LOOP_DURATION },
  ai: { intake: 0, scan: 3000, extract: 6000, validate: 9000, hold: 11000, reset: 13000, end: LOOP_DURATION },
  cloud: { release: 0, activate: 3000, health: 6000, route: 8000, hold: 11000, reset: 13000, end: LOOP_DURATION },
} as const;
export const settledFrame: Record<ServiceSlug, number> = {
  "software-web-development": 11200,
  "product-engineering": 11500,
  "ai-intelligent-automation": 12000,
  "cloud-infrastructure": 11800,
};
const smooth = "cubic-bezier(.45,0,.2,1)";
const move = (x = 0, y = 0) => `translate(${x}px, ${y}px)`;
type BeatFrame = [number, Keyframe];
function track(part: string, frames: BeatFrame[], easing = "linear"): MotionTrack {
  return { part, frames: frames.map(([time, frame]) => ({ easing, ...frame, offset: time / LOOP_DURATION })) };
}
function reveal(part: string, start: number, end: number, reset = 13000, gone = 14300) {
  return track(part, [[0, { opacity: 0 }], [start, { opacity: 0 }], [end, { opacity: 1 }], [reset, { opacity: 1 }], [gone, { opacity: 0 }], [LOOP_DURATION, { opacity: 0 }]]);
}
function signal(part: string, start: number, end: number) {
  return track(part, [
    [0, { opacity: 0, strokeDashoffset: 7 }], [start, { opacity: 0, strokeDashoffset: 7 }],
    [start + 80, { opacity: 1, strokeDashoffset: 0 }], [end - 80, { opacity: 1, strokeDashoffset: -93 }],
    [end, { opacity: 0, strokeDashoffset: -100 }], [LOOP_DURATION, { opacity: 0, strokeDashoffset: 7 }],
  ]);
}
function draw(part: string, start: number, end: number, reset = 13000) {
  return track(part, [[0, { strokeDashoffset: 1 }], [start, { strokeDashoffset: 1 }], [end, { strokeDashoffset: 0 }], [reset, { strokeDashoffset: 0 }], [14500, { strokeDashoffset: 1 }], [LOOP_DURATION, { strokeDashoffset: 1 }]]);
}
function dock(part: string, start: number, end: number, x: number, y: number, reset: number) {
  return track(part, [[0, { transform: move(x, y) }], [start, { transform: move(x, y) }], [end - 140, { transform: move(-.7, .5) }], [end, { transform: move() }], [reset, { transform: move() }], [LOOP_DURATION, { transform: move(x, y) }]], smooth);
}
const w = beats.software;
const p = beats.product;
const a = beats.ai;
const c = beats.cloud;

export const serviceAnimations: Record<ServiceSlug, MotionTrack[]> = {
  "software-web-development": [
    ...Array.from({ length: 7 }, (_, i) => {
      const start = w.code + Math.floor(i / 2) * 700 + i % 2 * 140;
      return track(`code-${i}`, [[0, { opacity: .15, transform: "scaleX(.05)" }], [start, { opacity: .15, transform: "scaleX(.05)" }], [start + 420, { opacity: 1, transform: "scaleX(1)" }], [w.reset + i * 90, { opacity: 1, transform: "scaleX(1)" }], [w.end, { opacity: .15, transform: "scaleX(.05)" }]], smooth);
    }),
    signal("web-signal", w.send, w.arrive),
    reveal("web-content", w.arrive, w.arrive + 450),
    draw("web-chart", w.arrive + 450, w.resolved),
    ...Array.from({ length: 3 }, (_, i) => reveal(`web-card-${i}`, w.arrive + 300 + i * 350, w.arrive + 800 + i * 350)),
    track("cursor", [
      [0, { opacity: 0, transform: move(425, 270) }], [w.approach, { opacity: 0, transform: move(425, 270) }],
      [w.approach + 200, { opacity: 1, transform: move(416, 267) }], [w.anticipate, { opacity: 1, transform: move(355, 234) }],
      [w.press - 120, { opacity: 1, transform: move(355, 234) }], [w.press, { opacity: 1, transform: move(350, 230) }],
      [w.release, { opacity: 1, transform: move(350, 230) }], [w.result, { opacity: 0, transform: move(385, 256) }],
      [w.end, { opacity: 0, transform: move(425, 270) }],
    ], smooth),
    track("web-button", [[0, { transform: "scale(1)" }], [w.press - 100, { transform: "scale(1)", easing: "ease-in" }], [w.press, { transform: "scale(.94)", easing: "ease-out" }], [w.release, { transform: "scale(1)" }], [w.end, { transform: "scale(1)" }]]),
    reveal("web-updated", w.release, w.update, w.reset, w.reset + 700),
    track("web-result", [[0, { opacity: 0, transform: move(0, 14) }], [w.result, { opacity: 0, transform: move(0, 14) }], [w.hold, { opacity: 1, transform: move() }], [w.reset, { opacity: 1, transform: move() }], [w.reset + 650, { opacity: 0, transform: move(0, 14) }], [w.end, { opacity: 0, transform: move(0, 14) }]], smooth),
  ],
  "product-engineering": [
    dock("product-nav", p.nav, p.content, -72, -34, p.reset + 500),
    dock("product-content", p.content, p.feature, 0, -57, p.reset + 250),
    track("product-original", [
      [0, { opacity: 1, transform: move(92, 34) }], [p.feature, { opacity: 1, transform: move(92, 34) }],
      [p.assembled, { opacity: 1, transform: move() }], [p.release, { opacity: 1, transform: move() }],
      [p.replace - 150, { opacity: 0, transform: move(122, 34) }], [p.reset + 900, { opacity: 0, transform: move(92, 34) }],
      [p.end, { opacity: 1, transform: move(92, 34) }],
    ], smooth),
    track("product-improved", [[0, { opacity: 0, transform: move(122, 34) }], [p.replace, { opacity: 0, transform: move(122, 34) }], [p.replace + 200, { opacity: 1, transform: move(110, 30) }], [p.hold - 150, { opacity: 1, transform: move(-.7, .5) }], [p.hold, { opacity: 1, transform: move() }], [p.reset, { opacity: 1, transform: move() }], [p.reset + 850, { opacity: 0, transform: move(122, 34) }], [p.end, { opacity: 0, transform: move(122, 34) }]], smooth),
    track("product-scan", [[0, { opacity: 0, transform: move() }], [p.assembled, { opacity: 0, transform: move() }], [p.assembled + 150, { opacity: 1, transform: move(18) }], [p.inspected - 150, { opacity: 1, transform: move(395) }], [p.inspected, { opacity: 0, transform: move(413) }], [p.end, { opacity: 0, transform: move() }]]),
    ...[4800, 5700, 6450].map((time, i) => reveal(`product-connection-${i}`, time, time + 100, time + 280, time + 520)),
  ],
  "ai-intelligent-automation": [
    track("ai-document", [[0, { opacity: 1, transform: move(-184, 22) }], [a.scan, { opacity: 1, transform: move() }], [a.reset, { opacity: 1, transform: move() }], [a.reset + 750, { opacity: 0, transform: move(0, -18) }], [a.reset + 850, { opacity: 0, transform: move(-184, 22) }], [a.end, { opacity: 1, transform: move(-184, 22) }]], smooth),
    track("ai-scan", [[0, { opacity: 0, transform: move() }], [a.scan, { opacity: 0, transform: move() }], [a.scan + 100, { opacity: 1, transform: move(0, 5) }], [a.extract - 100, { opacity: 1, transform: move(0, 150) }], [a.extract, { opacity: 0, transform: move(0, 156) }], [a.end, { opacity: 0, transform: move() }]]),
    ...Array.from({ length: 3 }, (_, i) => {
      const start = a.extract + i * 350;
      // The server-rendered layout is the final record; motion is relative to it.
      const origin = move(-254, 15 - i * 16);
      return track(`ai-field-${i}`, [[0, { opacity: 0, transform: origin }], [a.scan + 450 + i * 850, { opacity: 0, transform: origin }], [a.scan + 650 + i * 850, { opacity: 1, transform: origin }], [start, { opacity: 1, transform: origin }], [start + 750, { opacity: 1, transform: move(-98, 15 - i * 16) }], [a.validate - 700 + i * 350, { opacity: 1, transform: move() }], [a.reset + 1100, { opacity: 1, transform: move() }], [a.reset + 1200, { opacity: 0, transform: origin }], [a.end, { opacity: 0, transform: origin }]]);
    }),
    ...Array.from({ length: 3 }, (_, i) => reveal(`ai-record-${i}`, a.validate - 700 + i * 350, a.validate - 500 + i * 350, a.reset + 1100, a.reset + 1200)),
    ...Array.from({ length: 3 }, (_, i) => track(`ai-valid-${i}`, [[0, { transform: "scaleX(0)" }], [a.validate + i * 550, { transform: "scaleX(0)" }], [a.validate + 700 + i * 550, { transform: "scaleX(1)" }], [a.reset + 1100, { transform: "scaleX(1)" }], [a.reset + 1200, { transform: "scaleX(0)" }], [a.end, { transform: "scaleX(0)" }]])),
    track("ai-output", [[0, { opacity: 1, transform: move() }], [a.reset, { opacity: 1, transform: move() }], [a.reset + 1000, { opacity: 0, transform: move(110) }], [a.reset + 1250, { opacity: 0, transform: move() }], [a.end, { opacity: 1, transform: move() }]], smooth),
  ],
  "cloud-infrastructure": [
    signal("cloud-release", c.release, c.activate),
    ...Array.from({ length: 4 }, (_, i) => reveal(`server-light-${i}`, c.activate + i * 650, c.activate + 500 + i * 650, c.reset + i * 200, c.reset + 700 + i * 200)),
    signal("cloud-health", c.health, c.route),
    reveal("cloud-junction", c.route, c.route + 150, c.reset, c.reset + 350),
    ...Array.from({ length: 3 }, (_, i) => signal(`cloud-traffic-${i}`, c.route + 150 + i * 400, c.route + 1000 + i * 400)),
    draw("cloud-graph", c.route + 1000, c.hold),
  ],
};
