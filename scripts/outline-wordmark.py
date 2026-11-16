"""Optional source step: pip install fonttools brotli; python scripts/outline-wordmark.py.

Outlines the bundled OFL Manrope at weight 700. The site and normal asset export
use the committed paths and never load a font. Optical pair spacing is intentional.
"""
import json
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

root = Path(__file__).resolve().parent.parent
font = TTFont(root / "src/app/fonts/manrope-latin.woff2")
if "fvar" in font:
    font = instantiateVariableFont(font, {"wght": 700}, inplace=True)
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
scale = 44 / font["OS/2"].sCapHeight


def outline(text):
    cursor, paths = 0, []
    for i, char in enumerate(text):
        if i:
            cursor += {"Wo": -1.4, "ra": -0.4, "Sa": -0.5}.get(text[i - 1:i + 1], 0.15)
        name = cmap[ord(char)]
        pen = SVGPathPen(glyphs, ntos=lambda n: format(n, ".3f").rstrip("0").rstrip("."))
        glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, cursor, 51)))
        paths.append(pen.getCommands())
        cursor += font["hmtx"][name][0] * scale
    return {"path": " ".join(paths), "width": round(cursor, 3)}


lettering = {"Sanora": outline("Sanora"), "Works": outline("Works")}
captions = {
    "tagline": outline("Practical technology. Built for your business."),
    "domain": outline("sanoraworks.com"),
}
(root / "src/lib/brand-paths.ts").write_text(
    "// Outlined OFL Manrope, weight 700, with optical pair spacing.\n"
    "// Regenerate with scripts/outline-wordmark.py; see public/brand/OFL.txt.\n"
    "export const brandLettering = " + json.dumps(lettering, indent=2) + " as const;\n"
    "export const brandCaptions = " + json.dumps(captions, indent=2) + " as const;\n",
    encoding="utf-8",
)
