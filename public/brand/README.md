# SanoraWorks supplied logo

This identity uses the user's supplied SW orbit logo, with only the small four-point star removed. The SW, orbital swooshes, vertical divider, SanoraWorks lettering, and "PRACTICAL TECHNOLOGY FOR BUSINESS" caption come from the supplied image. The website uses that complete image, without an additional masthead tagline.

## Source and exports

- `sanoraworks-logo-source.png`: full-size 2172 x 724 transparent master. The ImageGen edit was restricted to the star area; pixels outside that mask remain identical to the supplied original.
- `sanoraworks-logo.png`: tightly cropped complete logo at its native resolution, used in the masthead.
- `sanoraworks-mark.png`: cropped SW and orbit, used in illustrations and icons.
- `sanoraworks-lettering.png`: original lettering and caption, used for the stacked export.
- `-white.png` and `-black.png`: monochrome derivatives that retain the source alpha channel. No letterforms or symbols have been redrawn.
- `sanoraworks-monogram`, `-horizontal`, and `-stacked`: SVG containers with embedded PNG data, in color, black, and white. These preserve the supplied raster artwork; they are not traced vector paths and remain limited by the source resolution.
- `*-2048.png`: 2048px square monogram and 2048px-wide horizontal exports. Larger exports do not add source detail.
- `sanoraworks-avatar-*.png`: 1024px square profile images using only SW and orbit, with circular-crop padding.
- `sanoraworks-social-cover.png`: 1500 x 500.
- `sanoraworks-share.png`: 1200 x 630, matching `/opengraph-image`.
- `sanoraworks-apple-icon.png`: 180 x 180, matching `/apple-icon`.
- `sanoraworks-favicon.svg` and `sanoraworks-favicon-{16,32,48,128}.png`: matching white SW/orbit on cobalt tiles.
- `sanoraworks-preview.svg` and `.png`: applications on light, dark, monochrome, avatar, website, and social surfaces.
- `colors.json`, `manifest.json`, and `index.html`: interface palette, export dimensions, and preview page.
- `sanoraworks-brand-kit.zip`: current assets and notes. Legacy `-emblem` and `-wordmark` SVG URLs also show this supplied logo.

## Color and placement

The original blue gradient, dark lettering, and gray caption are preserved in the full-color image. The website interface keeps cobalt #2457FF, ink #101828, cool silver #E7ECF3, and white #FFFFFF. Use the full-color logo on white or silver and the white derivative on dark backgrounds. Do not substitute the interface color for the source gradient.

Preserve proportions and keep at least one main SW stroke of clear space around the visible artwork. Use the horizontal logo at 300px wide or larger when the caption must remain legible. Use the monogram or dedicated favicon at smaller sizes. Do not add the removed star, redraw the letters, replace the caption, or duplicate the caption outside the logo. Social avatars contain only the cropped monogram and orbit.

## Regeneration

Run `npm run brand:build` to crop and export the committed star-free master, regenerate CSS tokens, rebuild SVG containers and social assets, and package the ZIP. Run `npm run brand:check` to check dimensions, transparency, embedded raster logos, crop safety, matching app icons, and interface contrast. Normal export does not use ImageGen or need network access.

The full editing prompt and preservation method are recorded in `docs/logo-edit.md`. Historical Manrope licensing is retained in `OFL.txt`; this supplied raster logo does not load or depend on that font. SanoraWorks branding: all rights reserved.
