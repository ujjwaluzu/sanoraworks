import { dnsSteps } from "@/lib/banner-motion";
import {
  boxCorners, corners, fitProjection, iso, pathOf, planOutline,
  sideMatrix, slabOf, type Plan, type Point3, type SolidPaths,
} from "@/lib/illustrations/iso-kit";

const base: Plan = { x: -124, y: -55, w: 278, d: 194, r: 9 };
const monitor: Plan = { x: -108, y: 8, w: 94, d: 48, r: 5 };
const projection = fitProjection([
  ...boxCorners(base, -10, 0),
  ...boxCorners(monitor, 16, 121),
  ...boxCorners({ x: 48, y: -38, w: 94, d: 50, r: 2 }, 0, 112),
], 400, 300, { pad: 14, azimuth: 62, elevation: 24 });
const at = (point: Point3) => iso(point, projection);
const solid = (plan: Plan, z: number, height: number) => slabOf(plan, z, height, projection, 4, 0.7);
const front = (x: number, y: number) => sideMatrix([x, y], 0, projection, "left");
const route = (points: Point3[]) => pathOf(points.map(at));
const routes = {
  browser: route([[-29, 48, 3], [-21, 48, 1], [5, 48, 1], [5, 13, 1], [54, 13, 1], [64.5, 8, 14]]),
  root: route([[110, 8, 14], [124, 8, 14], [124, 8, 39], [110, 8, 39]]),
  tld: route([[110, 8, 14], [131, 8, 14], [131, 8, 64], [110, 8, 64]]),
  authority: route([[110, 8, 14], [138, 8, 14], [138, 8, 89], [110, 8, 89]]),
};

function Solid({ paths, tone = "case" }: { paths: SolidPaths; tone?: string }) {
  return (
    <g className={`dns-solid dns-${tone}`}>
      <path className="dns-fill" d={paths.fill} />
      {paths.shades.map((d, shade) => d ? <path key={shade} className={`dns-shade-${shade}`} d={d} /> : null)}
      <path className="dns-top" d={paths.top} />
      <path className="dns-edge" d={paths.outline} />
      <path className="dns-bevel" d={paths.bevel} />
    </g>
  );
}

const feet = corners(base, 15).map(([x, y]) => solid({ x: x - 4, y: y - 4, w: 8, d: 8, r: 1.5 }, -9, 5));
const keys = Array.from({ length: 24 }, (_, i) => solid({
  x: -107 + (i % 8) * 10.2, y: 86 + Math.floor(i / 8) * 9.2,
  w: 8.2, d: 7.2, r: 1.1,
}, 5, 3));

