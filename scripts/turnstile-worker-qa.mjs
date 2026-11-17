import assert from "node:assert/strict";

const base = process.env.QA_BASE_URL || "http://127.0.0.1:8787";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname), "Use a local Worker preview with official test keys");
const valid = { name: "Worker QA", email: "qa@example.com", company: "", projectType: "Product Engineering", budget: "", description: "Local Worker preview verification. This must never send an email.", website: "" };
async function post(extra = {}) {
  return fetch(`${base}/api/enquiry`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...valid, ...extra }) });
}
assert.equal((await post()).status, 400, "Missing token must fail closed");
assert.equal((await post({ turnstileToken: { malformed: true } })).status, 400, "Malformed token must fail closed");
assert.equal((await post({ turnstileToken: "XXXX.DUMMY.TOKEN.XXXX" })).status, 400, "Official test-secret response must fail strict production hostname/action checks");
let limited;
for (let i = 0; i < 6; i++) {
  const response = await post();
  if (response.status === 429) { limited = response; break; }
  assert.equal(response.status, 400);
}
assert.ok(limited, "Rate limiting must still reject repeated tokenless submissions");
assert.equal(limited.headers.get("retry-after"), "60");
console.log("Worker preview passed: missing/malformed tokens, strict dummy-token rejection, and IP rate limit; no deliverable token submitted.");
