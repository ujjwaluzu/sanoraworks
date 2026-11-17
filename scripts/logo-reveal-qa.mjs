import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { logoRevealTracks, REVEAL_STILL } from "../src/lib/logo-reveal.ts";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "../artifacts/qa-tools/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const base = process.env.QA_BASE_URL || "http://localhost:3000";
const output = "artifacts/logo-reveal";
await mkdir(output, { recursive: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
const time = (stage) => stage.evaluate((el) => el.getAnimations({ subtree: true }).map((a) => a.currentTime));
try {
  await page.goto(`${base}/about`, { waitUntil: "networkidle" });
  const stage = page.locator("[data-logo-reveal]");
  await stage.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector("[data-logo-reveal]")?.dataset.playing === "true");
  const targets = await stage.locator("[data-reveal]").evaluateAll((els) => els.map((el) => el.dataset.reveal));
  assert.deepEqual(targets.sort(), logoRevealTracks.map(({ part }) => part).sort());
  const before = await time(stage);
  await page.waitForTimeout(150);
  assert.ok((await time(stage)).every((t, i) => t > before[i]));
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await stage.scrollIntoViewIfNeeded();
    for (const beat of [0, 1000, 2000, 3000, 4200, 5000, 7000, 11000, 11999]) {
      await stage.evaluate((el, beat) => el.getAnimations({ subtree: true }).forEach((a) => { a.pause(); a.currentTime = beat; }), beat);
      await stage.screenshot({ path: `${output}/${width}-${beat}.png` });
    }
    await stage.evaluate((el) => el.getAnimations({ subtree: true }).forEach((a) => { a.currentTime = 7000; }));
    await page.locator(".about-intro").screenshot({ path: `${output}/${width}-layout.png` });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange")); });
  const paused = await time(stage);
  await page.waitForTimeout(100);
  assert.deepEqual(await time(stage), paused);
  await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event("visibilitychange")); });
  await page.waitForTimeout(150);
  assert.equal(await stage.getAttribute("data-playing"), "true");
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await page.waitForFunction(() => document.querySelector("[data-logo-reveal]").dataset.playing === "false");
  const offscreen = await time(stage);
  await page.waitForTimeout(100);
  assert.deepEqual(await time(stage), offscreen);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await stage.scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  assert.ok((await time(stage)).every((t) => t === REVEAL_STILL));
  await stage.screenshot({ path: `${output}/reduced-motion.png` });
  const ids = await page.locator("[id]").evaluateAll((els) => els.map((el) => el.id));
  assert.equal(new Set(ids).size, ids.length);
  await page.evaluate(() => { window.__reveal = document.querySelector("[data-logo-reveal]").getAnimations({ subtree: true }); });
  await page.locator('.site-header .brand').click();
  await page.waitForURL(`${base}/`);
  await page.waitForFunction(() => window.__reveal.every((a) => a.playState === "idle"));
  const staticPage = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  await staticPage.goto(`${base}/about`, { waitUntil: "networkidle" });
  await staticPage.locator("[data-logo-reveal]").screenshot({ path: `${output}/no-js.png` });
  assert.equal(await staticPage.locator('[data-reveal="complete"]').evaluate((el) => getComputedStyle(el).opacity), "1");
  await staticPage.close();
  if (process.env.QA_MOTION_REVIEW === "1") {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, recordVideo: { dir: `${output}/video`, size: { width: 1280, height: 900 } } });
    const motionPage = await context.newPage();
    await motionPage.goto(`${base}/about`, { waitUntil: "networkidle" });
    const logo = motionPage.locator("[data-logo-reveal]");
    await logo.scrollIntoViewIfNeeded();
    await motionPage.waitForFunction(() => document.querySelector("[data-logo-reveal]").dataset.playing === "true");
    for (const rate of [1, .5]) {
      await logo.evaluate((el, rate) => el.getAnimations({ subtree: true }).forEach((a) => { a.pause(); a.currentTime = 0; a.playbackRate = rate; a.play(); }), rate);
      const start = Date.now();
      for (let second = 0; second <= 13; second++) {
        await motionPage.waitForTimeout(Math.max(0, start + second * 1000 / rate - Date.now()));
        await logo.screenshot({ path: `${output}/motion-${rate}-${second}.png`, animations: "allow" });
      }
      assert.ok((await time(logo)).every((t) => Math.abs(t - (Date.now() - start) * rate) < 600));
    }
    const video = motionPage.video();
    await context.close();
    await video.saveAs(`${output}/full-loop.webm`);
    console.log("Passed: complete normal/half-speed loops and seam; video and per-second snapshots saved.");
  }
  assert.deepEqual(errors, []);
  console.log("Passed: logo timeline targets, 320–1440px snapshots, no overflow, native playback, hidden/offscreen pause, reduced-motion still, unique SVG IDs, cleanup and no-JS artwork.");
} finally { await browser.close(); }
