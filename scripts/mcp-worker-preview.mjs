import assert from "node:assert/strict";
import https from "node:https";
// Only the loopback Wrangler test certificate is accepted here. Never used for production.
function request(body, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      "https://127.0.0.1:8788/",
      {
        method: "POST",
        rejectUnauthorized: false,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
          ...headers,
        },
      },
      (r) => {
        let text = "";
        r.on("data", (c) => (text += c));
        r.on("end", () =>
          resolve({ status: r.statusCode, headers: r.headers, text }),
        );
      },
    );
    req.on("error", reject);
    req.end(body);
  });
}
let id = 0;
async function rpc(method, params = {}) {
  const response = await request(
    JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }),
  );
  assert.equal(response.status, 200, response.text);
  const data = response.text.startsWith("{")
    ? JSON.parse(response.text)
    : JSON.parse(
        response.text
          .split("\n")
          .find((l) => l.startsWith("data:"))
          .slice(5),
      );
  return data;
}
const init = await rpc("initialize", {
  protocolVersion: "2025-11-25",
  capabilities: {},
  clientInfo: { name: "worker-preview", version: "1" },
});
assert.equal(init.result.serverInfo.name, "sanoraworks-public");
const tools = await rpc("tools/list");
assert.equal(tools.result.tools.length, 4);
for (const tool of tools.result.tools) {
  const data = await rpc("tools/call", {
    name: tool.name,
    arguments:
      tool.name === "get_page" ? { path: "/services/product-engineering" } : {},
  });
  assert.ok(data.result && !data.result.isError, JSON.stringify(data));
}
const resources = await rpc("resources/list");
assert.equal(resources.result.resources.length, 15);
for (const resource of resources.result.resources) {
  const data = await rpc("resources/read", { uri: resource.uri });
  assert.equal(data.result.contents[0].uri, resource.uri);
}
const bad = await rpc("tools/call", {
  name: "get_page",
  arguments: { path: "/private.pdf" },
});
assert.ok(bad.error || bad.result.isError);
assert.equal(
  (await request("{}", { Origin: "https://evil.example" })).status,
  403,
);
assert.equal((await request("x".repeat(65537))).status, 413);
let limited;
for (let i = 0; i < 61; i++) {
  const response = await request(
    JSON.stringify({
      jsonrpc: "2.0",
      id: ++id,
      method: "tools/list",
      params: {},
    }),
  );
  if (response.status === 429) {
    limited = response;
    break;
  }
}
assert.ok(limited, "Worker rate-limit binding should return 429");
assert.equal(limited.headers["retry-after"], "60");
console.log(
  "PASS: workerd MCP initialization, four tool calls, fifteen resource reads, private path/origin/body rejection and real 60/minute binding enforcement.",
);
