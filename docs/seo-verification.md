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

Initial release: `8aee89681f7765581ca498d97b6bf03ecb3c5719`, deployed through the existing guard from clean, pushed main. Worker version: `97f1ef1c-1e87-4170-a5e4-7513a67225f4`. Production smoke passed all fifteen pages and 42 links/anchors. Production agent-readiness reported **22 PASS / 2 FAIL / 0 SKIP**: all page/metadata/schema/Markdown/HEAD tests, discovery endpoints, REST, canonical redirects, live MCP tools/resources and invalid input, registry, and TLS/HTTP2 on all three hosts passed. Both resolver groups failed because the SVCB/TXT discovery records and registrar DS are absent. DNSKEY/RRSIG data exists, but both resolvers report AD=false, so no authenticated chain is claimed.

Before/after public DNS comparison confirmed the existing nameservers (`tricia.ns.cloudflare.com`, `zod.ns.cloudflare.com`), MX records, root SPF and Google site-verification TXT are unchanged. The existing Google verification record suggests an existing Search Console property may be available; account verification and measurement remain unconfirmed. OpenSEO is available but not connected in this session.

The first post-release mobile Lighthouse run scored 83 (FCP/LCP 3.1 s, TBT 40 ms, CLS 0, Speed Index 6.5 s); transfer weight fell from approximately 703 KB in the earlier production baseline to 482 KB. Network/server latency differed, so a single run cannot isolate a regression. A follow-up defers MCP SDK initialization to MCP requests, removing its initialization from ordinary page startup without changing page copy or client interactions. Final release and performance observations follow after that guarded deployment.

### Final deployed source and results

- Source: `f58093ac3e9454530f59df0dfcbccb426f145f0b`, reviewed, committed, pushed to main, then rebuilt and released through `npm run deploy:cloudflare`. Final Worker version: `b1deb4c1-e569-4df3-b5df-a4563d3bf075`. Compressed Worker bundle: 2,247.43 KiB; the Free plan was retained. This final evidence is a subsequent documentation-only commit; it changes no deployed application code.
- Lint, type checks, all 30 unit tests, production build, and the real Workers MCP test passed again after deferred initialization. The latter exercised all four tools and fifteen resources, rejection cases and actual rate-limit enforcement. The 60 responsive page checks and 14 interaction checks apply to the unchanged page UI; no additional client scripts were introduced by the follow-up.
- Final production smoke: **PASS**, fifteen pages and 42 internal links/anchors, including genuine 404s, service selections and share images.
- Final production agent-readiness: **22 PASS / 2 FAIL / 0 SKIP**. The fifteen intended page titles/descriptions, canonical URLs, one H1, page schema, HTML/Markdown preferences and q=0 cases, HEAD behavior, discovery Link headers, no-store Markdown, REST allowlist, utility noindex, catalog profile, OpenAPI, robots preferences, sitemap, canonical redirects, all MCP tools/resources, registry, and TLS/HTTP2 on apex/MCP/agents passed. Both failures are the outstanding DNS-AID/authenticated-chain groups, one for each validating resolver.
- Cloudflare and Google resolver observations: both requested SVCB records and both TXT fallbacks are absent; the parent DS is absent; DNSKEY/RRSIG records are present; AD=false. DNSSEC is **not verified**. No existing nameserver or email configuration was changed. Account-dependent completion remains explicit rather than being counted as a pass.
- Final mobile Lighthouse observation: **84/100**, FCP 2.8 s, LCP 3.0 s, TBT 40 ms, CLS 0, Speed Index 6.8 s, transfer 481,274 bytes. The responsive logo selected the 640-pixel WebP at about 36.8 KB transferred. This is about 32% less total transfer than the earlier production run, with lower blocking time and no layout shift. Painting remains a performance improvement opportunity; variable network/edge latency and the existing animations affect these single-run lab comparisons. These results do not establish field Core Web Vitals or an organic-search baseline.

Public interfaces are live at [interface documentation](https://sanoraworks.com/agents), [API catalog](https://sanoraworks.com/.well-known/api-catalog), [OpenAPI](https://sanoraworks.com/openapi.json), [MCP](https://mcp.sanoraworks.com/) and [organization registry](https://agents.sanoraworks.com/). MCP uses protocol POST requests; a plain browser GET correctly returns 405 rather than a placeholder service page.

Next account actions: provide the scoped Cloudflare DNS Edit + Zone Read token in ignored `.env.dns.local` to apply the reviewed SVCB/TXT records and retrieve provider-confirmed DS values; publish the matching DS in Hostinger; rerun `npm run test:agents` until both resolver groups pass. Connect the existing Search Console property (for example through OpenSEO), confirm sitemap submission in Search Console/Bing, and record measured D0 data before the 30/60/90-day comparisons. No credentials belong in Git or the public content model.
