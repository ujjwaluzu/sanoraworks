# Contact security verification

The contact page alone loads Cloudflare's unproxied Turnstile script via Next.js Script. The Managed widget uses explicit execution after field validation, a flexible width, and the action `contact_enquiry`. Error, expiry, timeout, blocked-script and unsupported-browser paths preserve entries and show the email alternative. Each manual retry resets verification. No request is automatically resent.

The API retains field validation, honeypot and hashed-IP rate limiting, then validates the separate `turnstileToken`. Siteverify receives only `secret` and `response`, with a five-second deadline covering fetch and body reading. Delivery requires `success: true`, exact hostname `sanoraworks.com`, and exact action `contact_enquiry`. Missing configuration fails closed. Tokens and raw provider diagnostics are excluded from application logs and email.

## Production setup and release

1. In the Cloudflare account dashboard, open Turnstile and Add widget. Name it **SanoraWorks Contact**, use **Rest of World**, restrict hostname to **sanoraworks.com**, select **Managed**, and disable pre-clearance.
2. Save the public `TURNSTILE_SITE_KEY` in ignored `.env.local`. Save `TURNSTILE_SECRET_KEY` in ignored `.dev.vars`. Example files contain no credentials. Never paste secrets into chat, tracked files or command arguments.
3. Review widget settings in the dashboard. The saved deployment login lacks Turnstile-management access; a suitable account login must create and inspect the widget. Siteverify cannot attest that a site key and secret belong to the same widget or report its dashboard settings.
4. Review changes, run lint, tests, typecheck, production build, browser QA, Cloudflare build and Workers preview. Commit and push reviewed `main`.
5. Run `npm run deploy:cloudflare -- --check`. The existing guard checks clean `main` equals fetched `origin/main`, rejects missing/test keys, and probes Siteverify with an invalid token to check the secret is accepted. This sends no enquiry.
6. Run `npm run deploy:cloudflare`. The guard builds, uploads the secret from `.dev.vars` through stdin, and deploys with the public site key as a Worker variable. Upload failures stop deployment. The secret never enters command arguments or committed configuration.
7. Confirm the production widget loads. POST valid enquiry fields **without a token** and confirm HTTP 400. Do not send a real enquiry. Confirm no email delivery occurred. Dashboard/widget access is required to resolve any production configuration mismatch.

## Local verification

Use Cloudflare's official visible passing widget `1x00000000000000000000AA` for local browser QA, configured only in the local test server environment. Never deploy it. Browser tests intercept `/api/enquiry`, so no real email can be sent. Deterministic widget mocks cover client error/expiry/timeout and navigation paths. Server tests mock Siteverify and email responses, including invalid, expired/reused tokens, strict hostname/action checks, timeouts and delivery failures.

Official test-secret success responses have hostname `example.com` and no action. They intentionally fail the production hostname/action checks. Tests supply mocked production-shaped responses rather than adding a production bypass.

After `npm run build`, start a separate local QA server with the official site key:

```powershell
$env:TURNSTILE_SITE_KEY='1x00000000000000000000AA'
npm run start -- --port 3002
```

In a second terminal run `npm run test:turnstile-browser` (default port 3002).
For Worker QA, run:

```powershell
npm run build:cloudflare
npm run preview:cloudflare -- --port 8787 --var TURNSTILE_SITE_KEY:1x00000000000000000000AA --var TURNSTILE_SECRET_KEY:1x0000000000000000000000000000000AA
```

Then run `npm run test:turnstile-worker`. This tests token rejection and consumes
the local IP limit, so wait one minute before repeating it. Set
`QA_BASE_URL=http://127.0.0.1:8787` to run browser checks against the preview.
Browser reports and desktop/mobile screenshots are saved under ignored
`artifacts/turnstile/`. Test keys belong only in these local process environments.

## Implementation verification (2026-11-18)

- Lint, TypeScript, all 38 unit/server tests, production build, OpenNext Cloudflare build and Wrangler deployment dry run passed.
- Production-server and Worker-preview smoke checks passed for all fifteen public pages, internal links and enquiry validation. Worker public/agent readiness passed 17 checks; live DNS/TLS checks are outside local preview.
- Browser QA passed against both the production server and Worker preview: official passing widgets at 320px, 390px and 1440px, no horizontal overflow, no axe violations in the enquiry form, keyboard completion, blocked scripts, failure preservation, fresh manual retries, duplicate suppression and navigation cleanup/remount.
- Local Worker API checks passed for missing/malformed tokens, strict rejection of official test-secret hostname/action responses, and the existing IP rate limit. No valid production token or real enquiry was submitted.
- Production keys were supplied and moved from the example files into ignored `.env.local` and `.dev.vars`; the example values were cleared. Siteverify accepts the production secret. The user confirmed Managed mode, hostname `sanoraworks.com`, and disabled pre-clearance. A real-widget preflight on the production origin required manual verification in the automated browser and could not complete; production challenge completion was not claimed or bypassed.
- The release guard rejected an official test site key. With production configuration, `--check` passed, the Worker secret uploaded, and the reviewed/pushed clean `main` source `6c83e0e13cc69df8c964cffa87c4105a72e343d9` deployed successfully as Worker version `1b807573-4131-42e8-b497-1bcccf327c82`. [GitHub CI passed for this source](https://github.com/ujjwaluzu/sanoraworks/actions/runs/44151634648).
- Production checks passed: Contact loads the real widget and its script; a fresh homepage does not load Turnstile; desktop and 320px layouts fit; valid enquiry fields without a token receive HTTP 400 with the security verification error rather than field validation errors. The production fifteen-page smoke check passed. No real enquiry was sent, and no production challenge was executed during post-release checks.
- Both production keys were absent from staged changes, and the production secret was absent from all 110 public Worker assets. Screenshots and the production check report remain under ignored `artifacts/turnstile/`.

References: [Siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [widget configuration](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/), [test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).

## Owner delivery confirmation (2026-11-18)

The owner confirmed manually using the production contact form and receiving the enquiry email in the inbox. This confirms the real challenge/submission/delivery path from the owner's test; no additional email was sent during performance work.
