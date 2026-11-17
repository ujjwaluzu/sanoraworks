import {
  getPublicPage,
  pageMarkdown,
  publicPages,
  publicProjects,
  publicServices,
  publicSiteInfo,
} from "../data/public-content.ts";
import { site } from "../data/site.ts";

export const contentSignal = "search=yes, ai-input=yes, ai-train=no";
export const discoveryLinks =
  '</.well-known/api-catalog>; rel="api-catalog", </openapi.json>; rel="service-desc", </agents>; rel="service-doc", </llms.txt>; rel="describedby"; type="text/plain"';
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};
export function mergeVary(headers: Headers, value: string) {
  const parts = (headers.get("Vary") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!parts.some((s) => s === "*" || s.toLowerCase() === value.toLowerCase()))
    parts.push(value);
  headers.set("Vary", parts.join(", "));
}
export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  const ranges = accept
    .toLowerCase()
    .split(",")
    .map((part, index) => {
      const [type, ...params] = part.trim().split(";");
      const qParam = params
        .map((s) => s.trim())
        .find((s) => s.startsWith("q="));
      const raw = qParam?.slice(2).trim();
      const q =
        raw === undefined
          ? 1
          : /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(raw)
            ? Number(raw)
            : 0;
      return { type: type.trim(), q, index };
    });
  const effective = (type: string) => {
    const matches = ranges.filter(
      (r) => r.type === type || r.type === "text/*" || r.type === "*/*",
    );
    matches.sort(
      (a, b) =>
        (b.type === type ? 2 : b.type === "text/*" ? 1 : 0) -
          (a.type === type ? 2 : a.type === "text/*" ? 1 : 0) ||
        b.q - a.q ||
        a.index - b.index,
    );
    return matches[0] ?? { q: 0, index: Infinity, type: "" };
  };
  const md = effective("text/markdown");
  const html = effective("text/html");
  return (
    md.type === "text/markdown" &&
    md.q > 0 &&
    (md.q > html.q ||
      (md.q === html.q && (html.type !== "text/html" || md.index < html.index)))
  );
}
export const agentRegistry = {
  name: "SanoraWorks public agent registry",
  url: "https://agents.sanoraworks.com/",
  description:
    "Public read-only access to SanoraWorks services, projects, and published pages.",
  agents: [
    {
      name: "SanoraWorks public information",
      protocol: "mcp",
      url: "https://mcp.sanoraworks.com/",
      transport: "streamable-http",
      documentation: `${site.url}/agents`,
      tools: ["get_site_info", "list_services", "list_projects", "get_page"],
      readOnly: true,
    },
  ],
};
export const apiCatalog = {
  linkset: [
    ...["site", "services", "projects", "pages"].map((name) => ({
      anchor: `${site.url}/api/public/${name}`,
      "service-desc": [
        {
          href: `${site.url}/openapi.json`,
          type: "application/vnd.oai.openapi+json",
        },
      ],
      "service-doc": [{ href: `${site.url}/agents`, type: "text/html" }],
    })),
    {
      anchor: "https://mcp.sanoraworks.com/",
      "service-doc": [{ href: `${site.url}/agents`, type: "text/html" }],
      "service-meta": [
        { href: "https://agents.sanoraworks.com/", type: "application/json" },
      ],
    },
  ],
};
const responseSchema = (ref: string) => ({
  description: "Published public information",
  content: {
    "application/json": { schema: { $ref: `#/components/schemas/${ref}` } },
  },
});
const string = { type: "string" };
const link = {
  type: "object",
  required: ["label", "href"],
  properties: { label: string, href: string },
};
export const openApi = {
  openapi: "3.1.0",
  info: {
    title: "SanoraWorks Public Information API",
    version: "1.0.0",
    description:
      "Read-only published website content. No authentication, submission, private files, or customer information.",
  },
  servers: [{ url: site.url }],
  paths: Object.fromEntries(
    ["site", "services", "projects", "pages"].map((name) => [
      `/api/public/${name}`,
      {
        get: {
          operationId: {
            site: "getSiteInfo",
            services: "listServices",
            projects: "listProjects",
            pages: "getPage",
          }[name],
          summary: `Read public ${name}`,
          ...(name === "pages"
            ? {
                parameters: [
                  {
                    name: "path",
                    in: "query",
                    required: true,
                    schema: {
                      type: "string",
                      enum: publicPages.map((p) => p.path),
                    },
                    description:
                      "Exact known public path, without query or fragment.",
                  },
                ],
              }
            : {}),
          responses: {
            "200": responseSchema(
              name === "pages"
                ? "Page"
                : name === "site"
                  ? "Site"
                  : name === "services"
                    ? "Services"
                    : "Projects",
            ),
            "400": { description: "Missing or invalid query parameters" },
            "404": { description: "Unknown public path" },
            "405": { description: "Read-only endpoint" },
          },
        },
      },
    ]),
  ),
  components: {
    schemas: {
      Page: {
        type: "object",
        required: [
          "path",
          "title",
          "description",
          "h1",
          "intro",
          "revised",
          "kind",
          "sections",
          "links",
          "url",
          "markdown",
        ],
        properties: {
          path: { type: "string", enum: publicPages.map((p) => p.path) },
          title: string,
          description: string,
          h1: string,
          intro: string,
          revised: { type: "string", format: "date" },
          kind: string,
          status: string,
          url: { type: "string", format: "uri" },
          markdown: string,
          sections: {
            type: "array",
            items: {
              type: "object",
              required: ["heading"],
              properties: {
                heading: string,
                paragraphs: { type: "array", items: string },
                items: { type: "array", items: string },
              },
            },
          },
          links: { type: "array", items: link },
          questions: {
            type: "array",
            items: {
              type: "object",
              required: ["question", "answer"],
              properties: { question: string, answer: string },
            },
          },
        },
      },
      Site: {
        type: "object",
        required: [
          "name",
          "url",
          "description",
          "pages",
          "services",
          "contentPreferences",
        ],
        properties: {
          name: string,
          url: string,
          description: string,
          email: { type: ["string", "null"] },
          services: { type: "array", items: link },
          pages: {
            type: "array",
            items: {
              type: "object",
              properties: { path: string, title: string, url: string },
            },
          },
          contentPreferences: {
            type: "object",
            properties: {
              search: { const: true },
              aiInput: { const: true },
              aiTrain: { const: false },
            },
          },
        },
      },
      Services: {
        type: "array",
        items: {
          type: "object",
          required: ["slug", "title", "description", "url", "page"],
          properties: {
            slug: string,
            title: string,
            description: string,
            url: string,
            page: {
              type: "object",
              description: "Public page copy, sections, links, and questions.",
            },
            capabilities: { type: "array", items: string },
            deliverables: { type: "array", items: string },
          },
        },
      },
      Projects: {
        type: "array",
        items: {
          type: "object",
          required: [
            "slug",
            "name",
            "status",
            "description",
            "url",
            "previewNotice",
          ],
          properties: {
            slug: string,
            name: string,
            status: { const: "In development" },
            description: string,
            url: string,
            previewNotice: string,
            serviceSlug: string,
            audience: { type: "array", items: string },
          },
        },
      },
    },
  },
};
export function publicPageResponse(path: string) {
  const page = getPublicPage(path);
  return page
    ? { ...page, url: `${site.url}${page.path}`, markdown: pageMarkdown(page) }
    : null;
}
export function finishPublicResponse(
  response: Response,
  request: Request,
  utility = false,
) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(securityHeaders))
    headers.set(key, value);
  headers.set("Content-Signal", contentSignal);
  if (utility) headers.set("X-Robots-Tag", "noindex");
  return new Response(request.method === "HEAD" ? null : response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
export function handlePublicUtility(request: Request): Response | null {
  const url = new URL(request.url);
  const path = url.pathname;
  const known =
    [
      "/robots.txt",
      "/llms.txt",
      "/openapi.json",
      "/.well-known/api-catalog",
      "/agents",
    ].includes(path) || path.startsWith("/api/public/");
  if (!known) return null;
  const respond = (body: unknown, status = 200, type = "application/json") =>
    finishPublicResponse(
      new Response(typeof body === "string" ? body : JSON.stringify(body), {
        status,
        headers: {
          "Content-Type": `${type}${type.startsWith("text/") ? "; charset=utf-8" : ""}`,
          "Cache-Control": "no-store",
          ...(status === 405 ? { Allow: "GET, HEAD" } : {}),
        },
      }),
      request,
      true,
    );
  if (request.method !== "GET" && request.method !== "HEAD")
    return respond({ error: "Read-only endpoint" }, 405);
  if (path.startsWith("/api/public/")) {
    if (path === "/api/public/pages") {
      if (
        url.searchParams.getAll("path").length !== 1 ||
        [...url.searchParams.keys()].some((k) => k !== "path")
      )
        return respond({ error: "Supply one exact public path" }, 400);
      const page = publicPageResponse(url.searchParams.get("path")!);
      return page
        ? respond(page)
        : respond({ error: "Unknown public path" }, 404);
    }
    if (url.search)
      return respond({ error: "Query parameters are not supported" }, 400);
    const data =
      path === "/api/public/site"
        ? publicSiteInfo()
        : path === "/api/public/services"
          ? publicServices()
          : path === "/api/public/projects"
            ? publicProjects()
            : null;
    return data
      ? respond(data)
      : respond({ error: "Unknown public endpoint" }, 404);
  }
  if (path === "/robots.txt")
    return respond(
      `User-agent: *\nContent-Signal: ${contentSignal}\nAllow: /\nDisallow: /api/enquiry\n\nSitemap: ${site.url}/sitemap.xml\n`,
      200,
      "text/plain",
    );
  if (path === "/openapi.json")
    return respond(openApi, 200, "application/vnd.oai.openapi+json");
  if (path === "/.well-known/api-catalog")
    return respond(
      apiCatalog,
      200,
      'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
    );
  const docs = `# SanoraWorks public interfaces\n\nSanoraWorks builds websites, software, workflow automation, and cloud deployments for businesses and startups.\n\nREST: GET /api/public/site, /api/public/services, /api/public/projects, /api/public/pages?path=/services. The path must exactly match a known public page.\n\nOpenAPI: ${site.url}/openapi.json\nCatalog: ${site.url}/.well-known/api-catalog\nMCP: https://mcp.sanoraworks.com/ (Streamable HTTP, stateless, no authentication). Tools: get_site_info, list_services, list_projects, get_page. Resources use canonical public page URLs.\nRegistry: https://agents.sanoraworks.com/\n\nMCP allows 60 requests per minute per connecting IP per Cloudflare location and bodies up to 64 KiB. Requests with an Origin must use https://sanoraworks.com, https://mcp.sanoraworks.com, or https://agents.sanoraworks.com. Non-browser clients may omit Origin. Responses are public read-only content. No enquiry submission, private files, customer information, or paid model calls.\n\nSend Accept: text/markdown on a public page to request Markdown. Explicit media-type quality values are respected; HTML wins an equal explicit tie when listed first. Navigation requests use HTML. Canonical URLs exclude query strings. Markdown responses are not cached.\n\nProjects are in development. Images are illustrative concepts, not available product screenshots.\n\nContent preferences: ${contentSignal}. These express usage preferences, not access controls. Discovery files do not guarantee rankings or AI citations. DNS-AID is an evolving draft; the JSON registry is an organization-owned format.\n\n## Public pages\n${publicPages.map((p) => `- [${p.title}](${site.url}${p.path})`).join("\n")}\n`;
  if (path === "/llms.txt") return respond(docs, 200, "text/plain");
  // Human documentation stays a utility endpoint outside the marketing sitemap.
  return respond(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Public interfaces | SanoraWorks</title><style>body{max-width:60rem;margin:3rem auto;padding:0 1rem;font:1rem/1.65 system-ui;color:#17243b}pre{white-space:pre-wrap;overflow-wrap:anywhere}a{color:#1746b4}</style></head><body><main><h1>SanoraWorks public interfaces</h1><p><a href="/openapi.json">OpenAPI</a> · <a href="/.well-known/api-catalog">API catalog</a> · <a href="https://agents.sanoraworks.com/">Agent registry</a> · <a href="/">Website</a></p><pre>${docs.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</pre></main></body></html>`,
    200,
    "text/html",
  );
}
