# Performance verification

Reviewed 18 November 2026. The implementation was subsequently deployed; local
measurements and post-release production observations are recorded separately.
No new Lighthouse score or field Core Web Vitals result is claimed.

## Changes

- Enable Next.js's documented experimental `inlineCss` option so first-visit
  text rendering does not wait for separate stylesheets. CSS is included in
  HTML and the RSC payload, trading independent stylesheet caching for fewer
  initial network round trips. This can increase HTML size on repeat visits.
- Give the masthead logo high fetch priority.
- Replace animation mark PNG requests with lossless WebP. The native dimensions,
  visible RGB pixels and alpha are checked against all three PNG variants by
  `scripts/prepare-performance-images.mjs`. The default mark falls from 66,442
  to 44,316 bytes (33%).
- Add 320px project derivatives and responsive source selection across 320,
  640 and 1536px. Small derivatives are 9,152–11,996 bytes; large project-detail
  previews can now choose the existing 640px asset on smaller displays.
- Place banner copy before the large SVG in the HTML. Its CSS grid arrangement
  is unchanged. This avoids a streamed-rendering shift on phones when the
  illustration reaches the browser before the text above it.
- Record the owner's confirmation that a real production enquiry reached the
  inbox in `turnstile.md`.

## Comparable local mobile observations

`scripts/performance-qa.mjs` uses installed Chrome, a 390 × 844 viewport at 2x
pixel density, an empty browser cache per run, 150ms simulated latency, 1.6Mbps
download and 4x CPU slowdown. Animations remain enabled. API submissions are
blocked by the browser fixture. Three independent contexts were measured for
each build.

| Measurement | Before | Final |
| --- | --- | --- |
| LCP per run | 3,056 / 2,052 / 1,532 ms | 2,236 / 660 / 708 ms |
| Median LCP | 2,052 ms | 708 ms |
| Median FCP | 2,052 ms | 708 ms |
| CLS, every run | 0 | 0 |
| Stylesheet links on first load | 2 | 0 |
| Initial subresource transfer, every run | 295,311 bytes | 261,123 bytes |
| Horizontal overflow / browser errors | None | None |

The measured median LCP reduction is approximately 65%. Subresource transfer is
approximately 34 KB lower (12%); this excludes the HTML document and is not a
claim about total page weight. Lazy project images below the viewport are not
part of this initial transfer observation.

These are small-sample local lab results, with substantial first-run variation,
not Lighthouse scores, field Core Web Vitals or a guaranteed production speedup.
Long-task overhead remains around one second under the simulated CPU slowdown;
this change targets the initial rendering waterfall and image delivery rather
than replacing Next.js hydration. The earlier live audit's server/edge latency
also requires a fresh live measurement after deployment.

Raw reports and screenshots: ignored `artifacts/performance/before.json`,
`final.json` and the corresponding mobile PNGs.

## Validation

- All 38 unit/server tests passed.
- Next.js production build, its TypeScript checks, and the OpenNext Cloudflare
  build passed.
- Final lint passed.
- Final production-server smoke passed: fifteen pages and 42 internal links and
  anchors, metadata, sitemap, genuine 404s, images and enquiry safeguards.
- All 60 responsive route/viewport checks passed at 320, 375, 768 and 1440px;
  mobile WCAG scans reported no violations and no browser runtime errors.
- Navigation checks passed, including keyboard, touch targets, client-side
  transitions, active routes, reduced motion and the no-JavaScript menu.
- All seven banner checks passed, including responsive artwork, exact assembled
  source-pixel equality, playback, suspension, delayed image loading, reduced
  motion and no-JavaScript fallback.


## Production release (18 November 2026)

- Application source: `23bef42334f6529a182e80bce81110d7ca4a744c`, committed and
  pushed to main, then built and published through `npm run deploy:cloudflare`.
- Cloudflare Worker version: `834b3d03-11dc-4dd1-b0c7-37d912c161c1`.
  Compressed Worker bundle: 2,641.59 KiB.
- [GitHub CI passed](https://github.com/ujjwaluzu/sanoraworks/actions/runs/44249895421).
- Live production smoke passed for all fifteen pages and 42 links/anchors,
  metadata, sitemap, real 404s, share images and enquiry safeguards.
- The same three-run mobile browser procedure against https://sanoraworks.com
  measured LCP at 2,944 / 660 / 1,024 ms (median 1,024 ms). Every run recorded
  CLS 0, no horizontal overflow, no browser errors and zero external stylesheet
  links. Results vary with edge/network and startup conditions; these are
  throttled browser observations, not Lighthouse scores or a controlled
  before/after production comparison.
- Raw production evidence is under ignored `artifacts/performance/production.json`
  and `production-mobile.png`. No real enquiry email was sent.
- This release record is a subsequent documentation-only commit and does not
  change the deployed application code.