export function DnsComputer() {
  return (
    <figure className="dns-computer">
      <svg className="dns-machine" viewBox="0 0 400 300" role="img" aria-label="A miniature computer and DNS server rack. An uncached lookup travels from the browser to a recursive resolver, which queries root, .com, and authoritative nameservers before returning an example IP address." focusable="false">
        <ellipse cx="207" cy="249" rx="158" ry="27" className="dns-ground-shadow" />
        {feet.map((paths, i) => <Solid key={i} paths={paths} tone="foot" />)}
        <Solid paths={solid(base, -4, 4)} tone="base" />
        <path className="dns-groove" d={planOutline({ ...base, x: base.x + 6, y: base.y + 6, w: base.w - 12, d: base.d - 12, r: 5 }, 0.1, projection)} />
        {corners(base, 11).map(([x, y], i) => <Solid key={i} paths={solid({ x, y, w: 2.4, d: 2.4, r: 0.5 }, 0, 0.8)} tone="foot" />)}

        <Solid paths={solid({ x: 46, y: -41, w: 100, d: 57, r: 3 }, 0, 4)} tone="base" />
        <Solid paths={solid({ x: 119, y: -37, w: 25, d: 45, r: 2 }, 4, 104)} tone="backplane" />
        <Solid paths={solid({ x: 48, y: -38, w: 5, d: 50, r: 1 }, 4, 107)} />
        <Solid paths={solid({ x: 114, y: -38, w: 5, d: 50, r: 1 }, 4, 107)} />
        <Solid paths={solid({ x: 48, y: -38, w: 71, d: 50, r: 2 }, 108, 4)} />
        {["resolver", "root", "tld", "authority"].map((name, i) => (
          <g key={name} data-dns-server={name}>
            <Solid paths={solid({ x: 53, y: -36, w: 61, d: 44, r: 2 }, 5 + i * 25, 18)} />
            <g transform={front(53, 8.2)}>
              <rect x="3" y={-20 - i * 25} width="55" height="12" rx="1" className="dns-server-face" />
              {[0, 1, 2].map((vent) => <rect key={vent} x={(i === 0 ? 23 : 9) + vent * 5} y={-17 - i * 25} width="2" height="6" rx="0.7" className="dns-vent" />)}
              <rect x={i === 0 ? 7 : 40} y={-17 - i * 25} width="9" height="6" rx="0.8" className="dns-port" />
              <rect x="54" y={-15 - i * 25} width="2" height="2" rx="0.6" className="dns-server-light" data-dns-light={name} />
              <rect x="0" y={-18 - i * 25} width="2" height="6" rx="0.5" className="dns-mount" />
              <rect x="59" y={-18 - i * 25} width="2" height="6" rx="0.5" className="dns-mount" />
            </g>
          </g>
        ))}
        {Object.entries(routes).map(([name, d]) => (
          <g key={name}>
            <path d={d} className="dns-signal-trace iso-line" data-dns-route={name} />
            <path d={d} className="dns-signal-core" />
          </g>
        ))}
        {dnsSteps.map((step, i) => step.route ? (
          <circle key={i} cx="0" cy="0" r="2.5" className="dns-packet" data-dns-packet={i} />
        ) : null)}

        <Solid paths={solid({ x: -91, y: 18, w: 62, d: 44, r: 4 }, 0, 4)} tone="base" />
        <Solid paths={solid({ x: -70, y: 26, w: 19, d: 20, r: 2 }, 4, 15)} />
        <Solid paths={solid(monitor, 19, 102)} />
        <g transform={front(-108, 56.2)}>
          <rect x="7" y="-114" width="80" height="70" rx="5" className="dns-bezel" />
          <rect x="11" y="-110" width="72" height="62" rx="4" className="dns-glass" />
          <svg x="13" y="-107" width="68" height="56" viewBox="0 0 68 56" overflow="hidden">
            <path d="M0 0H68V56H0Z" className="dns-screen-tint" />
            <path d="M2 3H66V14H2Z" className="dns-browser-bar" />
            <circle cx="6" cy="8.5" r="1.2" fill="var(--cobalt-line)" />
            <text x="11" y="10" className="dns-screen-domain">example.com</text>
            <g className="dns-screen-pending" data-dns-screen="pending">
              <path d="M8 24H50M8 31H39M8 38H45" className="dns-screen-line" />
              <rect x="8" y="44" width="4" height="2" className="dns-screen-cursor" />
            </g>
            <g className="dns-screen-answer" data-dns-screen="answer">
              <path d="m8 27 4 4 8-9" className="dns-screen-check" />
              <text x="8" y="42" className="dns-screen-ip">192.0.2.1</text>
            </g>
            <path d="M0 0H68L0 32Z" className="dns-glass-reflection" />
          </svg>
          <rect x="57" y="-34" width="24" height="3" rx="0.8" className="dns-disk-slot" />
          <rect x="12" y="-34" width="4" height="3" rx="0.8" className="dns-computer-light" />
          <rect x="76" y="-27" width="5" height="2" rx="0.5" className="dns-power-switch" />
        </g>
        {[0, 1, 2, 3].map((i) => <path key={i} className="dns-vent" d={pathOf([
          at([-14, 16 + i * 6, 88]), at([-14, 18 + i * 6, 88]),
          at([-14, 18 + i * 6, 111]), at([-14, 16 + i * 6, 111]),
        ], true)} />)}
        <Solid paths={solid({ x: -115, y: 78, w: 101, d: 49, r: 4 }, 0, 5)} />
        <path className="dns-keyboard-well" d={planOutline({ x: -110, y: 82, w: 89, d: 40, r: 2 }, 5.1, projection)} />
        {keys.map((paths, i) => <Solid key={i} paths={paths} tone="key" />)}
        <Solid paths={solid({ x: -88, y: 114, w: 43, d: 5, r: 1 }, 5, 2.5)} tone="key" />
      </svg>
    </figure>
  );
}
