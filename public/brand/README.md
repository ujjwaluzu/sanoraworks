# SanoraWorks identity

Original interlocking SW monogram, with outlined Manrope lettering at weight 700 and optical spacing. The S top rail joins the descending W stem; the diagonal opening preserves separation. All logo SVGs contain filled paths, with no live lettering, embedded fonts, stock symbols, strokes, or external resources.

## Palette

| Color | Hex | RGB | Use |
| --- | --- | --- | --- |
| Cobalt | #2457FF | 36, 87, 255 | Monogram, emphasis, buttons, title bars |
| Ink | #101828 | 16, 24, 40 | Wordmark, text, dark backgrounds |
| Cool silver | #E7ECF3 | 231, 236, 243 | Frames, backgrounds, light rules |
| White | #FFFFFF | 255, 255, 255 | Paper, reversed artwork |
| Black | #000000 | 0, 0, 0 | One-color reproduction |

The full-color logo belongs on white or cool silver. Use the white logo on ink or cobalt, and black for one-color printing. White/cobalt contrast is approximately 5.4:1; ink/white is approximately 17.7:1. Cobalt on ink is reserved for decoration, never small text. Screen RGB colors are authoritative; convert through the printer's ICC profile for print instead of assuming a universal CMYK equivalent.

## Files

- `sanoraworks-monogram`, `-horizontal`, and `-stacked`: SVGs in full color, `-black`, and `-white` versions. Color variants have no suffix.
- `*-2048.png`: transparent monogram (2048 ? 2048) and horizontal (2048px wide) PNGs, in all three versions. White artwork is invisible on white: inspect it over a dark surface.
- `sanoraworks-avatar-white-on-cobalt.png` and `sanoraworks-avatar-cobalt-on-white.png`: 1024 ? 1024 social profile images; monogram only.
- `sanoraworks-social-cover.png`: 1500 ? 500. The approved tagline is separate from the logo.
- `sanoraworks-share.png`: 1200 ? 630, matching the website's `/opengraph-image`.
- `sanoraworks-apple-icon.png`: 180 ? 180, matching `/apple-icon`.
- `sanoraworks-favicon.svg` and `sanoraworks-favicon-{16,32,48,128}.png`: matching cobalt tiles with white SW.
- `sanoraworks-preview.svg` and `.png`: light, dark, black, white, avatar, circular crop, and website applications. Labels on the preview sheet are ordinary text; the logo artwork itself is fully outlined.
- `colors.json` and `manifest.json`: palette and export dimensions.
- `index.html`: browse the artwork and download the ZIP.
- `sanoraworks-brand-kit.zip`: complete download. Older `-emblem` and `-wordmark` SVG URLs alias the new artwork for compatibility.

## Spacing and sizes

Use a clear-space unit equal to one principal stroke: 14 units in the 128 ? 112 symbol geometry (roughly one eighth of its visible width). Keep at least one unit clear of other artwork on all sides, beyond the tightest visible edges. Allow two units when space permits. Horizontal lockups use a fixed gap; do not move the symbol and letters independently. Transparent artboards are export bounds, not a substitute for clear space in a layout.

Use the dedicated tiled favicon at 16, 32, and 48px. The standalone symbol is intended for 32px and larger; use the horizontal logo at 180px wide or larger and the stacked logo at 140px wide or larger. Keep native proportions. In the supplied 1024px avatars, visible artwork stays within the central 600px square and within a circular crop, with no tagline, border, or wordmark. Upload the square file and let the platform apply its crop.

Do not stretch, rotate, add effects, recolor individual segments, close the diagonal opening, outline the symbol, or place the full-color logo on a low-contrast background. Keep the tagline outside the logo artwork. Do not add new slogans or badges. Use accessible text alternatives such as ?SanoraWorks?; decorative inline SVGs should be hidden from assistive technology when an enclosing link already supplies the name.

## Source and regeneration

`src/lib/brand-symbol.ts`, `brand-paths.ts`, `brand-colors.ts`, and `brand-artwork.ts` are the shared sources. Run `npm run brand:build` from the repository root to regenerate all exports, CSS tokens, app favicon files, and the ZIP with the pinned development dependency `sharp`. The metadata routes render the same outlined SVG sources. No network or font installation is needed for ordinary regeneration.

Only when changing the lettering: `pip install fonttools brotli`, then `python scripts/outline-wordmark.py`. This optional source step outlines the bundled OFL Manrope; keep its license (`OFL.txt`) with distributed artwork. The letter outlines have no runtime font dependency. If the approved tagline changes, update the separate caption in that source step too.

Original SanoraWorks artwork and branding: all rights reserved. The bundled Manrope font remains under the SIL Open Font License; that font license does not grant rights to the SanoraWorks identity.
