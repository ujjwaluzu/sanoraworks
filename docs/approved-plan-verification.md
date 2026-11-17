# Approved content and layout plan: verification

Historical verification of the content and layout revision initially published
on 17 November 2026 at https://sanoraworks.com. The project set and artwork have
since been updated; the counts and Worker version below describe that earlier
verification, rather than the latest release.

The homepage has five sections and the approved headline, introduction, and
actions. Services describe situations, possible builds, and typical deliverables.
The About page combines the company explanation and delivery process. Project
previews use compact responsive rows and visible concept labels. The enquiry
form and accepted-delivery confirmation explain the next step. The sidebar
contains services, projects, and contact links.

The existing logo assets, blue palette, fonts, responsive navigation, top button,
and animation implementation remain in place. Service slugs, form option values,
URLs, anchors, delivery bindings, and spam safeguards remain compatible. No new
dependencies or backend endpoints were introduced. Only the successful enquiry
response copy changed in the delivery handler.

## Checks

| Check | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | 22 tests passed, including the accepted enquiry confirmation |
| `npm run build:cloudflare` | Passed, including the Next.js production build |
| `npm run test:smoke` | Passed on the Next.js server, Workers preview, and production: 10 pages and 32 internal links/anchors |
| `scripts/interaction-qa.mjs` | 14 checks passed: actions, anchors, navigation, all four service selections, validation/focus, intercepted success/failure, reset, FAQs, filters, responsive project rows, and keyboard top button |
| `scripts/visual-qa.mjs` | 66 route/viewport checks passed with no page errors or horizontal overflow |
| `scripts/navbar-qa.mjs` | Passed on Workers preview, including keyboard, touch targets, dismissal, active routes, reduced motion, and no JavaScript |
| `scripts/banner-motion-qa.mjs` | 7 checks passed: responsive layout, timelines, source-pixel logo comparison, playback, offscreen/hidden pause, image loading, reduced motion, and no JavaScript |
| `scripts/service-animation-qa.mjs` | Passed: all four scenes, timeline targets, desktop/phone phases, playback, suspension, reduced motion, cleanup, and no JavaScript |
| `scripts/logo-reveal-qa.mjs` | Passed: timeline, responsive layout, playback, suspension, reduced motion, cleanup, and no JavaScript |
| `git diff --check` | Passed |

Visual review includes 320, 375, 768, and 1440 pixels, plus 1920 pixels and a
720-pixel effective viewport for 200% zoom. Screenshots and machine reports are
under ignored `artifacts/`. Browser fixtures intercept email responses, unit tests
use stub bindings, and smoke tests send only invalid requests. No real enquiry
emails were sent.

Browser checks were updated to reflect the shorter page's maximum scroll
position and the existing banner behavior: the duplicate logo is hidden on
phones, DNS playback starts independently, and orbit tracks wait for their image.
The animation implementation was preserved.

## Deployment

Published the validated bundle with
`npx opennextjs-cloudflare deploy -- --keep-vars`, using the existing SanoraWorks
Cloudflare account and configuration.

Worker version: `3aa71b30-ad07-4015-a852-390f4fa129ef`.

Verified the live homepage headline, actions, and section structure. Production
smoke checks confirmed page copy checks, canonical metadata, internal links,
assets, 404s, sitemap, robots, and enquiry safeguards. The `www` root, services,
contact, and project links return permanent 308 redirects to the canonical host;
the contact service query is preserved.

## Detector attempt and evidence limit

Submitted https://sanoraworks.com once through the published
[AI Slop Detector form](https://madewithjev.com/free-tools/ai-slop-detector)
after verifying the deployment. Submission time: 17 November 2026, 13:00 UTC.
The form returned a 303 redirect to the
[existing domain report](https://madewithjev.com/free-tools/ai-slop-detector/report/sanoraworks.com).

The returned report shows 41%, dated 17 November 2026, with the old title
“Sanora Works: Practical technology. Built for your business.” Its strongest
findings are a generic headline (82%) and stock calls to action (55%). It advises
rescanning tomorrow. The retained old title and immediate return indicate that
the detector served its same-day cached report, rather than evaluating the
published revision. These findings describe the returned report; they do not
establish the revised site's score or a reduction.

One submission was made. A second submission was left unused because the
same-day cached result would not verify the new deployment. A fresh score remains
unverified until the detector permits another evaluation. No score badge or
unsupported score claim was added to the site. The response, report HTML/text,
and submission metadata are saved under ignored `artifacts/detector-rescan/`.
