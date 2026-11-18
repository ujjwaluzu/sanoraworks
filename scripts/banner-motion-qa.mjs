import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || process.argv[2] || "playwright");
const base = process.env.QA_BASE_URL || "http://localhost:3001";
const output = path.resolve("artifacts/banner-motion");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH || process.argv[3] ? { executablePath: process.env.CHROME_PATH || process.argv[3] } : {}),
});
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: "no-preference" });
const page = await context.newPage();
const banner = page.locator(".workshop-banner");
const report = { checks: [], pageErrors: [], visibilityFixture: "document.hidden override with a real visibilitychange event" };
context.on("page", (target) => target.on("pageerror", (error) => report.pageErrors.push(error.message)));
page.on("pageerror", (error) => report.pageErrors.push(error.message));
async function check(name, run) {
  try {
    await run();
    report.checks.push({ name, passed: true });
  } catch (error) {
    report.checks.push({ name, passed: false, error: error.message });
    throw error;
  }
}
const open = (target = page) => target.goto(base, { waitUntil: "networkidle" });
const running = (target = page) => target.waitForSelector('.workshop-banner[data-motion="true"][data-playing="true"]');
const times = () => banner.evaluate((el) => el.getAnimations({ subtree: true }).map((a) => a.currentTime));
async function frozen() {
  await page.waitForTimeout(60);
  const before = await times();
  assert.ok(before.length > 20);
  await page.waitForTimeout(150);
  assert.deepEqual(await times(), before);
  return before;
}
async function seek(time) {
  await banner.evaluate((el, time) => el.getAnimations({ subtree: true }).forEach((animation) => {
    animation.pause();
    animation.currentTime = time;
  }), time);
}
try {
  await check("Responsive illustrations and accessible banner heading", async () => {
    for (const width of [320, 375, 599, 600, 768, 800, 1024, 1050, 1100, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1100 });
      await open();
      await running();
      await seek(9500);
      const computer = await page.locator(".dns-computer").boundingBox();
      const logo = await page.locator(".banner-monogram").boundingBox();
      const copy = await page.locator(".workshop-banner-copy").boundingBox();
      assert.ok(computer.width > 0 && copy.width > 0);
      if (width < 600) {
        assert.equal(logo, null, "the existing phone layout hides the duplicate banner logo");
        assert.ok(computer.y >= copy.y + copy.height);
      } else {
        assert.ok(logo.width > 0);
        assert.ok(computer.x + computer.width <= logo.x);
        assert.ok(copy.x >= computer.x + computer.width);
        assert.ok(copy.x + copy.width <= logo.x);
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}`);
      assert.equal(await page.getByRole("heading", { level: 2, name: "Websites, products, automation, and the cloud.", exact: true }).count(), 1);
      assert.equal(await banner.locator("button, figcaption, .dns-figure-heading, .banner-illustration-label").count(), 0);
      assert.doesNotMatch(await banner.innerText(), /FIG\. 01|DNS, in motion|A name, not a number|Looking up|Ask the resolver|Name resolved|Ideas into orbit|Pause animations/);
      await banner.screenshot({ path: path.join(output, `banner-${width}.png`) });
    }
  });
  await check("Joined curves open to reveal SW; DNS packets and screen follow the same twelve-second model", async () => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await open();
    await running();
    const tracks = await banner.evaluate((el) => el.getAnimations({ subtree: true }).map((a) => a.effect.getTiming().duration));
    assert.ok(tracks.every((duration) => duration === 12000));
    assert.equal(await page.locator(".brand-image").evaluate((el) => el.getAnimations().length), 0);
    for (const cycle of [0, 12000]) {
      await seek(cycle);
      assert.equal(await page.locator('[data-orbit="letters"]').evaluate((el) => getComputedStyle(el).opacity), "0");
      assert.notEqual(await page.locator('[data-orbit="upper"]').evaluate((el) => getComputedStyle(el).transform), "matrix(1, 0, 0, 1, 0, 0)");
      await seek(cycle + 3000);
      assert.equal(await page.locator('[data-orbit="letters"]').evaluate((el) => getComputedStyle(el).opacity), "1");
      assert.equal(await page.locator('[data-orbit="upper"]').evaluate((el) => getComputedStyle(el).transform), "matrix(1, 0, 0, 1, 0, 0)");
      assert.equal(await page.locator('[data-dns-packet="2"]').evaluate((el) => getComputedStyle(el).opacity), "1");
      await seek(cycle + 9500);
      assert.equal(await page.locator('[data-orbit="letters"]').evaluate((el) => getComputedStyle(el).opacity), "1");
      assert.equal(await page.locator('[data-dns-screen="answer"]').evaluate((el) => getComputedStyle(el).opacity), "1");
      await seek(cycle + 11600);
      assert.ok(Number(await page.locator('[data-orbit="letters"]').evaluate((el) => getComputedStyle(el).opacity)) < 0.1);
    }
    for (const time of [0, 700, 1400, 2500, 4500, 7000, 9500, 11200, 12000]) {
      await seek(time);
      await banner.screenshot({ path: path.join(output, `phase-${time}.png`) });
    }
    // 4× review of the machine's physical detail and source-pixel logo masks.
    await seek(9500);
    await page.locator(".workshop-banner-copy, .banner-monogram").evaluateAll((elements) => elements.forEach((el) => { el.style.visibility = "hidden"; }));
    await page.locator(".dns-computer").evaluate((el) => { el.style.width = "800px"; });
    await page.locator(".dns-computer").screenshot({ path: path.join(output, "computer-closeup.png") });
    await page.locator(".dns-computer").evaluate((el) => { el.style.width = ""; });
    await page.locator(".banner-monogram").evaluate((el) => { el.style.visibility = "visible"; });
    await page.locator(".orbit-logo-art").evaluate((el) => { el.style.width = "437px"; });
    await page.locator(".orbit-logo-art").screenshot({ path: path.join(output, "logo-closeup.png") });
  });
  await check("Assembled animated layers exactly match the supplied PNG", async () => {
    await open();
    await running();
    await seek(5000);
    const art = page.locator(".orbit-logo-art");
    await art.evaluate((el) => {
      el.style.position = "fixed";
      el.style.left = "10px";
      el.style.top = "10px";
      el.style.width = "437px";
      el.style.background = "#e7ecf3";
      el.style.zIndex = "100";
    });
    const assembled = await sharp(await art.screenshot()).ensureAlpha().raw().toBuffer();
    await page.locator(".banner-logo-source").evaluate((el) => { el.style.visibility = "visible"; });
    await page.locator(".orbit-logo-layers").evaluate((el) => { el.style.display = "none"; });
    const original = await sharp(await art.screenshot()).ensureAlpha().raw().toBuffer();
    let differences = 0;
    for (let i = 0; i < assembled.length; i++) if (assembled[i] !== original[i]) differences++;
    assert.equal(differences, 0, "Original gradients, orbit, letterforms and proportions are unchanged at rest");
  });
  await check("Both illustrations run automatically and stay synchronized across a real loop", async () => {
    await open();
    await running();
    const before = await times();
    await page.waitForTimeout(200);
    const resumed = await times();
    assert.ok(resumed.every((time, i) => time > before[i] && time < before[i] + 400));
    await page.waitForTimeout(12100);
    const looped = await times();
    assert.ok(looped[0] > resumed[0] + 12000);
    assert.ok(Math.max(...looped) - Math.min(...looped) < 1);
  });
  await check("Offscreen and hidden-tab suspension retain position", async () => {
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    await page.waitForSelector('.workshop-banner[data-playing="false"]');
    const paused = await frozen();
    await banner.scrollIntoViewIfNeeded();
    await running();
    await page.waitForTimeout(100);
    assert.ok((await times()).every((time, i) => time > paused[i] && time < paused[i] + 500));
    await page.evaluate(() => {
      Object.defineProperty(document, "hidden", { configurable: true, value: true });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    assert.equal(await banner.getAttribute("data-playing"), "false");
    await frozen();
    await page.evaluate(() => {
      delete document.hidden;
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await running();
    await page.waitForTimeout(100);
    assert.ok((await times()).every((time, i) => time > paused[i]));
  });
  await check("Logo loading gates its own tracks while DNS playback stays independent", async () => {
    const delayed = await context.newPage();
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    await delayed.route("**/brand/sanoraworks-mark.webp", async (route) => { await gate; await route.continue(); });
    try {
      await delayed.goto(base, { waitUntil: "domcontentloaded" });
      await delayed.waitForTimeout(200);
      assert.notEqual(await delayed.locator(".workshop-banner").getAttribute("data-logo-motion"), "true");
      assert.equal(await delayed.locator(".workshop-banner").getAttribute("data-playing"), "true");
      await delayed.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
      await delayed.waitForTimeout(100);
      release();
      await delayed.waitForLoadState("networkidle");
      assert.notEqual(await delayed.locator(".workshop-banner").getAttribute("data-logo-motion"), "true");
      await delayed.locator(".workshop-banner").scrollIntoViewIfNeeded();
      await running(delayed);
      await delayed.waitForSelector('.workshop-banner[data-logo-motion="true"]');
    } finally { release(); await delayed.close(); }
  });
  await check("Reduced motion, live preference changes and no JavaScript show completed static artwork", async () => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open();
    const noJs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 375, height: 1000 } });
    try {
      await open(noJs);
      for (const target of [page, noJs]) {
        assert.equal(await target.locator(".workshop-banner").evaluate((el) => el.getAnimations({ subtree: true }).length), 0);
        assert.equal(await target.locator(".banner-motion-toggle").count(), 0);
        assert.equal(await target.locator(".banner-logo-source").isVisible(), target === page);
        assert.equal(await target.locator('[data-dns-screen="answer"]').evaluate((el) => getComputedStyle(el).opacity), "1");
        await target.locator(".workshop-banner").screenshot({ path: path.join(output, target === page ? "reduced-motion.png" : "no-javascript.png") });
      }
    } finally { await noJs.close(); }
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await running();
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(await banner.evaluate((el) => el.getAnimations({ subtree: true }).length), 0);
  });
  assert.deepEqual(report.pageErrors, []);
} catch (error) {
  process.exitCode = 1;
  console.error(error);
  await page.screenshot({ path: path.join(output, "failure.png"), fullPage: true });
} finally {
  await writeFile(path.join(output, "report.json"), JSON.stringify(report, null, 2));
  await browser.close();
  console.log(`${report.checks.filter((check) => check.passed).length}/${report.checks.length} banner checks passed. Report: ${path.join(output, "report.json")}`);
}
