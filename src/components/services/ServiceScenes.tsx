import { useId } from "react";
import type { ServiceSlug } from "@/lib/service-explainer";

// All artwork is server-rendered. Animation targets are plain SVG groups.
function Panel({ x, y, w, h, id, children }: { x: number; y: number; w: number; h: number; id: string; children?: React.ReactNode }) {
  const clip = `${id}-panel-${useId().replaceAll(":", "")}`;
  return <g><defs><clipPath id={clip}><rect x={x} y={y} width={w} height={h} rx="12" /></clipPath></defs><rect x={x} y={y + 5} width={w} height={h} rx="12" fill="var(--line-strong)" opacity=".13" /><rect x={x} y={y} width={w} height={h} rx="12" fill={`url(#${id}-glass)`} stroke={`url(#${id}-edge)`} strokeWidth="1.2" /><g clipPath={`url(#${clip})`}>{children}</g></g>;
}
function Lines({ x, y, widths }: { x: number; y: number; widths: number[] }) {
  return <g>{widths.map((width, i) => <rect key={i} x={x} y={y + i * 10} width={width} height="3" rx="1.5" fill={i === 0 ? "#7a8da8" : "var(--line)"} />)}</g>;
}
function Label({ x, y, children, size = 18, light = false }: { x: number; y: number; children: React.ReactNode; size?: number; light?: boolean }) {
  return <text x={x} y={y} fill={light ? "#ffffff" : "var(--ink)"} fontFamily="Arial, Helvetica, sans-serif" fontSize={size} fontWeight="600">{children}</text>;
}
function LightPath({ d, motion, id }: { d: string; motion: string; id: string }) {
  return <g><path d={d} fill="none" stroke="#cad4e1" strokeWidth="1" /><path d={d} fill="none" stroke="var(--cobalt)" strokeWidth="2" strokeLinecap="round" pathLength="100" strokeDasharray="7 193" opacity="0" data-motion={motion} filter={`url(#${id}-glow)`} /></g>;
}

function Software({ id }: { id: string }) {
  return <>
    <g transform="translate(85 113) rotate(-5 100 92)">
      <Panel x={0} y={0} w={202} h={188} id={id}>
        <path d="M0 30h202" stroke="#cad4e1" />
        {[0, 1, 2].map((i) => <circle key={i} cx={16 + i * 10} cy="15" r="2.4" fill="#7a8da8" />)}
        <Label x={65} y={21} size={15}>app.tsx</Label>
        {[67, 112, 89, 124, 73, 104, 82].map((w, i) => <g key={i} data-motion={`code-${i}`} style={{ transformOrigin: `20px ${51 + i * 17}px` }}>
          <rect x={20 + i % 3 * 7} y={51 + i * 17} width={w} height="3" rx="1.5" fill={i % 2 ? "#7a8da8" : "var(--cobalt)"} />
          <rect x={27 + i % 3 * 7 + w} y={51 + i * 17} width="17" height="3" rx="1.5" fill="var(--line)" />
        </g>)}
      </Panel>
    </g>
    <LightPath d="M169 306v26q0 16 16 16h108q16 0 16-16v-20" id={id} motion="web-signal" />
    <g transform="translate(250 75) rotate(3 210 128)">
      <Panel x={0} y={0} w={410} h={265} id={id}>
        <path d="M0 32h410" stroke="#cad4e1" /><Label x={155} y={23} size={18}>Dashboard</Label>
        {[0, 1, 2].map((i) => <circle key={i} cx={17 + i * 10} cy="16" r="2.5" fill={i ? "#7a8da8" : "#7a8da8"} />)}
        <rect x="16" y="48" width="44" height="200" rx="7" fill="var(--silver)" />
        {[65, 103, 141, 179, 217].map((y, i) => <rect key={y} x="30" y={y} width="16" height="16" rx="4" fill={i === 0 ? "var(--cobalt)" : "#cbd5e3"} />)}
        <g data-motion="web-content"><rect x="77" y="48" width="316" height="69" rx="8" fill="var(--surface)" /><path d="M94 98 128 78 155 89 182 65 211 76 249 60 283 72 318 57 375 69" fill="none" stroke="var(--cobalt)" strokeWidth="2" data-motion="web-chart" pathLength="1" strokeDasharray="1" /><path d="M94 106h281" stroke="#cad4e1" /></g>
        {[0, 1, 2].map((i) => <g key={i} data-motion={`web-card-${i}`}><rect x={77 + i * 109} y="131" width="98" height="73" rx="8" fill="var(--surface)" stroke="#cad4e1" /><rect x={91 + i * 109} y="145" width="20" height="20" rx="6" fill={i === 1 ? "var(--cobalt)" : "#cbd5e3"} /><Label x={91 + i * 109} y={190}>{["Pages", "Traffic", "Forms"][i]}</Label></g>)}
        <g data-motion="web-updated"><rect x="186" y="131" width="98" height="73" rx="8" fill="var(--cobalt-soft)" stroke="var(--cobalt-line)" /><path d="M202 170v-11m13 11v-19m13 19v-25" stroke="var(--cobalt)" strokeWidth="5" strokeLinecap="round" /><Label x={200} y={190}>Updated</Label></g>
        <rect x="77" y="220" width="174" height="4" rx="2" fill="var(--line)" /><rect x="77" y="232" width="124" height="3" rx="1.5" fill="var(--line)" />
        <g data-motion="web-button" style={{ transformOrigin: "350px 231px" }}><rect x="306" y="215" width="87" height="29" rx="7" fill={`url(#${id}-electric)`} /><Label x={323} y={235} light>Deploy</Label></g>
      </Panel>
      <g data-motion="cursor" opacity="0"><path d="M0 0v23l7-6 5 12 5-2-5-11 9-1Z" fill="#fff" stroke="var(--ink)" strokeWidth="1.5" /></g>
    </g>
    <g data-motion="web-result"><g transform="translate(555 300) rotate(-5)"><Panel x={0} y={0} w={147} h={52} id={id}><rect x="12" y="12" width="28" height="28" rx="8" fill="var(--cobalt)" /><path d="M19 31v-6m6 6V21m6 10V17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" /><Label x={50} y={32}>Published</Label></Panel></g></g>
  </>;
}

