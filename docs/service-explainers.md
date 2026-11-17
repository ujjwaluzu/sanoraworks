# Service animations

Four server-rendered SVG scenes illustrate the work with native Web Animations:

- Software: grouped code entry sends a signal to a dashboard; a cursor deploys an update and a Published panel appears.
- Product: navigation, content and feature modules dock into slots in an application frame. An inspection sweep precedes replacement with Insights v2.
- AI: an invoice enters the processing surface, a scan isolates Client, Total and Date fields, and the fields become validated records.
- Cloud: a release reaches the deployment junction, an additional server activates, health returns, traffic branches and the monitor draws its response.

## Art direction

The latest user direction supersedes the original text-free midnight palette:
light silver panels, theme-blue operations, short labels inside the artwork, and no
surrounding background, border, ambient wash or outer frame. The animations sit
directly on the page. Colors use the existing cobalt, silver, ink and surface theme tokens. Depth comes from shallow perspective, occlusion, thin
edges and restrained contact shadows. Only active signals and scans glow.

## Choreography and lifecycle

All loops last 15 seconds. `src/lib/service-animation.ts` defines named beats in
milliseconds and converts them to keyframe offsets. Signals move linearly;
assembly uses smooth acceleration/deceleration with a subtle docking settle;
the control has a fast press and short release. Layout transforms live on
parents, separate from motion targets. Panel content is clipped to its panel.

Each scene holds the completed result until 13 seconds. Local resets return all
tracks to identical start/end states. Frames for reduced motion are explicitly
chosen per scene (11.2s software, 11.5s product, 12s AI and 11.8s cloud).
Established towers and composition anchors never drift or disappear.

The playback controller suspends offscreen and in hidden tabs, preserves phase
on resume, and cancels animations and disconnects observers/listeners on
unmount. No JavaScript shows a completed, labeled composition. Accessible
figure descriptions remain available. No dependencies, backend, public API or
publishing changes were made.

## Local verification

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `node --experimental-strip-types scripts/service-animation-qa.mjs`

Browser QA uses the existing Playwright installation in `artifacts/qa-tools`
and local Chrome. Override `PLAYWRIGHT_PATH`, `CHROME_PATH` or `QA_BASE_URL` when
needed. Set `QA_MOTION_REVIEW=1` to record all four complete loops at normal and
half speed, including the loop seam. Screenshots, no-JavaScript views,
390px-phone views, videos and console-error results are saved locally under
`artifacts/service-animation/` (gitignored).

Checks cover animation targets and duration, separated layout transforms,
principal beats, transparent figures and labels, offscreen/hidden suspension,
reduced motion, client-navigation cleanup, SVG ID uniqueness, page overflow,
no-JavaScript artwork. Unit tests
also enforce ordered offsets, explicit easing and identical loop endpoints.
