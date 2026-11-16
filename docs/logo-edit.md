# Supplied logo: remove the star

The user supplied `SanoraWorks Orbit Tech Logo.png` and asked to use that image, removing only its four-point star. The original source file was left untouched.

The built-in ImageGen tool produced the star removal. To preserve the exact source lettering and geometry, its result was applied only through a small polygon mask around the star. The master retains all source pixels outside that mask unchanged. This changed 1,067 pixels on the original 2172 × 724 canvas; transparent margins and the original alpha channel are retained. The master is `public/brand/sanoraworks-logo-source.png`.

Final prompt used with the supplied image as the edit target and transparent background enabled:

> Use case: precise-object-edit. Edit target: the supplied SanoraWorks logo PNG. Remove ONLY the small four-point star/sparkle above the right side of the SW monogram (near the top of the orbit). Fill its former area with transparency. Preserve the original SW lettering, both orbital swooshes, blue gradients, vertical divider, exact SanoraWorks wordmark typography and kerning, exact tagline 'PRACTICAL TECHNOLOGY FOR BUSINESS', all positions, proportions, colors, and transparent background. Preserve the complete wide horizontal composition. Do not redraw, restyle, simplify, replace lettering, add symbols, or alter any other visible part. Return a transparent PNG of the supplied logo with only the star removed.

The native website logo is a transparent 1671 × 299 crop of that master. Its SW/orbit crop is 437 × 299. White and black export derivatives change RGB values while retaining alpha; all lettering and symbols still come from the supplied pixels. The SVG downloads embed these PNGs rather than claiming to be vector tracings. Source resolution limits apply to larger exports.

The masthead uses the complete supplied logo, including its caption, and omits the separate tagline that previously appeared underneath it. Website illustration marks, icons, share images, preview, legacy logo asset URLs, and the downloadable kit now use this same source. The interface palette and page content are otherwise unchanged.
