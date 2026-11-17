import assert from "node:assert/strict";
import { test } from "node:test";
import { verifyTurnstile } from "../src/lib/turnstile.ts";
import { createEnquiryHandler } from "../src/lib/enquiry-handler.ts";
import type { ContactBindings } from "../src/lib/enquiry-email.ts";

const valid = { name: "QA Person", email: "qa@example.com", company: "Private company", projectType: "Product Engineering", budget: "", description: "A private project description long enough to validate.", website: "", turnstileToken: "XXXX.DUMMY.TOKEN.XXXX" };
const request = (turnstileToken: unknown = valid.turnstileToken) => new Request("https://sanoraworks.com/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...valid, turnstileToken }) });

test("missing and malformed tokens never reach Siteverify or email", async () => {
  for (const token of [undefined, null, {}, 123, "", "has spaces", "x".repeat(2049)]) {
    let fetched = false;
    let sent = false;
    const post = createEnquiryHandler(async () => ({ TURNSTILE_SECRET_KEY: "secret", ENQUIRY_RATE_LIMIT: { limit: async () => ({ success: true }) }, ENQUIRY_EMAIL: { send: async () => { sent = true; return { messageId: "id" }; } } }), async () => { fetched = true; return Response.json({ success: true }); });
    // Pass undefined explicitly without the helper's default argument.
    const req = new Request(request().url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...valid, turnstileToken: token }) });
    assert.equal((await post(req)).status, 400);
    assert.equal(fetched, false);
    assert.equal(sent, false);
  }
});

test("rejected, expired, reused, mismatched and unavailable verifications never send email", async () => {
  const cases = [
    [{ success: false, "error-codes": ["invalid-input-response"] }, 400],
    [{ success: false, "error-codes": ["timeout-or-duplicate"] }, 400],
    [{ success: true, hostname: "www.sanoraworks.com", action: "contact_enquiry" }, 400],
    [{ success: true, hostname: "evil.example", action: "contact_enquiry" }, 400],
    [{ success: true, hostname: "sanoraworks.com", action: "other" }, 400],
    [{ success: true, hostname: "sanoraworks.com" }, 400],
    [{ success: "true" }, 503],
    [null, 503],
    [{ success: false, "error-codes": ["invalid-input-secret"] }, 503],
    [{ success: false, "error-codes": ["internal-error"] }, 503],
  ] as const;
  for (const [body, status] of cases) {
    let sent = false;
    const bindings: ContactBindings = { TURNSTILE_SECRET_KEY: "secret", ENQUIRY_RATE_LIMIT: { limit: async () => ({ success: true }) }, ENQUIRY_EMAIL: { send: async () => { sent = true; return { messageId: "id" }; } } };
    const post = createEnquiryHandler(async () => bindings, async () => Response.json(body));
    assert.equal((await post(request())).status, status, JSON.stringify(body));
    assert.equal(sent, false);
  }
});

test("Siteverify network, HTTP and JSON failures fail closed", async () => {
  const fetchers: typeof fetch[] = [async () => { throw new Error(valid.turnstileToken); }, async () => new Response("offline", { status: 503 }), async () => new Response("invalid json")];
  for (const fetcher of fetchers) assert.equal(await verifyTurnstile(valid.turnstileToken, "secret", fetcher), "unavailable");
  assert.equal(await verifyTurnstile(valid.turnstileToken, undefined, async () => { throw new Error("must not fetch"); }), "unavailable");
});

test("Siteverify times out after five seconds", async () => {
  const started = Date.now();
  const fetcher: typeof fetch = async (_url, init) => new Promise((_resolve, reject) => {
    init!.signal!.addEventListener("abort", () => reject(init!.signal!.reason));
  });
  // Keep the event loop live while AbortSignal.timeout's unref'ed timer runs.
  const keepAlive = setInterval(() => {}, 1000);
  try {
    assert.equal(await verifyTurnstile(valid.turnstileToken, "secret", fetcher), "unavailable");
    assert.ok(Date.now() - started >= 4900);
    assert.ok(Date.now() - started < 6500);
  } finally { clearInterval(keepAlive); }
});

test("the five-second deadline also covers a stalled Siteverify response body", async () => {
  const fetcher: typeof fetch = async (_url, init) => new Response(new ReadableStream({
    start(controller) { init!.signal!.addEventListener("abort", () => controller.error(init!.signal!.reason)); },
  }));
  const keepAlive = setInterval(() => {}, 1000);
  try { assert.equal(await verifyTurnstile(valid.turnstileToken, "secret", fetcher), "unavailable"); }
  finally { clearInterval(keepAlive); }
});

test("a spent token is rejected and email failure requires a fresh user submission", async () => {
  let verified = 0;
  let sent = 0;
  const bindings: ContactBindings = { TURNSTILE_SECRET_KEY: "secret", ENQUIRY_RATE_LIMIT: { limit: async () => ({ success: true }) }, ENQUIRY_EMAIL: { send: async () => { sent++; return { messageId: "" }; } } };
  const post = createEnquiryHandler(async () => bindings, async () => Response.json(++verified === 1 ? { success: true, hostname: "sanoraworks.com", action: "contact_enquiry" } : { success: false, "error-codes": ["timeout-or-duplicate"] }));
  assert.equal((await post(request())).status, 502);
  assert.equal((await post(request())).status, 400);
  assert.equal(sent, 1);
});
