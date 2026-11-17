import test from "node:test";
import assert from "node:assert/strict";
import { publicPages, pageMarkdown } from "../src/data/public-content.ts";
import {
  contentSignal,
  handlePublicUtility,
  prefersMarkdown,
} from "../src/lib/public-http.ts";
import { createSiteWorker } from "../src/lib/site-worker.ts";
import { handleMcp } from "../src/lib/public-mcp.ts";

test("content registry is restricted to fifteen unique public pages", () => {
  assert.equal(publicPages.length, 15);
  for (const field of ["path", "title", "description", "h1"] as const)
    assert.equal(new Set(publicPages.map((p) => p[field])).size, 15, field);
  for (const page of publicPages) {
    assert.match(page.revised, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(page.sections.length);
    assert.ok(
      pageMarkdown(page).includes(`https://sanoraworks.com${page.path}`),
    );
    if (page.path.startsWith("/work/"))
      assert.match(pageMarkdown(page), /In development/);
  }
});
test("explicit Markdown preference respects specificity, q=0, quality and order", () => {
  for (const accept of [
    null,
    "*/*",
    "text/html",
    "text/*",
    "text/markdown;q=0",
    "text/html,text/markdown",
    "text/markdown;q=0.2,text/html;q=0.8",
    "text/markdown;q=0,*/*;q=1",
    "text/markdown;q=garbage",
    "text/markdown;q=1.1",
  ])
    assert.equal(prefersMarkdown(accept), false, String(accept));
  for (const accept of [
    "text/markdown",
    "text/markdown,text/html",
    "text/markdown;q=0.9,text/html;q=0.3",
    "text/markdown,*/*",
    "TEXT/MARKDOWN",
    "text/markdown;q=0.1,text/html;q=0,*/*;q=1",
  ])
    assert.equal(prefersMarkdown(accept), true, accept);
});
test("REST rejects private, unknown, duplicate and non-exact paths", async () => {
  for (const path of [
    "/api/enquiry",
    "/private.pdf",
    "/../privacy",
    "/services?x=1",
    "https://sanoraworks.com/",
    "//sanoraworks.com/",
    "/work/missing",
    "/services/",
  ]) {
    const response = handlePublicUtility(
      new Request(
        `https://sanoraworks.com/api/public/pages?path=${encodeURIComponent(path)}`,
      ),
    )!;
    assert.equal(response.status, 404, path);
  }
  for (const search of ["", "?path=/&path=/about", "?path=/&extra=1"])
    assert.equal(
      handlePublicUtility(
        new Request(`https://sanoraworks.com/api/public/pages${search}`),
      )!.status,
      400,
    );
  for (const page of publicPages) {
    const response = handlePublicUtility(
      new Request(`https://sanoraworks.com/api/public/pages?path=${page.path}`),
    )!;
    assert.equal(response.status, 200);
    assert.equal((await response.json()).path, page.path);
    assert.equal(response.headers.get("X-Robots-Tag"), "noindex");
  }
  assert.equal(
    handlePublicUtility(
      new Request("https://sanoraworks.com/api/public/site", {
        method: "POST",
      }),
    )!.status,
    405,
  );
});
test("catalog is a profiled linkset; REST and docs are implemented and read only", async () => {
  for (const path of [
    "/api/public/site",
    "/api/public/services",
    "/api/public/projects",
    "/agents",
    "/llms.txt",
    "/openapi.json",
    "/.well-known/api-catalog",
    "/robots.txt",
  ]) {
    const response = handlePublicUtility(
      new Request(`https://sanoraworks.com${path}`),
    )!;
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get("Content-Signal"), contentSignal);
    assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
    assert.equal(
      await handlePublicUtility(
        new Request(`https://sanoraworks.com${path}`, { method: "HEAD" }),
      )!.text(),
      "",
    );
  }
  const catalog = handlePublicUtility(
    new Request("https://sanoraworks.com/.well-known/api-catalog"),
  )!;
  assert.equal(
    catalog.headers.get("Content-Type"),
    'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
  );
  assert.ok((await catalog.json()).linkset.length >= 4);
});
test("wrapper preserves preload, Vary, navigation, redirects, HEAD and separates caches", async () => {
  let calls = 0;
  const worker = createSiteWorker({
    async fetch() {
      calls++;
      return new Response("<html>ordinary HTML</html>", {
        headers: {
          "Content-Type": "text/html",
          Link: "</font.woff2>; rel=preload; as=font",
          Vary: "RSC, Next-Router-State-Tree",
          "Cache-Control": "public, max-age=30",
        },
      });
    },
  });
  const fetch = (
    path: string,
    headers: Record<string, string> = {},
    method = "GET",
  ) =>
    worker.fetch(
      new Request(`https://sanoraworks.com${path}`, { headers, method }),
      {},
      {},
    );
  const html = await fetch("/", { Accept: "text/html" });
  assert.match(html.headers.get("Link")!, /rel=preload/);
  assert.match(html.headers.get("Link")!, /rel="api-catalog"/);
  assert.match(
    html.headers.get("Vary")!,
    /RSC, Next-Router-State-Tree, Accept/,
  );
  assert.equal(html.headers.get("Cache-Control"), "public, max-age=30");
  const md = await fetch("/?campaign=test", { Accept: "text/markdown" });
  assert.equal(md.headers.get("Content-Type"), "text/markdown; charset=utf-8");
  assert.equal(md.headers.get("Cache-Control"), "no-store");
  assert.ok(!(await md.text()).includes("?campaign="));
  assert.equal(calls, 1);
  for (const headers of [
    { rsc: "1" },
    { "next-router-state-tree": "[]" },
    { "next-router-prefetch": "1" },
  ] as Record<string, string>[])
    assert.match(
      (await fetch("/", { Accept: "text/markdown", ...headers })).headers.get(
        "Content-Type",
      )!,
      /text\/html/,
    );
  const head = await fetch("/about", { Accept: "text/markdown" }, "HEAD");
  assert.equal(await head.text(), "");
  assert.equal(
    head.headers.get("Content-Type"),
    "text/markdown; charset=utf-8",
  );
  const redirect = await worker.fetch(
    new Request("http://www.sanoraworks.com/about?x=1", {
      headers: { Accept: "text/markdown" },
    }),
    {},
    {},
  );
  assert.equal(redirect.status, 308);
  assert.equal(
    redirect.headers.get("Location"),
    "https://sanoraworks.com/about?x=1",
  );
});
const allowed = {
  MCP_RATE_LIMIT: {
    async limit() {
      return { success: true };
    },
  },
};
const rpc = (
  method: string,
  params: object = {},
  headers: Record<string, string> = {},
  id = 1,
) =>
  new Request("https://mcp.sanoraworks.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      ...headers,
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
  });
