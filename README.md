# SANORA WORKS

The independent technology and engineering company website. Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, and Lucide icons. Server Components render the site; client JavaScript handles navigation, project filtering, the enquiry form, and banner animation playback.

## Run locally

Requires Node.js 22.18 or newer and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production server, run `npm run build`, then `npm start`.

## Checks

```sh
npm run lint
npm run test
npm run build
npm run typecheck
```

The unit tests cover shared enquiry validation and locally prepared briefs. To check the production routes, internal links and anchors, metadata, social images, 404s, and enquiry safeguards, start a second terminal:

```sh
npm run start -- --port 3001
# In another terminal:
npm run test:smoke
```

`SMOKE_BASE_URL` overrides the smoke-test server URL. The smoke check avoids sending a valid test enquiry when delivery is enabled. Browser visual and keyboard QA should cover 375px mobile, 768px tablet, and 1440px desktop, including the wrapped navigation tabs, filters, FAQs, and contact form. No browser is required for the other checks. Restart the production server after rebuilding so its cached asset manifest matches the latest output.

Optional headless browser review uses an existing Playwright installation and Chrome/Chromium without adding a production dependency:

```sh
node scripts/visual-qa.mjs <installed-playwright-path> <chrome-executable>
node scripts/interaction-qa.mjs <installed-playwright-path> <chrome-executable>
node scripts/banner-motion-qa.mjs <installed-playwright-path> <chrome-executable>
```

`QA_BASE_URL` defaults to `http://localhost:3001`. The visual review saves full-page screenshots for every route at 375px, 768px, 1440px, and 1920px, then checks 320px and the 720px effective viewport of a 1440px display at 200% zoom. The interaction review covers keyboard FAQs, filters, preselection, validation, actual local brief downloads, and a browser-intercepted delivery failure. The failure fixture never sends an external enquiry. Reports and screenshots are saved under ignored `artifacts/`.

The banner review checks both illustrations at 320, 375, 600, 768, 800, 1024, 1050, 1100, 1280, 1440, and 1920px, the shared twelve-second animation phases, pixel equality with the original logo, automatic playback, offscreen suspension, a hidden-document visibility-event fixture, delayed logo loading, reduced motion, and disabled JavaScript. The Anatomy-based isometric computer illustrates an uncached DNS lookup, using the documentation address `192.0.2.1`. The supplied logo's two orbit curves start together and move to their final positions as SW appears. The banner keeps static artwork until it can start in view with its logo loaded. Reduced motion and disabled JavaScript keep completed artwork. Figure labels, step captions, the illustration tagline, and playback controls are omitted. See `docs/banner-motion.md` for the figure's design and source.

## Content and configuration

Copy `.env.example` to `.env.local`; never commit private environment files.

| Setting                     | Purpose                                                                      |
| --------------------------- | ---------------------------------------------------------------------------- |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Verified public email; otherwise the site shows a clear coming-soon message. |
| `NEXT_PUBLIC_LINKEDIN_URL`  | Verified HTTPS company profile; omitted until configured.                    |
| `NEXT_PUBLIC_GITHUB_URL`    | Verified HTTPS company profile; omitted until configured.                    |
| `CONTACT_WEBHOOK_URL`       | Private HTTPS endpoint accepting validated project enquiries.                |
| `CONTACT_WEBHOOK_TOKEN`     | Optional private bearer token for that trusted endpoint.                     |

Public environment values are read at build time. Rebuild after changing them. The private enquiry endpoint is read on the server. Set production environment variables in your hosting provider; `.env.local` is only for local development.

X, Instagram, and YouTube use the `sanoraworks` handle configured in `src/data/site.ts` (YouTube uses `/@sanoraworks`). The shared social profile list supplies the sidebar, footer, contact page, and Organization `sameAs` metadata. Optional GitHub and LinkedIn profiles join that same list when configured.

- `src/data/site.ts`: company details, founders, navigation, principles, and process.
- `src/data/services.ts`: services, capabilities, deliverables, and FAQs.
- `src/data/projects.ts`: project descriptions, verified technology stacks, and live/repository URLs.
- `src/app/globals.css`, `home.css`, `work.css`, `pages.css`, `contact.css`: cobalt, ink, and cool silver workshop design system and responsive layouts.
- `src/components/layout/`: shared full-viewport frame navigation, 248px directory sidebar, and compact footer. The sidebar follows the main content below 800px; mobile navigation uses two clear rows.
- `src/components/ui/Panel.tsx`: reusable titled content panels.
- `public/brand/`: the supplied SW orbit logo with its star removed, native transparent PNGs, monochrome derivatives, embedded-raster SVG containers, social exports, favicon, and usage notes.
- `src/lib/brand-artwork.ts`, `brand-server.ts`, and `brand-colors.ts`: shared raster compositions, metadata asset loading, and interface palette. Run `npm run brand:build` to regenerate crops, exports, CSS tokens, and an internal ZIP under ignored `artifacts/brand/`; `npm run brand:check` validates the assets.
- The site has no public brand kit page or ZIP download. `public/brand/README.md` documents source resolution, spacing, and variants; `docs/logo-edit.md` records the image edit.

Reading text starts at 16px with generous line spacing, and long paragraphs use a 68-character measure while the site frame fills the screen. Homepage shortcuts jump directly to services, projects, and process. Project entries have one full-row link each, and service rows offer a larger click target. The contact form comes before supporting information, keeps help text associated with validation errors, and displays a description character count without repeatedly announcing every keystroke.

