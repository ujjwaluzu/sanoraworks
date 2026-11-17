import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "../artifacts/qa-tools/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const base = process.env.QA_BASE_URL || "http://localhost:3000";
const output = "artifacts/navbar";
await mkdir(output, { recursive: true });
const errors = [];
const page = await browser.newPage();
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
const disclosure = page.locator(".mobile-navigation");
const toggle = disclosure.locator("summary");
const mobileLinks = disclosure.locator("nav a");
try {
  await page.goto(base, { waitUntil: "networkidle" });
  for (const width of [1440, 1024, 901, 900, 768, 480, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no overflow at ${width}px`);
    assert.equal(await page.locator(".primary-nav").isVisible(), width > 900);
    if (width <= 900) {
      assert.equal(await disclosure.getAttribute("open"), null);
      assert.equal(await mobileLinks.first().isVisible(), false);
      await toggle.click();
      assert.equal(await mobileLinks.count(), 5);
      for (const link of await mobileLinks.all()) {
        assert.ok(await link.isVisible());
        const rect = await link.boundingBox();
        assert.ok(rect.height >= 44 && rect.x >= 0 && rect.x + rect.width <= width);
      }
      await page.locator(".site-header").screenshot({ path: `${output}/${width}-open.png` });
      await page.keyboard.press("Escape");
      assert.equal(await disclosure.getAttribute("open"), null);
      assert.ok(await toggle.evaluate((el) => el === document.activeElement));
    }
    await page.locator(".site-header").screenshot({ path: `${output}/${width}.png` });
  }
  // Native summary activation and link focus work from the keyboard.
  await toggle.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  assert.ok(await mobileLinks.first().evaluate((el) => el === document.activeElement));
  await mobileLinks.filter({ hasText: "Services" }).click();
  await page.waitForURL(`${base}/services`);
  await page.waitForFunction(() => !document.querySelector(".mobile-navigation").open);
  await toggle.click();
  assert.equal(await disclosure.locator('[aria-current="page"]').textContent(), "Services");
  await page.locator("h1").click();
  assert.equal(await disclosure.getAttribute("open"), null);
  await toggle.click();
  await page.setViewportSize({ width: 1100, height: 900 });
  await page.waitForFunction(() => !document.querySelector(".mobile-navigation").open);
  await page.setViewportSize({ width: 390, height: 900 });
  assert.equal(await disclosure.getAttribute("open"), null);
  await page.goto(`${base}/work/slotbreeze`, { waitUntil: "networkidle" });
  await toggle.click();
  assert.equal(await disclosure.locator('[aria-current="page"]').textContent(), "Work");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.keyboard.press("Escape");
  await toggle.click();
  assert.ok(await mobileLinks.first().isVisible());
  const staticPage = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 320, height: 800 } });
  await staticPage.goto(base, { waitUntil: "networkidle" });
  await staticPage.locator(".mobile-navigation summary").click();
  assert.equal(await staticPage.locator(".mobile-nav-links a:visible").count(), 5);
  await staticPage.close();
  assert.deepEqual(errors, []);
  console.log("Passed: 320–1440px layouts, touch targets, keyboard activation, Escape/focus return, outside dismissal, navigation close, active nested routes, breakpoint reset, reduced motion and no-JS menu.");
} finally {
  await browser.close();
}