function Product({ id }: { id: string }) {
  // Layout perspective belongs to the parent; module motion stays in local coordinates.
  return <g transform="matrix(1 .16 -.25 .88 221 72)">
    <Panel x={0} y={0} w={430} h={278} id={id}>
      <path d="M0 31h430" stroke="#cad4e1" />
      {[17, 27, 37].map((x) => <circle key={x} cx={x} cy="16" r="2" fill="#7a8da8" />)}
      <Label x={126} y={22} size={18}>Product workspace</Label>
      {[[18, 49, 70, 204], [104, 49, 306, 102], [104, 168, 306, 85]].map(([x, y, width, height]) => <g key={x + y}><rect x={x} y={y} width={width} height={height} rx="10" fill="var(--silver)" stroke="#cad4e1" /><path d={`M${x + 10} ${y + 9}h12m-6-6v12M${x + width - 16} ${y + height - 9}h6`} stroke="var(--line)" /></g>)}
    </Panel>
    <g data-motion="product-nav"><Panel x={18} y={49} w={70} h={204} id={id}>
      <rect x="32" y="65" width="41" height="25" rx="6" fill="#cbd5e3" />
      <Label x={33} y={83} size={15}>Menu</Label>
      {[110, 146, 182, 218].map((y) => <g key={y}><rect x="32" y={y} width="10" height="10" rx="3" fill="#7a8da8" /><path d={`M50 ${y + 5}h22`} stroke="#7a8da8" strokeWidth="3" strokeLinecap="round" /></g>)}
    </Panel></g>
    <g data-motion="product-content"><Panel x={104} y={49} w={306} h={102} id={id}>
      <Label x={121} y={76} size={18}>Overview</Label>
      {[0, 1, 2].map((i) => <g key={i}><rect x={121 + i * 94} y="91" width="79" height="44" rx="6" fill="var(--surface)" stroke="#cad4e1" /><path d={`M${133 + i * 94} 123l12-10 10 4 16-14 16 6`} fill="none" stroke="#7a8da8" strokeWidth="2" /></g>)}
    </Panel></g>
    <g data-motion="product-original" opacity="0"><FeatureModule id={id} improved={false} /></g>
    <g data-motion="product-improved"><FeatureModule id={id} improved /></g>
    <defs><clipPath id={`${id}-product-inspection`}><rect x="17" y="48" width="394" height="206" rx="10" /></clipPath></defs>
    <g clipPath={`url(#${id}-product-inspection)`}><g data-motion="product-scan" opacity="0"><rect x="-15" y="49" width="16" height="204" fill={`url(#${id}-scan)`} /><path d="M1 49v204" stroke="var(--cobalt)" strokeWidth="1.5" filter={`url(#${id}-glow)`} /></g></g>
    {[[87, 123], [228, 151], [335, 253]].map(([x, y], i) => <path key={i} data-motion={`product-connection-${i}`} opacity="0" d={`M${x - 5} ${y}h10`} stroke="var(--cobalt)" strokeWidth="3" strokeLinecap="round" filter={`url(#${id}-glow)`} />)}
  </g>;
}
function FeatureModule({ id, improved }: { id: string; improved: boolean }) {
  return <Panel x={104} y={168} w={306} h={85} id={id}>
    <rect x="120" y="184" width="42" height="52" rx="7" fill={improved ? "var(--cobalt-soft)" : "var(--silver)"} />
    <path d="M131 197h20m-20 9h14m-14 9h20m-20 9h10" stroke="#607794" strokeWidth="2" strokeLinecap="round" />
    <Label x={178} y={202} size={18}>{improved ? "Insights v2" : "Insights"}</Label>
    {(improved ? [34, 59, 80] : [24, 36, 48]).map((width, i) => <rect key={i} x={178 + i * 72} y="216" width={Math.min(width, 60)} height="13" rx="4" fill={improved ? "var(--cobalt)" : "var(--cobalt)"} />)}
    <path d="M121 244h272" stroke={improved ? "var(--cobalt-line)" : "#cad4e1"} />
  </Panel>;
}