Project interfaces are explicitly illustrative concepts. No client results, founder credentials, live project URLs, or project technology stacks have been invented. Populate those fields with verified information. The manually maintained sitemap modification date should be updated with substantive site changes.

## Enquiry integration

Without an enquiry endpoint, the form validates the brief and downloads a text file locally. It makes no network submission and explicitly says the brief has not been sent.

Once `CONTACT_WEBHOOK_URL` is set to a trusted HTTPS endpoint, the same form submits to `/api/enquiry`. That route validates the payload again, limits its size, checks browser origin, rejects a populated honeypot, and forwards JSON server-side. Endpoint credentials are never exposed to the browser. The endpoint must return a successful `2xx` response only after accepting responsibility for delivery or storage; that response is the basis for the website’s success state. Failed requests and timeouts produce an error without clearing the form.

Example forwarded payload:

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "company": "Example",
  "projectType": "Product Engineering",
  "budget": "Not yet defined",
  "description": "A project description of at least 30 characters.",
  "submittedAt": "2026-11-15T12:00:00.000Z",
  "source": "https://sanoraworks.com"
}
```

The endpoint should supply durable delivery/storage, appropriate rate limiting, and operational monitoring. No database or email provider is bundled into this first release. The site does not persist drafts or add analytics/tracking scripts. Review the privacy notice alongside the actual enquiry provider and hosting configuration before enabling delivery.

## Routes and deployment

Completed routes: `/`, `/services`, `/work`, `/work/[slug]` for the three configured projects, `/about`, `/contact`, `/privacy`, and `/terms`. SEO includes route metadata, canonicals for `https://sanoraworks.com`, Organization JSON-LD, share imagery, a sitemap, and robots.txt.

Service content already has stable slugs to support future service detail routes. Insights routes are deliberately absent until there is content to publish. There are no empty placeholder pages.

Production runs on Cloudflare Workers in the `sanoraworks@gmail.com` account,
with `https://sanoraworks.com` as the canonical website. The OpenNext adapter
preserves the existing Next.js build, server-rendered pages and enquiry API.
The account and zone IDs in `wrangler.jsonc` are public configuration, not
credentials. Authentication stays outside the repository.

### Build, preview and deploy on Cloudflare

```sh
npm ci
npm run build:cloudflare
npm run preview:cloudflare
# Preview runs at http://localhost:8787

# Authenticate as sanoraworks@gmail.com before deploying:
npx wrangler login
npm run deploy:cloudflare
```

The local Windows setup keeps this account's login separate from the existing
Cloudflare login. To reuse that session in PowerShell, first run:

```powershell
$env:XDG_CONFIG_HOME = Join-Path $env:APPDATA 'sanoraworks-cloudflare'
```

`npm run build` and `npm start` still provide the normal Node.js production
workflow. OpenNext recommends WSL or Linux for builds on Windows; validate with
the Workers preview before publishing. CI also builds the adapter and performs
a Wrangler dry run, without publishing or requiring deployment credentials.

The prerendered marketing pages use a read-only Workers Static Assets cache.
The contact page and `/api/enquiry` stay dynamic. No R2 bucket, database or queue
is required. If timed or on-demand revalidation is added later, replace the
read-only cache with an appropriate writable cache. `public/_headers` applies
security headers to static assets and immutable caching to Next.js build files.

### Domain and future updates

`sanoraworks.com/*` is a Worker route on the active Cloudflare zone. The domain
has Hostinger-managed DNS records, which prevent direct Worker Custom Domain
registration. The route uses the existing proxied DNS and TLS certificate;
email-related DNS records were not modified. Keep the website's DNS record
proxied in Cloudflare, and keep this Worker route attached. If the Hostinger DNS
integration is removed later, the route can be replaced by a Worker Custom
Domain after reviewing the DNS records.

The initial deployment is performed through Wrangler. Git pushes run the
repository checks; they do not automatically publish to Cloudflare. For
automatic deployments, connect `ujjwaluzu/sanoraworks` and the `main` branch in
the Worker's **Settings > Builds**. Use `npm run build:cloudflare` as the build
command and `npx opennextjs-cloudflare deploy -- --keep-vars` as the deploy
command. Keep credentials in Cloudflare's build settings, never in this repo.

The contact form currently prepares and downloads a local brief. Enquiry
delivery requires a verified `CONTACT_WEBHOOK_URL` and, if needed, its private
`CONTACT_WEBHOOK_TOKEN`. Set these as Worker runtime secrets; set public
`NEXT_PUBLIC_*` values in the build environment and rebuild. Deployments use
`--keep-vars` to preserve existing dashboard-managed runtime variables.

To verify the deployed website without sending a real enquiry:

```powershell
$env:SMOKE_BASE_URL = 'https://sanoraworks.com'
npm run test:smoke
```

Work is committed and pushed incrementally to `main` in reviewable milestones. A scoped dependency override keeps the lint toolchain on a patched version of `minimatch`; rerun lint and audit when updating the toolchain.

The workshop uses system Verdana/Tahoma for reading, Arial for headings, and Courier New for technical labels. The former Manrope font remains archived under the SIL Open Font License in `src/app/fonts/OFL.txt` and is no longer loaded. All rights reserved for original Sanora Works branding and website content. This repository does not grant an open-source license.
