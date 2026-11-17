import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { connect } from "node:http2";
import { publicPages } from "../src/data/public-content.ts";
import { contentSignal } from "../src/lib/public-http.ts";

const base = process.env.READINESS_BASE_URL || "https://sanoraworks.com";
const production = new URL(base).hostname === "sanoraworks.com";
const checks: { name: string; status: string; detail?: unknown }[] = [];
const fetchTimed = (url: string | URL, init?: RequestInit) =>
  fetch(url, { ...init, signal: AbortSignal.timeout(20_000) });
async function check(name: string, fn: () => Promise<unknown>) {
  try {
    checks.push({ name, status: "PASS", detail: await fn() });
  } catch (e) {
    checks.push({
      name,
      status: "FAIL",
      detail: e instanceof Error ? e.message : String(e),
    });
  }
}
function decode(s: string) {
  return s
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"');
}
for (const page of publicPages)
  await check(
    `Page ${page.path}: status, unique intended metadata, canonical, H1, schema, discovery and variants`,
    async () => {
      const url = base + page.path;
      for (const accept of [
        "text/html",
        "text/markdown",
        "text/markdown;q=0,text/html",
        "text/markdown;q=0.3,text/html;q=0.9",
        "text/markdown;q=0.9,text/html;q=0.3",
        "text/markdown;q=0,*/*",
      ]) {
        const r = await fetchTimed(url, { headers: { Accept: accept } });
        assert.equal(r.status, 200);
        assert.equal(r.headers.get("Content-Signal"), contentSignal);
        assert.match(r.headers.get("Vary")!, /Accept/i);
        for (const relation of [
          "api-catalog",
          "service-desc",
          "service-doc",
          "describedby",
        ])
          assert.ok(r.headers.get("Link")?.includes(`rel="${relation}"`));
        const md =
          accept === "text/markdown" ||
          accept.startsWith("text/markdown;q=0.9");
        const text = await r.text();
        if (md) {
          assert.equal(
            r.headers.get("Content-Type"),
            "text/markdown; charset=utf-8",
          );
          assert.equal(r.headers.get("Cache-Control"), "no-store");
          assert.ok(
            text.includes(`Canonical: https://sanoraworks.com${page.path}`),
          );
          if (page.status) assert.ok(text.includes("In development"));
        } else {
          assert.match(r.headers.get("Content-Type")!, /text\/html/);
          assert.equal(
            decode(text.match(/<title>(.*?)<\/title>/s)?.[1] || ""),
            page.title,
          );
          assert.equal(
            decode(
              text.match(/name="description" content="([^"]+)"/)?.[1] || "",
            ),
            page.description,
          );
          assert.equal((text.match(/<h1\b/g) || []).length, 1);
          assert.equal(
            new URL(
              text.match(/rel="canonical" href="([^"]+)"/)?.[1] ||
                "https://invalid.example",
            ).href,
            `https://sanoraworks.com${page.path}`,
          );
          const schemas = [
            ...text.matchAll(
              /<script type="application\/ld\+json">(.*?)<\/script>/gs,
            ),
          ].map((m) => JSON.parse(m[1]));
          const graph = schemas.find((s) => s["@graph"])?.["@graph"];
          assert.ok(
            graph?.some(
              (s: Record<string, unknown>) => s["@type"] === "BreadcrumbList",
            ),
          );
          if (page.path.startsWith("/services/"))
            assert.ok(
              graph.some(
                (s: Record<string, unknown>) => s["@type"] === "Service",
              ),
            );
          if (page.path.startsWith("/work/")) {
            assert.ok(
              graph.some(
                (s: Record<string, unknown>) =>
                  s["@type"] === "CreativeWork" &&
                  s.creativeWorkStatus === "In development",
              ),
            );
            assert.ok(
              !graph.some((s: Record<string, unknown>) =>
                ["Product", "SoftwareApplication"].includes(String(s["@type"])),
              ),
            );
          }
        }
      }
      for (const accept of ["text/html", "text/markdown"]) {
        const head = await fetchTimed(url, {
          method: "HEAD",
          headers: { Accept: accept },
        });
        assert.equal(head.status, 200);
        assert.equal(await head.text(), "");
      }
    },
  );
