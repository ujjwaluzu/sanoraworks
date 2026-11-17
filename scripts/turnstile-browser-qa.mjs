import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.QA_BASE_URL || "http://localhost:3002";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname), "Browser QA must target a local server");
const testKey = "1x00000000000000000000AA";
assert.ok((await (await fetch(`${base}/contact`)).text()).includes(testKey), "Start the QA server with the official TURNSTILE_SITE_KEY=1x00000000000000000000AA");
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const report = { checks: [], errors: [] };
await mkdir("artifacts/turnstile", { recursive: true });
const scriptPattern = "https://challenges.cloudflare.com/turnstile/v0/api.js*";
const mockScript = `
window.__widgetStats = { renders: 0, removes: 0, executes: 0, resets: 0 };
window.__widgetMode = 'hold';
window.turnstile = {
 render(el, options) {
  window.__widgetStats.renders++;
  window.__widgetOptions = options;
  if (options.execution !== 'execute' || options.action !== 'contact_enquiry' || options['response-field'] !== false) throw new Error('Wrong widget configuration');
  const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Mock verification challenge';
  button.onclick = () => options.callback('mock-token-' + window.__widgetStats.executes);
  el.replaceChildren(button); window.__widgetContainer = el; return 'widget-id';
 },
 execute() { window.__widgetStats.executes++; if (window.__widgetMode !== 'hold') window.__widgetOptions[window.__widgetMode](); },
 reset() { window.__widgetStats.resets++; },
 remove() { window.__widgetStats.removes++; window.__widgetContainer.replaceChildren(); }
};`;

async function fill(page) {
  await page.getByLabel("Your name", { exact: false }).fill("Turnstile QA Person");
  await page.getByLabel("Email address", { exact: false }).fill("qa@example.com");
  await page.getByLabel("Project type", { exact: false }).selectOption("Product Engineering");
  await page.getByLabel("A little about your project", { exact: false }).fill("A local automated test of contact security and preserved enquiry fields.");
}
async function setup({ mock = true, blocked = false, width = 1440 } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 1000 } });
  const requests = [];
  let reply = { status: 503, body: { error: "Security verification is unavailable. Your details are still here; please try again." } };
  await context.route("**/api/enquiry", async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({ status: reply.status, json: reply.body });
  });
  if (blocked) await context.route(scriptPattern, (route) => route.abort());
  else if (mock) await context.route(scriptPattern, (route) => route.fulfill({ contentType: "application/javascript", body: mockScript }));
  const page = await context.newPage();
  page.on("pageerror", (error) => report.errors.push(error.message));
  await page.goto(`${base}/contact`);
  if (mock && !blocked) await page.waitForFunction(() => window.__widgetStats?.renders > 0);
  return { context, page, requests, setReply(value) { reply = value; } };
}

