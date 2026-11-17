# SEO and agent discovery verification

Review date: 17 November 2026. Implementation baseline: `7c9f4a6`. This document records observed checks, with pending external dependencies kept separate from passes. Rankings, indexing, AI citations, and future field performance are not guaranteed.

## Implemented scope

- Eleven existing pages reviewed and updated; four dedicated service pages added. Exactly fifteen marketing/legal URLs are in the sitemap, each with its own explicit content revision date.
- Shared public content for copy, metadata, page schema, Markdown, REST and MCP. Existing project artwork, development status, section anchors, project filters, contact service parameters, and private PDF exclusions are retained.
- Stable Organization/WebSite identity, descriptive H1s, unique absolute titles/descriptions, breadcrumbs, Service descriptions and CreativeWork project markup. No fabricated clients, reviews, prices, locations, results or delivery commitments.
- App-owned robots preferences and Content-Signal headers; appended discovery Link headers; RFC 9727 profiled catalog; OpenAPI; four GET-only public REST interfaces; documentation and llms.txt excluded from the sitemap and carrying noindex.
- Version-controlled Worker wrapper negotiates Markdown, respects explicit quality values and q=0, merges Vary, uses no-store for Markdown, preserves Next navigation and canonical redirects, and removes HEAD bodies.
- Official MCP SDK fetch handler, fresh server per request, four read-only tools, fifteen canonical page resources, host/origin checks, independent 60/minute IP binding per Cloudflare location, and streamed 64 KiB request cap.
- Organization JSON registry and Wrangler custom domains for MCP and agents. Reviewed standard SVCB/TXT plan and scoped provisioning script; no invented SVCB keys or unimplemented agent protocols.
- Responsive lossless logo derivatives preserve the supplied artwork and PNG fallback while reducing the default image from 231,887 bytes to 17,056 or 36,380 bytes.

## Checks observed before release

| Check | Result | Evidence / scope |
|---|---|---|
| Unit tests | PASS | 30/30, including existing enquiry and animation tests plus negotiation, public allowlist, MCP tools/resources, invalid input, rate-limit failure, host/origin and streamed body caps |
| Lint and TypeScript | PASS | Repository lint and `tsc --noEmit`; final build also checks TypeScript |
| Next/OpenNext production build | PASS | All fifteen pages and utility routes generated; generated adapter remains untouched |
| Workers preview smoke | PASS | 15 pages, 42 internal links/anchors, unique metadata, 404s, sitemap, robots, share-image dimensions, service selection, enquiry safeguards |
| Existing interactions | PASS | 14/14 browser checks, including service anchors, project filters, all four contact selections, form validation, success/failure fixtures and mobile navigation; no real enquiry sent |
| Responsive/mobile accessibility | PASS | 60 page/viewport checks across 320, 375, 768 and 1440 pixels; all fifteen mobile WCAG A/AA scans report no violations, no horizontal overflow, one H1, loaded above-fold images and no runtime errors |
| Layout stability | PASS (lab) | CLS 0 on all fifteen 375-pixel pages in the local reduced-motion run; not field data |
| Preview agent-readiness | PASS | 17 groups passed; production subdomains/TLS/DNS were explicitly skipped in local mode |
| MCP in Workers runtime | PASS | Real workerd initialization, all four tools, all fifteen resource reads, private-path/origin/oversized-body rejection and actual rate-limit binding returning 429 |
| Wrangler deployment dry run | PASS | 9,237.93 KiB raw / 2,238.81 KiB gzip; valid assets and bindings, within Free-plan compressed Worker size limit |
| Private paths | PASS | REST and MCP reject unregistered/private paths; unknown pages return 404; private PDFs remain outside tracked public assets |

The initial direct Wrangler preview omitted OpenNext cache population and failed share images. The supported `npm run preview:cloudflare` workflow populates cache first and passes. Local preview disables inferred production origins to avoid host redirect loops. Both corrections are reflected in the documented command.

Lighthouse observations are separate from the responsive check. The old production homepage scored 91 in a mobile lab run (LCP 2.5 s, TBT 60 ms, CLS 0). An early local run scored 67 (LCP 5.4 s, TBT 60 ms, CLS 0); local runtime and network conditions differ from production, so these are not a controlled before/after comparison. That run identified the oversized header PNG and led to the responsive derivatives above. Record the final production run below after deployment rather than claiming a field Core Web Vitals result.

Raw local evidence is under ignored `artifacts/seo/` and `artifacts/redesign/`; scripts are version controlled. Research and 30/60/90-day measurement protocol are in [seo-research.md](seo-research.md).

## Account-dependent work

DNS-write and DNSSEC permissions are absent from the saved deployment OAuth session. A zone-scoped DNS Edit token plus Zone Read was requested; no token is published or committed. `scripts/provision-agent-dns.mjs` defaults to a read-only plan; `--apply` creates only the four records in [agent-dns-records.json](agent-dns-records.json), enables Cloudflare DNSSEC if disabled, and verifies unrelated DNS records and nameservers are unchanged. The matching DS still has to be entered at Hostinger. Only authenticated results from both Cloudflare and Google validating resolvers count as a DNSSEC pass.

Search Console and Bing Webmaster verification, sitemap submission, organic ranking/volume baseline and later measurements are pending their account access. No verification values or measurements are invented, and no visitor analytics scripts are installed. The user can supply account-generated public DNS verification records, then submit the sitemap in each account. D0 begins when measured data is available, followed by comparable 30/60/90-day reviews.

## Release and production observations

Pending the final preview and guarded release from clean, reviewed, pushed `main`. The existing deployment guard remains mandatory. Production verification must compare all fifteen intended titles/content against the shared model, so an older site cannot silently pass verification. Record the deployed commit, Worker version, live readiness results, TLS/HTTP2 and both resolver results here after release.
