export const BANNER_DURATION = 12_000;

// An uncached lookup: the resolver follows referrals, never the browser.
export const dnsSteps = [
  { at: 0, until: 1_000, label: "01 / A name, not a number", detail: "Looking up example.com", route: null },
  { at: 1_000, until: 2_200, label: "02 / Ask the resolver", detail: "Browser → recursive resolver", route: "browser", reverse: false },
  { at: 2_200, until: 3_150, label: "03 / Find the root", detail: "Resolver → root nameserver", route: "root", reverse: false },
  { at: 3_150, until: 4_100, label: "04 / Follow the referral", detail: "Root → resolver: ask .com", route: "root", reverse: true },
  { at: 4_100, until: 5_050, label: "05 / Ask .com", detail: "Resolver → .com nameserver", route: "tld", reverse: false },
  { at: 5_050, until: 6_000, label: "06 / Find the authority", detail: ".com → resolver: nameserver", route: "tld", reverse: true },
  { at: 6_000, until: 6_950, label: "07 / Get the record", detail: "Resolver → authoritative server", route: "authority", reverse: false },
  { at: 6_950, until: 7_900, label: "08 / An address comes back", detail: "Authoritative server → resolver", route: "authority", reverse: true },
  { at: 7_900, until: 9_100, label: "09 / Back to the browser", detail: "Resolver → browser: 192.0.2.1", route: "browser", reverse: true },
  { at: 9_100, until: 12_000, label: "10 / Name resolved", detail: "example.com → 192.0.2.1", route: null },
] as const;

export function phaseFrames(from: number, until: number): Keyframe[] {
  const fade = Math.min(150, (until - from) / 4);
  return [
    { opacity: 0, offset: 0 },
    { opacity: 0, offset: from / BANNER_DURATION },
    { opacity: 1, offset: (from + fade) / BANNER_DURATION },
    { opacity: 1, offset: (until - fade) / BANNER_DURATION },
    { opacity: 0, offset: until / BANNER_DURATION },
    { opacity: 0, offset: 1 },
  ];
}

export const orbitFrames: Record<string, Keyframe[]> = {
  // The top curve moves down-left and the bottom up-right to form one orbit.
  upper: [
    { transform: "translate(-82px, 82px) rotate(-12deg)", offset: 0 },
    { transform: "translate(-82px, 82px) rotate(-12deg)", offset: 0.035 },
    { transform: "translate(4px, -3px) rotate(1deg)", offset: 0.16 },
    { transform: "translate(0px, 0px) rotate(0deg)", offset: 0.205 },
    { transform: "translate(0px, 0px) rotate(0deg)", offset: 0.855 },
    { transform: "translate(-82px, 82px) rotate(-12deg)", offset: 0.985 },
    { transform: "translate(-82px, 82px) rotate(-12deg)", offset: 1 },
  ],
  lower: [
    { transform: "translate(82px, -82px) rotate(-12deg)", offset: 0 },
    { transform: "translate(82px, -82px) rotate(-12deg)", offset: 0.035 },
    { transform: "translate(-4px, 3px) rotate(1deg)", offset: 0.16 },
    { transform: "translate(0px, 0px) rotate(0deg)", offset: 0.205 },
    { transform: "translate(0px, 0px) rotate(0deg)", offset: 0.855 },
    { transform: "translate(82px, -82px) rotate(-12deg)", offset: 0.985 },
    { transform: "translate(82px, -82px) rotate(-12deg)", offset: 1 },
  ],
  letters: [
    { opacity: 0, transform: "translateY(10px) scale(0.92)", offset: 0 },
    { opacity: 0, transform: "translateY(10px) scale(0.92)", offset: 0.075 },
    { opacity: 1, transform: "translateY(0px) scale(1)", offset: 0.205 },
    { opacity: 1, transform: "translateY(0px) scale(1)", offset: 0.855 },
    { opacity: 0, transform: "translateY(6px) scale(0.94)", offset: 0.95 },
    { opacity: 0, transform: "translateY(10px) scale(0.92)", offset: 1 },
  ],
};
