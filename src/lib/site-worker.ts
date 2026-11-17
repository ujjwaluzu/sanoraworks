import { getPublicPage, pageMarkdown } from "../data/public-content.ts";
import {
  agentRegistry,
  discoveryLinks,
  finishPublicResponse,
  handlePublicUtility,
  mergeVary,
  prefersMarkdown,
} from "./public-http.ts";
import type { McpBindings } from "./public-mcp.ts";

export function createSiteWorker(openNext: {
  fetch(request: Request, env: McpBindings, ctx: unknown): Promise<Response>;
}) {
  return {
    async fetch(
      request: Request,
      env: McpBindings,
      ctx: unknown,
    ): Promise<Response> {
      const url = new URL(request.url);
      if (
        url.hostname === "www.sanoraworks.com" ||
        (url.protocol === "http:" &&
          [
            "sanoraworks.com",
            "mcp.sanoraworks.com",
            "agents.sanoraworks.com",
          ].includes(url.hostname))
      ) {
        url.protocol = "https:";
        if (url.hostname === "www.sanoraworks.com")
          url.hostname = "sanoraworks.com";
        return finishPublicResponse(Response.redirect(url.href, 308), request);
      }
      if (url.hostname === "mcp.sanoraworks.com") {
        // Public pages do not need to initialize the MCP SDK or its validators.
        const { handleMcp } = await import("./public-mcp.ts");
        return finishPublicResponse(
          await handleMcp(request, env),
          request,
          true,
        );
      }
      if (url.hostname === "agents.sanoraworks.com") {
        const response =
          url.pathname !== "/" || url.search
            ? new Response("Not found", { status: 404 })
            : !["GET", "HEAD"].includes(request.method)
              ? new Response("Read-only endpoint", {
                  status: 405,
                  headers: { Allow: "GET, HEAD" },
                })
              : Response.json(agentRegistry, {
                  headers: { "Cache-Control": "no-store" },
                });
        return finishPublicResponse(response, request, true);
      }
      const utility = handlePublicUtility(request);
      if (utility) return utility;
      const page = getPublicPage(url.pathname);
      const navigation =
        request.headers.get("rsc") === "1" ||
        request.headers.has("next-router-state-tree") ||
        request.headers.has("next-router-prefetch") ||
        request.headers.has("next-action");
      if (
        page &&
        ["GET", "HEAD"].includes(request.method) &&
        !navigation &&
        prefersMarkdown(request.headers.get("accept"))
      ) {
        const headers = new Headers({
          "Content-Type": "text/markdown; charset=utf-8",
          "Cache-Control": "no-store",
          Link: `${discoveryLinks}, <https://sanoraworks.com${page.path}>; rel="canonical"`,
        });
        mergeVary(headers, "Accept");
        return finishPublicResponse(
          new Response(pageMarkdown(page), { headers }),
          request,
        );
      }
      const response = await openNext.fetch(request, env, ctx);
      if (!page) return response;
      const headers = new Headers(response.headers);
      headers.append("Link", discoveryLinks);
      mergeVary(headers, "Accept");
      return finishPublicResponse(
        new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        }),
        request,
      );
    },
  };
}
