import assert from "node:assert/strict";
import { test } from "node:test";
import { createEnquiryHandler } from "../src/lib/enquiry-handler.ts";
import type { ContactBindings, EnquiryEmail } from "../src/lib/enquiry-email.ts";

const valid = {
  name: "Alex Morgan", email: "alex@example.com", company: "Example Company",
  projectType: "Product Engineering", budget: "Not yet defined",
  description: "We want a dependable internal tool for our engineering team.", website: "",
  turnstileToken: "test-valid-token",
};
const request = (body: unknown = valid, headers: Record<string, string> = {}) => new Request("https://sanoraworks.com/api/enquiry", {
  method: "POST", headers: { "Content-Type": "application/json", Origin: "https://sanoraworks.com", "cf-connecting-ip": "192.0.2.1", ...headers },
  body: JSON.stringify(body),
});
function fixture() {
  const emails: EnquiryEmail[] = [];
  const keys: string[] = [];
  const verifications: RequestInit[] = [];
  const bindings: ContactBindings = {
    TURNSTILE_SECRET_KEY: "test-secret",
    ENQUIRY_EMAIL: { send: async (email) => { emails.push(email); return { messageId: "test-message-id" }; } },
    ENQUIRY_RATE_LIMIT: { limit: async ({ key }) => { keys.push(key); return { success: true }; } },
  };
  const fetcher: typeof fetch = async (_url, init) => {
    verifications.push(init!);
    return Response.json({ success: true, hostname: "sanoraworks.com", action: "contact_enquiry" });
  };
  return { bindings, emails, keys, verifications, post: createEnquiryHandler(async () => bindings, fetcher) };
}

test("sends to the fixed owner inbox with the visitor as Reply-To", async () => {
  const { post, emails, keys, verifications } = fixture();
  const response = await post(request({ ...valid, to: "attacker@example.com", from: "spoof@example.com" }));
  assert.equal(response.status, 202);
  assert.equal((await response.json()).message, "Your enquiry has been sent. We’ll review your message, reply with any questions, and agree on the next step.");
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(emails.length, 1);
  assert.equal(emails[0].to, "sanoraworks@gmail.com");
  assert.equal(emails[0].from.email, "enquiries@sanoraworks.com");
  assert.equal(emails[0].replyTo, valid.email);
  for (const value of [valid.name, valid.email, valid.company, valid.projectType, valid.budget, valid.description]) assert.ok(emails[0].text.includes(value));
  assert.match(keys[0], /^enquiry:[a-f0-9]{64}$/);
  assert.ok(!keys[0].includes("192.0.2.1"));
  assert.deepEqual(JSON.parse(String(verifications[0].body)), { secret: "test-secret", response: valid.turnstileToken });
  assert.ok(!JSON.stringify(emails).includes(valid.turnstileToken));
});
test("does not report success until the mail service accepts delivery", async () => {
  const { bindings, post } = fixture();
  let resolveSend!: (result: { messageId: string }) => void;
  bindings.ENQUIRY_EMAIL!.send = () => new Promise((resolve) => { resolveSend = resolve; });
  let completed = false;
  const response = post(request()).then((result) => { completed = true; return result; });
  while (!resolveSend) await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(completed, false);
  resolveSend({ messageId: "accepted-id" });
  assert.equal((await response).status, 202);
});
test("validates required fields and honeypot before sending or consuming a limit", async () => {
  for (const body of [{}, { ...valid, website: "https://spam.example" }, { ...valid, email: "a\r\nb@example.com" }]) {
    const { post, emails, keys, verifications } = fixture();
    assert.equal((await post(request(body))).status, 400);
    assert.equal(emails.length, 0);
    assert.equal(keys.length, 0);
    assert.equal(verifications.length, 0);
  }
});
test("rejects cross-site requests and unsupported content types", async () => {
  const { post, emails } = fixture();
  assert.equal((await post(request(valid, { Origin: "https://unrelated.example" }))).status, 403);
  assert.equal((await post(request(valid, { "Content-Type": "text/plain" }))).status, 415);
  assert.equal(emails.length, 0);
});
test("rejects malformed JSON and oversized streamed payloads", async () => {
  const { post, emails } = fixture();
  assert.equal((await post(new Request("https://sanoraworks.com/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{bad" }))).status, 400);
  assert.equal((await post(request({ ...valid, description: "x".repeat(40000) }))).status, 413);
  assert.equal(emails.length, 0);
});
test("blocks rapid submissions without invoking the mail service", async () => {
  const { bindings, post, emails, verifications } = fixture();
  bindings.ENQUIRY_RATE_LIMIT!.limit = async () => ({ success: false });
  const response = await post(request());
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "60");
  assert.equal(emails.length, 0);
  assert.equal(verifications.length, 0);
});
test("missing mail or rate-limit bindings fail without claiming success", async () => {
  for (const bindings of [null, {}, { ENQUIRY_EMAIL: fixture().bindings.ENQUIRY_EMAIL }]) {
    assert.equal((await createEnquiryHandler(async () => bindings)(request())).status, 503);
  }
});
test("provider errors return a safe message and preserve rate-limit feedback", async (t) => {
  t.mock.method(console, "error", () => {});
  for (const [code, status] of [["E_RATE_LIMIT_EXCEEDED", 429], ["E_DELIVERY_FAILED", 502]] as const) {
    const { bindings, post } = fixture();
    bindings.ENQUIRY_EMAIL!.send = async () => { throw Object.assign(new Error("Private provider diagnostic"), { code }); };
    const response = await post(request());
    assert.equal(response.status, status);
    const body = await response.text();
    assert.ok(!body.includes("Private provider diagnostic"));
    assert.ok(!body.includes(valid.description));
  }
});
test("missing Turnstile configuration fails closed after rate limiting", async () => {
  const { bindings, post, emails, keys, verifications } = fixture();
  delete bindings.TURNSTILE_SECRET_KEY;
  assert.equal((await post(request())).status, 503);
  assert.equal(keys.length, 1);
  assert.equal(verifications.length, 0);
  assert.equal(emails.length, 0);
});
test("provider diagnostics cannot leak a verification token through error codes", async (t) => {
  const logs: unknown[][] = [];
  t.mock.method(console, "error", (...args: unknown[]) => { logs.push(args); });
  const { bindings, post } = fixture();
  bindings.ENQUIRY_EMAIL!.send = async () => { throw Object.assign(new Error(valid.description), { code: valid.turnstileToken }); };
  assert.equal((await post(request())).status, 502);
  assert.deepEqual(logs, [["Enquiry delivery failed:", "UNKNOWN"]]);
});
