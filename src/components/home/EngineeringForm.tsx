function wirePaths() {
  const paths: { d: string; depth: number }[] = [];
  const project = (x: number, y: number, z: number) => {
    const a = -.7; const b = .5; const c = -.4;
    const y1 = y * Math.cos(a) - z * Math.sin(a);
    const z1 = y * Math.sin(a) + z * Math.cos(a);
    const x2 = x * Math.cos(b) + z1 * Math.sin(b);
    const z2 = -x * Math.sin(b) + z1 * Math.cos(b);
    return [300 + x2 * Math.cos(c) - y1 * Math.sin(c), 300 + x2 * Math.sin(c) + y1 * Math.cos(c), z2];
  };
  for (let ring = 0; ring < 100; ring++) {
    const u = ring / 100 * Math.PI * 2;
    let d = "";
    let depth = 0;
    for (let point = 0; point <= 64; point++) {
      const v = point / 64 * Math.PI * 2;
      const r = 73 + 10 * Math.cos(3 * u);
      const radial = 158 + r * Math.cos(v);
      const p = project(radial * Math.cos(u), radial * Math.sin(u), r * Math.sin(v));
      depth += p[2];
      d += `${point === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)} `;
    }
    paths.push({ d: d + "Z", depth: depth / 65 });
  }
  return paths.sort((a, b) => a.depth - b.depth);
}

const paths = wirePaths();

export function EngineeringForm({ compact = false }: { compact?: boolean }) {
  return <div className={`engineering-form ${compact ? "form-compact" : ""}`}><div className="form-grid" aria-hidden="true" /><span className="form-coordinate coord-top mono" aria-hidden="true">SW—001 / CONTINUOUS EXPLORATION</span><svg className="wireform" viewBox="0 0 600 600" role="img" aria-label="An intricate silver toroidal structure, formed from one hundred precisely aligned architectural loops"><defs><linearGradient id="wire-metal" x1="10%" y1="0%" x2="85%" y2="100%"><stop offset="0%" stopColor="#505958" /><stop offset="32%" stopColor="#c4c9c5" /><stop offset="52%" stopColor="#e8eae4" /><stop offset="73%" stopColor="#787f7a" /><stop offset="100%" stopColor="#3b4540" /></linearGradient><radialGradient id="form-light"><stop offset="0%" stopColor="#b4c1ac" stopOpacity=".08" /><stop offset="100%" stopColor="#b4c1ac" stopOpacity="0" /></radialGradient></defs><circle cx="300" cy="300" r="285" fill="url(#form-light)" /><g fill="none" stroke="url(#wire-metal)" strokeWidth=".85">{paths.map((path, index) => <path key={index} d={path.d} opacity={.35 + (path.depth + 180) / 560} />)}</g></svg><div className="form-axis" aria-hidden="true"><span>Y</span><span>X</span><span>Z</span></div><div className="form-caption"><span className="form-cross" aria-hidden="true">+</span><span>Complex thinking.<br /><strong>Considered form.</strong></span><span className="mono">FIG. 01</span></div></div>;
}
