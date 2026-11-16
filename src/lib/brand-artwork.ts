import { brandColors as c } from "./brand-colors.ts";
import { brandLettering, brandCaptions } from "./brand-paths.ts";
import { brandSymbol } from "./brand-symbol.ts";

export type ArtworkVariant = "color" | "black" | "white";
export const letteringWidth = brandLettering.Sanora.width + brandLettering.Works.width;
export const horizontalWidth = 168 + letteringWidth;

const color = (variant: ArtworkVariant) => variant === "white" ? c.white : variant === "black" ? c.black : c.cobalt;

export function symbolPaths(variant: ArtworkVariant = "color") {
  return `<g fill="${color(variant)}"><path d="${brandSymbol.s}"/><path d="${brandSymbol.w}"/></g>`;
}

export function letteringPaths(variant: ArtworkVariant = "color") {
  return `<path fill="${variant === "color" ? c.ink : color(variant)}" d="${brandLettering.Sanora.path}"/><path fill="${color(variant)}" transform="translate(${brandLettering.Sanora.width} 0)" d="${brandLettering.Works.path}"/>`;
}

export function svgDocument(width: number, height: number, body: string, title = "SanoraWorks") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>`;
}

export function logoSvg(kind: "monogram" | "horizontal" | "stacked", variant: ArtworkVariant = "color") {
  if (kind === "monogram") return svgDocument(128, 128, `<g transform="translate(0 8)">${symbolPaths(variant)}</g>`, "SanoraWorks SW monogram");
  if (kind === "horizontal") return svgDocument(horizontalWidth, 128,
    `<g transform="translate(0 8)">${symbolPaths(variant)}</g><g transform="translate(152 34)">${letteringPaths(variant)}</g>`);
  const width = letteringWidth + 48;
  return svgDocument(width, 256, `<g transform="translate(${(width - 153.6) / 2} 8) scale(1.2)">${symbolPaths(variant)}</g><g transform="translate(24 172)">${letteringPaths(variant)}</g>`);
}

export function avatarSvg(inverse = false) {
  return svgDocument(1024, 1024, `<rect width="1024" height="1024" fill="${inverse ? c.white : c.cobalt}"/><g transform="translate(192 232) scale(5)">${symbolPaths(inverse ? "color" : "white")}</g>`, "SanoraWorks social avatar");
}

export function faviconSvg() {
  return svgDocument(32, 32, `<rect width="32" height="32" rx="5" fill="${c.cobalt}"/><g transform="translate(2 3.75) scale(.21875)">${symbolPaths("white")}</g>`, "SanoraWorks SW icon");
}

export function appleIconSvg() {
  return svgDocument(180, 180, `<rect width="180" height="180" fill="${c.cobalt}"/><g transform="translate(24 32.25) scale(1.03125)">${symbolPaths("white")}</g>`, "SanoraWorks Apple icon");
}

/** Paths only, including the separate tagline: identical in Next metadata and kit exports. */
export function socialSvg(kind: "share" | "cover") {
  if (kind === "cover") {
    return svgDocument(1500, 500, `<rect width="1500" height="500" fill="${c.ink}"/><path d="M1190 0h310v500h-480z" fill="${c.cobalt}"/><g transform="translate(286 106) scale(1.65)"><g transform="translate(0 8)">${symbolPaths("white")}</g><g transform="translate(152 34)">${letteringPaths("white")}</g></g><g fill="${c.silver}" transform="translate(546 334) scale(.43)"><path d="${brandCaptions.tagline.path}"/></g>`, "SanoraWorks social cover");
  }
  return svgDocument(1200, 630, `<rect width="1200" height="630" fill="${c.silver}"/><rect x="32" y="32" width="1136" height="566" fill="${c.white}"/><rect x="32" y="32" width="1136" height="12" fill="${c.cobalt}"/><g transform="translate(80 134) scale(1.85)"><g transform="translate(0 8)">${symbolPaths()}</g><g transform="translate(152 34)">${letteringPaths()}</g></g><g fill="${c.ink}" transform="translate(96 390) scale(.60)"><path d="${brandCaptions.tagline.path}"/></g><path d="M96 510h1008" stroke="${c.line}"/><g fill="${c.cobalt}" transform="translate(96 532) scale(.36)"><path d="${brandCaptions.domain.path}"/></g>`, "SanoraWorks website share image");
}
