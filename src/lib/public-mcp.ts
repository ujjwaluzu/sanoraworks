import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import { CfWorkerJsonSchemaValidator } from "@modelcontextprotocol/server/validators/cf-worker";
import { z } from "zod/v4";
import {
  pageMarkdown,
  publicPages,
  publicProjects,
  publicServices,
  publicSiteInfo,
} from "../data/public-content.ts";
import { publicPageResponse } from "./public-http.ts";
import { site } from "../data/site.ts";

const annotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};
const result = (data: object) => ({
  content: [{ type: "text" as const, text: JSON.stringify(data) }],
});
export function createPublicMcpServer() {
  const server = new McpServer(
    { name: "sanoraworks-public", version: "1.0.0" },
    { jsonSchemaValidator: new CfWorkerJsonSchemaValidator() },
  );
  server.registerTool(
    "get_site_info",
    {
      description:
        "Read published SanoraWorks company and website information.",
      inputSchema: z.object({}).strict(),
      annotations,
    },
    async () => result(publicSiteInfo()),
  );
  server.registerTool(
    "list_services",
    {
      description: "Read the four published services and their scope.",
      inputSchema: z.object({}).strict(),
      annotations,
    },
    async () => result({ services: publicServices() }),
  );
  server.registerTool(
    "list_projects",
    {
      description:
        "Read project concepts. All are in development, not purchasable software.",
      inputSchema: z.object({}).strict(),
      annotations,
    },
    async () => result({ projects: publicProjects() }),
  );
  server.registerTool(
    "get_page",
    {
      description:
        "Read one known public marketing or legal page by exact path. Private paths and query strings are rejected.",
      inputSchema: z
        .object({
          path: z.enum(publicPages.map((p) => p.path) as [string, ...string[]]),
        })
        .strict(),
      annotations,
    },
    async ({ path }) => {
      const page = publicPageResponse(path);
      return page
        ? result(page)
        : {
            isError: true,
            content: [{ type: "text" as const, text: "Unknown public path" }],
          };
    },
  );
  for (const page of publicPages) {
    const uri = `${site.url}${page.path}`;
    server.registerResource(
      page.title,
      uri,
      { description: page.description, mimeType: "text/markdown" },
      async () => ({
        contents: [
          { uri, mimeType: "text/markdown", text: pageMarkdown(page) },
        ],
      }),
    );
  }
  return server;
}
// Fresh server per request; the official handler also provides stateless legacy interoperability.
export const publicMcpHandler = createMcpHandler(createPublicMcpServer, {
  maxRequestBodySize: 65_536,
});
export type McpBindings = {
  MCP_RATE_LIMIT?: {
    limit(input: { key: string }): Promise<{ success: boolean }>;
  };
};
export async function handleMcp(
  request: Request,
  env: McpBindings,
): Promise<Response> {
  const url = new URL(request.url);
  const allowedOrigins = [
    "https://sanoraworks.com",
    "https://mcp.sanoraworks.com",
    "https://agents.sanoraworks.com",
  ];
  const origin = request.headers.get("origin");
  if (
    url.hostname !== "mcp.sanoraworks.com" ||
    (request.headers.get("host") &&
      request.headers.get("host") !== "mcp.sanoraworks.com") ||
    (origin && !allowedOrigins.includes(origin))
  )
    return new Response("Forbidden host or origin", { status: 403 });
  if (url.pathname !== "/" || url.search)
    return new Response("Not found", { status: 404 });
  if (!env.MCP_RATE_LIMIT)
    return new Response("Rate limiter unavailable", { status: 503 });
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(
      request.headers.get("cf-connecting-ip") || "local",
    ),
  );
  const key = `mcp:${Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("")}`;
  if (!(await env.MCP_RATE_LIMIT.limit({ key })).success)
    return new Response("Too many requests", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  // Bound bytes before the SDK, including legacy traffic and chunked bodies.
  let nextRequest = request;
  if (request.body) {
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 65_536) {
          await reader.cancel();
          return new Response("Request too large", { status: 413 });
        }
        chunks.push(value);
      }
    } catch {
      return new Response("Invalid request body", { status: 400 });
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    nextRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: bytes,
    });
  }
  if (request.method === "HEAD")
    return new Response(null, {
      status: 405,
      headers: { Allow: "GET, POST, DELETE" },
    });
  return publicMcpHandler.fetch(nextRequest);
}
