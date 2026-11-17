export const REVEAL_DURATION = 12_000;
export const REVEAL_STILL = 7_000;
const ease = "cubic-bezier(.22,.8,.22,1)";
const move = (x = 0, y = 0, rotation = 0) => `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
type Frame = [number, Keyframe];
const frames = (values: Frame[]): Keyframe[] => values.map(([time, frame]) => ({ easing: ease, ...frame, offset: time / REVEAL_DURATION }));

export const logoRevealTracks = [
  ...Array.from({ length: 9 }, (_, i) => {
    const side = i % 2 ? 1 : -1;
    const from = move(side * (145 + i * 9), (i - 4) * 13, side * 8);
    const start = 500 + i * 180;
    return { part: `slice-${i}`, frames: frames([
      [0, { opacity: 0, transform: from }], [start, { opacity: 0, transform: from }],
      [start + 200, { opacity: 1, transform: move(side * 92, (i - 4) * 5, side * 3) }],
      [start + 1300, { opacity: 1, transform: move(-side * 1.2, 0) }],
      [start + 1530, { opacity: 1, transform: move() }],
      [10300 + i * 65, { opacity: 1, transform: move() }],
      [11400 + i * 65, { opacity: 0, transform: from }], [REVEAL_DURATION, { opacity: 0, transform: from }],
    ]) };
  }),
  { part: "complete", frames: frames([[0, { opacity: 0 }], [3400, { opacity: 0 }], [3550, { opacity: 1 }], [10250, { opacity: 1 }], [10300, { opacity: 0 }], [REVEAL_DURATION, { opacity: 0 }]]) },
  { part: "guides", frames: frames([[0, { opacity: 0, transform: "scale(.86)" }], [750, { opacity: .65, transform: "scale(1)" }], [3200, { opacity: .65, transform: "scale(1)" }], [4100, { opacity: 0, transform: "scale(1.05)" }], [REVEAL_DURATION, { opacity: 0, transform: "scale(.86)" }]]) },
  { part: "ghost", frames: frames([[0, { opacity: 0 }], [700, { opacity: .07 }], [2800, { opacity: .07 }], [3600, { opacity: 0 }], [REVEAL_DURATION, { opacity: 0 }]]) },
  { part: "echo", frames: frames([[0, { opacity: 0, transform: "scale(1)" }], [3500, { opacity: 0, transform: "scale(1)" }], [3650, { opacity: .12, transform: "scale(1.015)" }], [4600, { opacity: 0, transform: "scale(1.16)" }], [REVEAL_DURATION, { opacity: 0, transform: "scale(1)" }]]) },
  { part: "sweep", frames: frames([[0, { opacity: 0, transform: "translateX(-100px)" }], [3900, { opacity: 0, transform: "translateX(-100px)" }], [4100, { opacity: .8, transform: "translateX(0px)", easing: "linear" }], [5300, { opacity: .8, transform: "translateX(560px)" }], [5500, { opacity: 0, transform: "translateX(600px)" }], [REVEAL_DURATION, { opacity: 0, transform: "translateX(-100px)" }]]) },
  { part: "wordmark", frames: frames([[0, { opacity: 0, transform: "translateY(14px)", clipPath: "inset(0 100% 0 0)" }], [4400, { opacity: 0, transform: "translateY(14px)", clipPath: "inset(0 100% 0 0)" }], [5700, { opacity: 1, transform: "translateY(0px)", clipPath: "inset(0 0% 0 0)" }], [10200, { opacity: 1, transform: "translateY(0px)", clipPath: "inset(0 0% 0 0)" }], [10900, { opacity: 0, transform: "translateY(14px)", clipPath: "inset(0 100% 0 0)" }], [REVEAL_DURATION, { opacity: 0, transform: "translateY(14px)", clipPath: "inset(0 100% 0 0)" }]]) },
  { part: "underline", frames: frames([[0, { opacity: 0, transform: "scaleX(0)" }], [5000, { opacity: 0, transform: "scaleX(0)" }], [5900, { opacity: .5, transform: "scaleX(1)" }], [10100, { opacity: .5, transform: "scaleX(1)" }], [10800, { opacity: 0, transform: "scaleX(0)" }], [REVEAL_DURATION, { opacity: 0, transform: "scaleX(0)" }]]) },
];
