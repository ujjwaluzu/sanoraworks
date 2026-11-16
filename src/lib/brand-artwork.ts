import { brandColors as c } from "./brand-colors.ts";

export type ArtworkVariant = "color" | "black" | "white";
export type BrandSources = Record<string, string>;
export const horizontalWidth = 565;

function bitmap(kind: string, variant: ArtworkVariant, width: number, height: number, sources: BrandSources) {
  const src = sources[`${kind}-${variant}`] || `/brand/sanoraworks-${kind}${variant === "color" ? "" : `-${variant}`}.png`;
  return `<image href="${src}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"/>`;
}

export function svgDocument(width: number, height: number, body: string, title = "SanoraWorks") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>`;
}

// Compatibility names used by the preview builder. These embed supplied pixels.
export function symbolPaths(variant: ArtworkVariant = "color", sources: BrandSources = {}) {
  return bitmap("mark", variant, 128, 112, sources);
}
export function letteringPaths(variant: ArtworkVariant = "color", sources: BrandSources = {}) {
  return bitmap("lettering", variant, 397, 74, sources);
}

export function logoSvg(kind: "monogram" | "horizontal" | "stacked", variant: ArtworkVariant = "color", sources: BrandSources = {}) {
  if (kind === "monogram") return svgDocument(128, 128, `<g transform="translate(8 8)">${bitmap("mark", variant, 112, 112, sources)}</g>`, "SanoraWorks SW orbit monogram");
  if (kind === "horizontal") return svgDocument(horizontalWidth, 128, bitmap("logo", variant, horizontalWidth, 128, sources));
  return svgDocument(445, 256, `<g transform="translate(150 4)">${bitmap("mark", variant, 145, 142, sources)}</g><g transform="translate(24 162)">${letteringPaths(variant, sources)}</g>`);
}

export function avatarSvg(inverse = false, sources: BrandSources = {}) {
  return svgDocument(1024, 1024, `<rect width="1024" height="1024" fill="${inverse ? c.white : c.cobalt}"/><g transform="translate(212 212)">${bitmap("mark", inverse ? "color" : "white", 600, 600, sources)}</g>`, "SanoraWorks social avatar");
}
export function faviconSvg(sources: BrandSources = {}) {
  return svgDocument(32, 32, `<rect width="32" height="32" rx="5" fill="${c.cobalt}"/><g transform="translate(2 2)">${bitmap("mark", "white", 28, 28, sources)}</g>`, "SanoraWorks SW icon");
}
export function appleIconSvg(sources: BrandSources = {}) {
  return svgDocument(180, 180, `<rect width="180" height="180" fill="${c.cobalt}"/><g transform="translate(20 20)">${bitmap("mark", "white", 140, 140, sources)}</g>`, "SanoraWorks Apple icon");
}
export function socialSvg(kind: "share" | "cover", sources: BrandSources = {}) {
  if (kind === "cover") return svgDocument(1500, 500, `<rect width="1500" height="500" fill="${c.ink}"/><path d="M1310 0h190v500h-350z" fill="${c.cobalt}"/><g transform="translate(200 100)">${bitmap("logo", "white", 1100, 300, sources)}</g>`, "SanoraWorks social cover");
  return svgDocument(1200, 630, `<rect width="1200" height="630" fill="${c.silver}"/><rect x="32" y="32" width="1136" height="566" fill="${c.white}"/><rect x="32" y="32" width="1136" height="12" fill="${c.cobalt}"/><g transform="translate(80 150)">${bitmap("logo", "color", 1040, 300, sources)}</g><path d="M96 510h1008" stroke="${c.line}"/>`, "SanoraWorks website share image");
}