try {
  const qa = await setup();
  const { page, requests } = qa;
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(page.locator(".form-error-summary")).toBeFocused();
  assert.equal(await page.evaluate(() => window.__widgetStats.executes), 0);
  await fill(page);
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(page.getByRole("button", { name: "Checking…", exact: true })).toBeDisabled();
  await page.locator("form.enquiry-form").evaluate((form) => { form.requestSubmit(); form.requestSubmit(); });
  assert.equal(await page.evaluate(() => window.__widgetStats.executes), 1);
  await page.getByRole("button", { name: "Mock verification challenge" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".form-status")).toContainText("unavailable");
  await expect(page.getByLabel("Your name", { exact: false })).toHaveValue("Turnstile QA Person");
  await expect(page.locator(".form-status a")).toHaveAttribute("href", "mailto:enquiries@sanoraworks.com");
  assert.equal(requests.length, 1);
  qa.setReply({ status: 502, body: { error: "Email delivery failed. Your details are still here." } });
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await page.getByRole("button", { name: "Mock verification challenge" }).click();
  await expect(page.locator(".form-status")).toContainText("delivery failed");
  assert.equal(requests.length, 2);
  assert.notEqual(requests[0].turnstileToken, requests[1].turnstileToken);
  await expect(page.getByLabel("Your name", { exact: false })).toHaveValue("Turnstile QA Person");
  for (const callback of ["error-callback", "expired-callback", "timeout-callback", "unsupported-callback"]) {
    await page.evaluate((callback) => { window.__widgetMode = callback; }, callback);
    await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
    await expect(page.getByRole("button", { name: "Send enquiry", exact: true })).toBeEnabled();
    await expect(page.locator(".form-status")).toContainText("verification");
    await page.evaluate(() => window.__widgetOptions.callback("late-token"));
    assert.equal(requests.length, 2, "A late callback must not resend an enquiry");
  }
  await page.evaluate(() => { window.__widgetMode = "hold"; });
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await page.getByRole("navigation", { name: "Main navigation", exact: true }).filter({ visible: true }).getByRole("link", { name: "About", exact: true }).click();
  await page.waitForURL("**/about");
  await expect.poll(() => page.evaluate(() => window.__widgetStats.removes)).toBe(1);
  await page.getByRole("navigation", { name: "Main navigation", exact: true }).filter({ visible: true }).getByRole("link", { name: "Contact", exact: true }).click();
  await page.waitForURL("**/contact");
  await page.waitForFunction(() => window.__widgetStats.renders === 2);
  assert.equal(requests.length, 2);
  await fill(page);
  qa.setReply({ status: 202, body: { message: "Your enquiry has been sent." } });
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await page.getByRole("button", { name: "Mock verification challenge" }).click();
  await expect(page.locator(".form-status")).toContainText("has been sent");
  await expect(page.getByLabel("Your name", { exact: false })).toHaveValue("");
  report.checks.push("Validation before verification; keyboard completion; duplicate guard; preserved fields; fresh retries; provider/callback failures; late callback ignored; navigation cleanup and remount; success reset");
  await qa.context.close();

  const blocked = await setup({ blocked: true, width: 320 });
  await expect(blocked.page.locator(".form-verification")).toContainText("unavailable");
  await fill(blocked.page);
  await blocked.page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(blocked.page.locator(".form-status")).toContainText("unavailable");
  await expect(blocked.page.getByLabel("Your name", { exact: false })).toHaveValue("Turnstile QA Person");
  assert.equal(blocked.requests.length, 0);
  assert.ok(await blocked.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await blocked.page.screenshot({ path: "artifacts/turnstile/blocked-mobile.png", fullPage: true });
  report.checks.push("Blocked script fails closed and preserves entries at 320px");
  await blocked.context.close();

  for (const width of [320, 390, 1440]) {
    const real = await setup({ mock: false, width });
    real.setReply({ status: 202, body: { message: "Your enquiry has been sent." } });
    await fill(real.page);
    await real.page.waitForFunction(() => !!window.turnstile && document.querySelector(".form-verification > div")?.childElementCount > 0, { timeout: 30000 });
    await real.page.getByRole("button", { name: "Send enquiry", exact: true }).click();
    await expect(real.page.locator(".form-status")).toContainText("has been sent", { timeout: 30000 });
    assert.equal(real.requests.length, 1);
    assert.equal(real.requests[0].turnstileToken, "XXXX.DUMMY.TOKEN.XXXX");
    assert.ok(await real.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await real.page.screenshot({ path: `artifacts/turnstile/official-widget-${width}.png`, fullPage: true });
    const axe = await new AxeBuilder({ page: real.page }).include(".enquiry-form").analyze();
    assert.deepEqual(axe.violations.map((v) => v.id), []);
    report.checks.push(`Official passing test widget, intercepted submission, no horizontal overflow, axe accessibility: ${width}px`);
    await real.context.close();
  }
  assert.deepEqual(report.errors, []);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile("artifacts/turnstile/browser-report.json", JSON.stringify(report, null, 2));
  await browser.close();
}