function Ai({ id }: { id: string }) {
  return <>
    <path d="M95 350h128l44-87M463 171h40l37-15m-77 63h77m-77 48h40l37 15" fill="none" stroke="#cad4e1" strokeWidth="1" />
    <Panel x={85} y={136} w={164} h={205} id={id}><path d="M99 329h136" stroke="var(--line)" /><Label x={101} y={162} size={18}>Inbox</Label><Lines x={101} y={181} widths={[56, 36]} /></Panel>
    <Panel x={253} y={96} w={215} h={242} id={id}>
      <path d="M253 118h215M253 316h215" stroke="#cad4e1" />
      <Label x={307} y={112}>Extract fields</Label>
      <path d="M266 142v-13h13m163 0h13v13m0 150v13h-13m-163 0h-13v-13" fill="none" stroke="var(--line)" />
    </Panel>
    <g data-motion="ai-document"><Panel x={280} y={128} w={152} h={176} id={id}>
      <Label x={298} y={152} size={18}>Invoice</Label>
      {[0, 1, 2].map((i) => <g key={i}><rect x="296" y={168 + i * 48} width="119" height="28" rx="5" fill="var(--surface)" stroke="#cad4e1" /><rect x="303" y={175 + i * 48} width="12" height="12" rx="3" fill="#7a8da8" /><Lines x={326} y={176 + i * 48} widths={[72 - i * 13, 40]} /></g>)}
    </Panel></g>
    <defs><clipPath id={`${id}-document-scan`}><rect x="280" y="128" width="152" height="176" rx="12" /></clipPath><clipPath id={`${id}-output-clip`}><rect x="280" y="120" width="456" height="220" rx="12" /></clipPath></defs>
    <g clipPath={`url(#${id}-document-scan)`}><g data-motion="ai-scan" opacity="0"><rect x="282" y="133" width="148" height="17" fill={`url(#${id}-scan)`} /><path d="M282 150h148" stroke="var(--cobalt)" strokeWidth="1.5" filter={`url(#${id}-glow)`} /></g></g>
    <g clipPath={`url(#${id}-output-clip)`}><g data-motion="ai-output">
      {[0, 1, 2].map((i) => <g key={i} data-motion={`ai-record-${i}`}><Panel x={538} y={143 + i * 64} w={164} h={51} id={id}>
        <rect x="550" y={183 + i * 64} width="137" height="2" rx="1" fill="#cad4e1" />
        <rect data-motion={`ai-valid-${i}`} style={{ transformOrigin: `550px ${183 + i * 64}px` }} x="550" y={183 + i * 64} width="137" height="2" rx="1" fill="var(--cobalt)" />
      </Panel></g>)}
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(254 ${-15 + i * 16})`}><g data-motion={`ai-field-${i}`}>
        <rect x="296" y={168 + i * 48} width="119" height="28" rx="5" fill="var(--cobalt-soft)" stroke="var(--cobalt-line)" />
        <rect x="303" y={175 + i * 48} width="12" height="12" rx={i === 0 ? 6 : 3} fill="var(--cobalt)" />
        <Label x={325} y={188 + i * 48}>{["Client", "Total", "Date"][i]}</Label>
      </g></g>)}
    </g></g>
  </>;
}
function Tower({ x, y, id, index }: { x: number; y: number; id: string; index: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M0 137 48 160 105 133v5l-57 27L0 142Z" fill="var(--line-strong)" />
    <path d="M0 0 57-26 105-4 48 23Z" fill="var(--surface)" stroke="var(--line)" /><path d="M48 23 105-4v137l-57 27Z" fill="#cbd5e3" stroke="#cad4e1" /><path d="M0 0 48 23v137L0 137Z" fill={`url(#${id}-glass)`} stroke="var(--line)" />
    {[0, 1, 2, 3].map((n) => <g key={n}>
      <path d={`M7 ${16 + n * 29}l34 16v19L7 ${35 + n * 29}Z`} fill="var(--surface)" stroke="#cad4e1" />
      <path d={`M14 ${25 + n * 29}l6 3`} stroke={index === 2 ? "var(--line)" : "#7a8da8"} strokeWidth="2" strokeLinecap="round" />
      {index === 2 && <path d={`M14 ${25 + n * 29}l6 3`} stroke="var(--cobalt)" strokeWidth="2" strokeLinecap="round" data-motion={`server-light-${n}`} filter={`url(#${id}-glow)`} />}
      <path d={`M29 ${33 + n * 29}l6 3`} stroke="#7a8da8" strokeWidth="2" strokeLinecap="round" />
    </g>)}
    <path d="M48 23v137" stroke="var(--line)" /><path d="m17 0 39-18 32 15-39 18Z" fill="var(--silver)" stroke="var(--line)" />
  </g>;
}
function Cloud({ id }: { id: string }) {
  return <>
    <path d="m139 281 260-119 266 121-261 118Z" fill={`url(#${id}-floor)`} stroke="#cad4e1" />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${180 + i * 42} ${262 - i * 19}l260 119M${180 + i * 42} ${300 + i * 18}l260-119`} stroke="#cad4e1" strokeWidth=".7" />)}
    <Tower x={347} y={125} id={id} index={1} /><Tower x={215} y={169} id={id} index={0} /><Tower x={480} y={182} id={id} index={2} />
    <g transform="translate(312 67)"><path d="M-48 24a22 22 0 0 1-2-44 39 39 0 0 1 73-7 25 25 0 0 1 0 51Z" fill={`url(#${id}-glass)`} stroke="var(--line)" strokeWidth="1.2" /><Label x={-35} y={10}>Release</Label></g>
    <LightPath d="M340 84h66q16 0 16 16v14" id={id} motion="cloud-release" />
    <LightPath d="M533 162v-31q0-17-17-17h-94" id={id} motion="cloud-health" />
    <LightPath d="M422 114h-137q-16 0-16 16v15" id={id} motion="cloud-traffic-0" />
    <LightPath d="M422 114h-18v-7" id={id} motion="cloud-traffic-1" />
    <LightPath d="M422 114h94q17 0 17 17v31" id={id} motion="cloud-traffic-2" />
    <rect x="414" y="106" width="16" height="16" rx="4" fill="var(--silver)" stroke="var(--line)" />
    <rect data-motion="cloud-junction" x="418" y="110" width="8" height="8" rx="2" fill="var(--cobalt)" filter={`url(#${id}-glow)`} />
    <path d="M542 114h23" stroke="#cad4e1" />
    <g transform="translate(565 60)"><Panel x={0} y={0} w={139} h={83} id={id}><Label x={14} y={24}>Health</Label><path d="M14 62h110m-110-17h110" stroke="#cad4e1" /><path d="M14 62 30 49 45 55 62 34 78 43 100 29 124 35" fill="none" stroke="var(--cobalt)" strokeWidth="2" pathLength="1" strokeDasharray="1" data-motion="cloud-graph" /></Panel></g>
  </>;
}
export function ServiceScene({ slug, id }: { slug: ServiceSlug; id: string }) {
  const scenes = {
    "software-web-development": <Software id={id} />,
    "product-engineering": <Product id={id} />,
    "ai-intelligent-automation": <Ai id={id} />,
    "cloud-infrastructure": <Cloud id={id} />,
  };
  return <>
    <defs>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffffff" /><stop offset=".45" stopColor="var(--surface)" /><stop offset="1" stopColor="var(--silver)" /></linearGradient>
      <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--line)" stopOpacity=".8" /><stop offset=".5" stopColor="var(--line)" stopOpacity=".5" /><stop offset="1" stopColor="var(--line)" stopOpacity=".8" /></linearGradient>
      <linearGradient id={`${id}-electric`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--cobalt)" /><stop offset=".45" stopColor="var(--cobalt)" /><stop offset="1" stopColor="var(--cobalt-hover)" /></linearGradient>
      <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="var(--surface)" /><stop offset="1" stopColor="var(--silver)" /></linearGradient>
      <linearGradient id={`${id}-scan`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="var(--cobalt)" stopOpacity=".25" /><stop offset="1" stopColor="var(--cobalt)" stopOpacity="0" /></linearGradient>
      <filter id={`${id}-glow`} x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="1.3" /><feComposite in="SourceGraphic" operator="over" /></filter>
    </defs>
    {scenes[slug]}
  </>;
}