async function rpcResult(request: Request) {
  const response = await handleMcp(request, allowed);
  const text = await response.text();
  const data =
    text.startsWith("event:") || text.startsWith("data:")
      ? JSON.parse(
          text
            .split("\n")
            .find((l) => l.startsWith("data:"))!
            .slice(5),
        )
      : JSON.parse(text);
  return { response, data };
}
test("MCP initializes, lists and calls all four read-only tools without sessions", async () => {
  const initialize = await rpcResult(
    rpc("initialize", {
      protocolVersion: "2025-11-25",
      capabilities: {},
      clientInfo: { name: "verification", version: "1" },
    }),
  );
  assert.equal(initialize.response.status, 200);
  assert.equal(initialize.data.result.serverInfo.name, "sanoraworks-public");
  assert.equal(initialize.response.headers.get("mcp-session-id"), null);
  const list = await rpcResult(rpc("tools/list"));
  assert.deepEqual(
    list.data.result.tools.map((t: { name: string }) => t.name),
    ["get_site_info", "list_services", "list_projects", "get_page"],
  );
  for (const tool of list.data.result.tools)
    assert.deepEqual(tool.annotations, {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });
  for (const name of [
    "get_site_info",
    "list_services",
    "list_projects",
    "get_page",
  ]) {
    const { data } = await rpcResult(
      rpc("tools/call", {
        name,
        arguments: name === "get_page" ? { path: "/services" } : {},
      }),
    );
    assert.equal(data.result.isError, undefined, name);
    const payload = JSON.parse(data.result.content[0].text);
    assert.ok(
      name === "get_site_info"
        ? payload.name === "SanoraWorks"
        : name === "list_services"
          ? payload.services.length === 4
          : name === "list_projects"
            ? payload.projects.length === 4
            : payload.path === "/services",
    );
  }
  for (const path of ["/private.pdf", "/api/enquiry", "/about?private=1"]) {
    const { data } = await rpcResult(
      rpc("tools/call", { name: "get_page", arguments: { path } }),
    );
    assert.ok(data.error || data.result?.isError, path);
  }
});
test("MCP lists and reads every canonical resource, rejecting unregistered resources", async () => {
  const { data } = await rpcResult(rpc("resources/list"));
  assert.equal(data.result.resources.length, 15);
  for (const resource of data.result.resources) {
    const read = await rpcResult(rpc("resources/read", { uri: resource.uri }));
    assert.equal(read.data.result.contents[0].uri, resource.uri);
    assert.equal(read.data.result.contents[0].mimeType, "text/markdown");
  }
  const bad = await rpcResult(
    rpc("resources/read", { uri: "https://sanoraworks.com/private.pdf" }),
  );
  assert.ok(bad.data.error);
});
test("MCP enforces host, origin, 64 KiB and separate limiter including chunked bodies", async () => {
  for (const headers of [
    { Origin: "https://evil.example" },
    { Host: "evil.example" },
    { Origin: "null" },
  ] as Record<string, string>[])
    assert.equal(
      (await handleMcp(rpc("tools/list", {}, headers), allowed)).status,
      403,
    );
  assert.equal(
    (await handleMcp(new Request("https://evil.example/"), allowed)).status,
    403,
  );
  assert.equal((await handleMcp(rpc("tools/list"), {})).status, 503);
  let rateKey = "";
  const limited = await handleMcp(
    rpc("tools/list", {}, { "cf-connecting-ip": "192.0.2.1" }),
    {
      MCP_RATE_LIMIT: {
        async limit({ key }) {
          rateKey = key;
          return { success: false };
        },
      },
    },
  );
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("Retry-After"), "60");
  assert.match(rateKey, /^mcp:[a-f0-9]{64}$/);
  assert.equal(
    (
      await handleMcp(
        new Request("https://mcp.sanoraworks.com/", {
          method: "POST",
          body: "x".repeat(65_537),
        }),
        allowed,
      )
    ).status,
    413,
  );
  const chunked = new Request("https://mcp.sanoraworks.com/", {
    method: "POST",
    body: new ReadableStream({
      start(c) {
        c.enqueue(new Uint8Array(40_000));
        c.enqueue(new Uint8Array(30_000));
        c.close();
      },
    }),
    duplex: "half",
  } as RequestInit);
  assert.equal((await handleMcp(chunked, allowed)).status, 413);
  const malformed = await handleMcp(
    new Request("https://mcp.sanoraworks.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: "{bad",
    }),
    allowed,
  );
  assert.equal(malformed.status, 400);
});