await check(
  "Catalog, OpenAPI, REST, documentation, noindex and private-path rejection",
  async () => {
    const catalog = await fetchTimed(base + "/.well-known/api-catalog");
    assert.equal(
      catalog.headers.get("Content-Type"),
      'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
    );
    const body = await catalog.json();
    assert.equal(body.linkset.length, 5);
    for (const entry of body.linkset)
      for (const rel of ["service-desc", "service-doc", "service-meta"])
        for (const link of entry[rel] || []) {
          const url = new URL(link.href);
          if (url.hostname === "sanoraworks.com") {
            const r = await fetchTimed(base + url.pathname);
            assert.equal(r.status, 200);
          }
        }
    const spec = await (await fetchTimed(base + "/openapi.json")).json();
    assert.equal(spec.openapi, "3.1.0");
    assert.equal(Object.keys(spec.paths).length, 4);
    for (const endpoint of ["site", "services", "projects"]) {
      const r = await fetchTimed(base + "/api/public/" + endpoint);
      assert.equal(r.status, 200);
      assert.equal(r.headers.get("X-Robots-Tag"), "noindex");
      await r.json();
    }
    for (const page of publicPages) {
      const r = await fetchTimed(
        base + "/api/public/pages?path=" + encodeURIComponent(page.path),
      );
      assert.equal(r.status, 200);
      assert.equal((await r.json()).path, page.path);
    }
    for (const path of [
      "/private.pdf",
      "/api/enquiry",
      "/../privacy",
      "https://example.com",
      "/services?x=1",
    ])
      assert.equal(
        (
          await fetchTimed(
            base + "/api/public/pages?path=" + encodeURIComponent(path),
          )
        ).status,
        404,
      );
    assert.equal((await fetchTimed(base + "/api/public/pages")).status, 400);
    assert.equal(
      (await fetchTimed(base + "/api/public/site", { method: "POST" })).status,
      405,
    );
    for (const path of [
      "/agents",
      "/llms.txt",
      "/openapi.json",
      "/.well-known/api-catalog",
    ]) {
      const r = await fetchTimed(base + path);
      assert.equal(r.status, 200);
      assert.equal(r.headers.get("X-Robots-Tag"), "noindex");
    }
  },
);
await check(
  "Robots preferences, exact fifteen-page sitemap, 404s, query canonicals and trailing redirects",
  async () => {
    const r = await fetchTimed(base + "/robots.txt");
    const robots = await r.text();
    assert.equal(
      (robots.match(/Content-Signal:/g) || []).length,
      1,
      "No prepended duplicate/contradictory managed content signals",
    );
    assert.ok(robots.includes(`Content-Signal: ${contentSignal}`));
    assert.ok(robots.includes("Disallow: /api/enquiry"));
    assert.doesNotMatch(robots, /ai-input=no|search=no|ai-train=yes/);
    const xml = await (await fetchTimed(base + "/sitemap.xml")).text();
    assert.equal((xml.match(/<loc>/g) || []).length, 15);
    for (const p of publicPages)
      assert.ok(xml.includes(`https://sanoraworks.com${p.path}</loc>`));
    for (const path of [
      "/missing",
      "/services/missing",
      "/work/missing",
      "/private.pdf",
      "/brand/sanoraworks-brand-kit.zip",
    ])
      assert.equal((await fetchTimed(base + path)).status, 404);
    for (const accept of ["text/html", "text/markdown"]) {
      const trailing = await fetchTimed(base + "/services/", {
        redirect: "manual",
        headers: { Accept: accept },
      });
      assert.equal(trailing.status, 308);
    }
    const query = await (
      await fetchTimed(
        base + "/contact?service=product-engineering&campaign=test",
      )
    ).text();
    assert.ok(
      query.includes('rel="canonical" href="https://sanoraworks.com/contact"'),
    );
  },
);
if (production) {
  await check(
    "HTTPS/apex canonical redirects for HTML and Markdown",
    async () => {
      for (const origin of [
        "http://sanoraworks.com",
        "https://www.sanoraworks.com",
      ])
        for (const accept of ["text/html", "text/markdown"]) {
          const r = await fetchTimed(origin + "/about?x=1", {
            redirect: "manual",
            headers: { Accept: accept },
          });
          assert.ok([301, 308].includes(r.status));
          assert.equal(
            r.headers.get("Location"),
            "https://sanoraworks.com/about?x=1",
          );
        }
    },
  );
  await check(
    "Organization registry and public MCP tools/resources with invalid inputs",
    async () => {
      const registry = await fetchTimed("https://agents.sanoraworks.com/");
      assert.equal(registry.status, 200);
      assert.equal(registry.headers.get("X-Robots-Tag"), "noindex");
      assert.equal((await registry.json()).agents[0].protocol, "mcp");
      let id = 0;
      const rpc = async (method: string, params: object = {}) => {
        const response = await fetchTimed("https://mcp.sanoraworks.com/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, text/event-stream",
          },
          body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }),
        });
        assert.equal(response.status, 200);
        assert.equal(response.headers.get("mcp-session-id"), null);
        const text = await response.text();
        return text.startsWith("{")
          ? JSON.parse(text)
          : JSON.parse(
              text
                .split("\n")
                .find((l) => l.startsWith("data:"))!
                .slice(5),
            );
      };
      const init = await rpc("initialize", {
        protocolVersion: "2025-11-25",
        capabilities: {},
        clientInfo: { name: "sanoraworks-readiness", version: "1" },
      });
      assert.equal(init.result.serverInfo.name, "sanoraworks-public");
      const tools = await rpc("tools/list");
      assert.equal(tools.result.tools.length, 4);
      for (const t of tools.result.tools) {
        assert.equal(t.annotations.readOnlyHint, true);
        const result = await rpc("tools/call", {
          name: t.name,
          arguments: t.name === "get_page" ? { path: "/about" } : {},
        });
        assert.ok(!result.error && !result.result.isError);
      }
      const resources = await rpc("resources/list");
      assert.equal(resources.result.resources.length, 15);
      for (const r of resources.result.resources) {
        const result = await rpc("resources/read", { uri: r.uri });
        assert.equal(result.result.contents[0].uri, r.uri);
      }
      const bad = await rpc("tools/call", {
        name: "get_page",
        arguments: { path: "/api/enquiry" },
      });
      assert.ok(bad.error || bad.result.isError);
      const badResource = await rpc("resources/read", {
        uri: "https://sanoraworks.com/private.pdf",
      });
      assert.ok(badResource.error);
      assert.equal(
        (
          await fetchTimed("https://mcp.sanoraworks.com/", {
            method: "POST",
            headers: {
              Origin: "https://evil.example",
              "Content-Type": "application/json",
            },
            body: "{}",
          })
        ).status,
        403,
      );
      assert.equal(
        (
          await fetchTimed("https://mcp.sanoraworks.com/", {
            method: "POST",
            body: "x".repeat(65_537),
          })
        ).status,
        413,
      );
    },
  );
  for (const hostname of [
    "sanoraworks.com",
    "mcp.sanoraworks.com",
    "agents.sanoraworks.com",
  ])
    await check(
      `TLS and HTTP/2 ${hostname}`,
      () =>
        new Promise((resolve, reject) => {
          const session = connect(`https://${hostname}`);
          const timer = setTimeout(() => {
            session.destroy();
            reject(new Error("HTTP/2 timeout"));
          }, 15000);
          session.on("error", (e) => {
            clearTimeout(timer);
            session.destroy();
            reject(e);
          });
          session.on("connect", () => {
            clearTimeout(timer);
            const protocol = session.alpnProtocol;
            session.close();
            if (protocol !== "h2") reject(new Error(`Negotiated ${protocol}`));
            else
              resolve({
                alpn: protocol,
                certificate: "TLS verified by Node default trust store",
              });
          });
        }),
    );
  for (const resolver of [
    "https://cloudflare-dns.com/dns-query",
    "https://dns.google/resolve",
  ]) {
    await check(
      `DNS-AID and authenticated DNSSEC chain via ${new URL(resolver).hostname}`,
      async () => {
        const answers: unknown[] = [];
        for (const [name, type] of [
          ["_index._agents.sanoraworks.com", "64"],
          ["mcp.sanoraworks.com", "64"],
          ["_index._agents.sanoraworks.com", "TXT"],
          ["mcp.sanoraworks.com", "TXT"],
          ["sanoraworks.com", "DS"],
          ["sanoraworks.com", "DNSKEY"],
        ]) {
          const url = new URL(resolver);
          url.search = new URLSearchParams({
            name,
            type,
            do: "true",
            cd: "false",
          }).toString();
          const data = await (
            await fetchTimed(url, {
              headers: { Accept: "application/dns-json" },
            })
          ).json();
          answers.push({
            name,
            type,
            status: data.Status,
            authenticated: data.AD,
            answers: data.Answer,
          });
          assert.equal(data.Status, 0, `${name} ${type} DNS status`);
          assert.ok(data.Answer?.length, `${name} ${type} missing`);
          assert.equal(data.AD, true, `${name} ${type} must be authenticated`);
          if (type === "64")
            assert.ok(
              data.Answer.some(
                (a: { data: string }) =>
                  /^1\s/.test(a.data) &&
                  a.data.includes('alpn="h2"') &&
                  a.data.includes("port=443"),
              ),
            );
          if (type === "TXT" && name.startsWith("mcp."))
            assert.ok(
              data.Answer.some(
                (a: { data: string }) =>
                  a.data.includes("proto=mcp") && a.data.includes("path=/"),
              ),
            );
        }
        return answers;
      },
    );
  }
} else
  checks.push({
    name: "Live subdomains, TLS, canonical hosts, DNS-AID and DNSSEC",
    status: "SKIP",
    detail: "Local preview; run against production after release.",
  });
mkdirSync("artifacts/seo", { recursive: true });
const report = { timestamp: new Date().toISOString(), base, checks };
writeFileSync(
  `artifacts/seo/readiness-${production ? "production" : "preview"}.json`,
  JSON.stringify(report, null, 2),
);
for (const check of checks)
  console.log(
    `${check.status}: ${check.name}${check.status === "FAIL" ? ` — ${check.detail}` : ""}`,
  );
console.log(
  `${checks.filter((c) => c.status === "PASS").length} passed, ${checks.filter((c) => c.status === "FAIL").length} failed, ${checks.filter((c) => c.status === "SKIP").length} skipped.`,
);
if (checks.some((c) => c.status === "FAIL")) process.exitCode = 1;
