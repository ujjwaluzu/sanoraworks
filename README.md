# SANORA WORKS

The independent technology and engineering company website. Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, and Lucide icons. Server Components render the site; client JavaScript is limited to navigation, project filtering, and the enquiry form.

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
```

`QA_BASE_URL` defaults to `http://localhost:3001`. The visual review saves full-page screenshots for every route at 375px, 768px, 1440px, and 1920px, then checks 320px and the 720px effective viewport of a 1440px display at 200% zoom. The interaction review covers keyboard FAQs, filters, preselection, validation, actual local brief downloads, and a browser-intercepted delivery failure. The failure fixture never sends an external enquiry. Reports and screenshots are saved under ignored `artifacts/`.

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

- `src/data/site.ts`: company details, founders, navigation, principles, and process.
- `src/data/services.ts`: services, capabilities, deliverables, and FAQs.
- `src/data/projects.ts`: project descriptions, verified technology stacks, and live/repository URLs.
- `src/app/globals.css`, `home.css`, `work.css`, `pages.css`, `contact.css`: cobalt, ink, and cool silver workshop design system and responsive layouts.
- `src/components/layout/`: shared full-viewport frame navigation, 248px directory sidebar, and compact footer. The sidebar follows the main content below 800px; mobile navigation uses two clear rows.
- `src/components/ui/Panel.tsx`: reusable titled content panels.
- `public/brand/`: standalone, outlined SVG wordmarks and emblems in default, light, and monochrome variants, plus favicon and usage notes.
- `src/lib/brand-symbol.ts`, `brand-paths.ts`, `brand-colors.ts`, and `brand-artwork.ts`: shared SW geometry, outlined lettering, master palette, and social layouts. Run `npm run brand:build` to regenerate the assets, CSS tokens, and ZIP. `npm run brand:check` validates export dimensions, transparency, circular crops, outlined logos, and palette contrast.
- `/brand/index.html`: identity preview and downloadable kit; `public/brand/README.md` documents spacing, variants, and font licensing.

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

Deploy to a host that supports the Next.js Node.js runtime, such as Vercel or a Node.js server. Build with `npm ci && npm run build`; start with `npm start`. The dynamic contact route requires a server runtime. Domain registration, DNS changes, and public hosting are separate from this repository implementation.

Work is committed and pushed incrementally to `main` in reviewable milestones. A scoped dependency override keeps the lint toolchain on a patched version of `minimatch`; rerun lint and audit when updating the toolchain.

The workshop uses system Verdana/Tahoma for reading, Arial for headings, and Courier New for technical labels. The former Manrope font remains archived under the SIL Open Font License in `src/app/fonts/OFL.txt` and is no longer loaded. All rights reserved for original Sanora Works branding and website content. This repository does not grant an open-source license.
