import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { beats, serviceAnimations, settledFrame } from "../src/lib/service-animation.ts";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "../artifacts/qa-tools/node_modules/playwright");
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const base = process.env.QA_BASE_URL || "http://localhost:3000";
const output = "artifacts/service-animation";
await mkdir(output, { recursive: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
const times = (figure) => figure.evaluate((el) => el.getAnimations({ subtree: true }).map((a) => Number(a.currentTime)));
const phases = [
  [0, 1500, beats.software.send, 4100, 6000, 7350, 7700, 8000, 8400, 10000, 13000, 14000, 14999],
  [0, 1200, 2500, 4000, 5500, 7000, 8000, 9000, 10000, 13000, 14000, 14999],
  [0, 1500, 3000, 4500, 6000, 7500, 9000, 10000, 11000, 13000, 14000, 14999],
  [0, 1500, 3000, 4500, 6000, 7000, 8000, 9000, 10000, 11000, 13000, 14000, 14999],
];
const seek = (figure, time) => figure.evaluate((el, time) => el.getAnimations({ subtree: true }).forEach((a) => { a.pause(); a.currentTime = time; }), time);
try {
  await page.goto(`${base}/services`, { waitUntil: "networkidle" });
  const figures = await page.locator("[data-service-explainer]").all();
  assert.equal(figures.length, 4);
  for (const [i, figure] of figures.entries()) {
    await figure.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    assert.equal(await figure.locator("button").count(), 0);
    assert.ok(await figure.locator("svg text").count() >= 2, "panels have useful labels");
    assert.ok(await figure.evaluate((el) => {
      const style = getComputedStyle(el);
      return style.backgroundImage === "none" && style.backgroundColor === "rgba(0, 0, 0, 0)" && style.borderTopWidth === "0px" && style.boxShadow === "none";
    }), "artwork has no surrounding background or frame");
    assert.equal(await figure.getAttribute("data-playing"), "true");
    const slug = await figure.getAttribute("data-service-explainer");
    const targets = await figure.locator("[data-motion]").evaluateAll((els) => els.map((el) => el.dataset.motion));
    assert.deepEqual([...targets].sort(), serviceAnimations[slug].map((track) => track.part).sort(), "every track has exactly one target, with no unused targets");
    assert.equal(await figure.locator("[data-motion][transform]").count(), 0, "motion and SVG layout transforms are separated");
    assert.equal(await figure.evaluate((el) => el.getAnimations({ subtree: true }).length), targets.length);
    assert.ok(await figure.evaluate((el) => el.getAnimations({ subtree: true }).every((a) => a.effect.getTiming().duration === 15000)));
    const before = await times(figure);
    await page.waitForTimeout(120);
    assert.ok((await times(figure)).every((t, j) => t > before[j]));
    // Inspect multiple phases using the browser's native animation timeline.
    for (const phase of phases[i]) {
      await seek(figure, phase);
      await figure.screenshot({ path: `${output}/desktop-${i}-${phase}.png` });
    }
    await figure.evaluate((el) => el.getAnimations({ subtree: true }).forEach((a) => a.play()));
    await page.evaluate(() => {
      Object.defineProperty(document, "hidden", { configurable: true, value: true });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    const held = await times(figure);
    await page.waitForTimeout(100);
    assert.deepEqual(await times(figure), held);
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event("visibilitychange")); });
    await page.waitForTimeout(100);
    assert.equal(await figure.getAttribute("data-playing"), "true");
  }
  assert.equal(await figures[0].getAttribute("data-playing"), "false");
  const offscreen = await times(figures[0]);
  await page.waitForTimeout(100);
  assert.deepEqual(await times(figures[0]), offscreen);
  const ids = await page.locator("[id]").evaluateAll((els) => els.map((e) => e.id));
  assert.equal(new Set(ids).size, ids.length);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 850 });
  for (const [i, figure] of figures.entries()) {
    await figure.scrollIntoViewIfNeeded();
    assert.equal(await figure.getAttribute("data-playing"), "false");
    const held = await times(figure);
    const slug = await figure.getAttribute("data-service-explainer");
    assert.ok(held.every((time) => time === settledFrame[slug]));
    await page.waitForTimeout(100);
    assert.deepEqual(await times(figure), held);
    await figure.screenshot({ path: `${output}/phone-${i}.png` });
    for (const phase of phases[i]) {
      await seek(figure, phase);
      await figure.screenshot({ path: `${output}/phone-${i}-${phase}.png` });
    }
  }
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // Retain references across a client-side unmount to verify effect cleanup.
  await page.evaluate(() => { window.__serviceAnimations = [...document.querySelectorAll("[data-service-explainer]")].flatMap((el) => el.getAnimations({ subtree: true })); });
  await page.locator('a[href="/"]').first().click();
  await page.waitForURL(base + "/");
  await page.waitForFunction(() => window.__serviceAnimations.every((a) => a.playState === "idle" && a.currentTime === null));
  assert.ok(await page.evaluate(() => window.__serviceAnimations.length > 0 && window.__serviceAnimations.every((a) => a.playState === "idle" && a.currentTime === null)), "unmount cancels every animation");
  assert.deepEqual(errors, []);
  const staticPage = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 1440, height: 1050 } });
  await staticPage.goto(`${base}/services`, { waitUntil: "networkidle" });
  for (const [i, figure] of (await staticPage.locator("[data-service-explainer]").all()).entries()) {
    await figure.scrollIntoViewIfNeeded();
    assert.ok(await figure.locator("svg title").textContent());
    await figure.screenshot({ path: `${output}/no-js-${i}.png` });
  }
  await staticPage.close();
  if (process.env.QA_MOTION_REVIEW === "1") {
    // Four independent pages exercise complete native loops at both review speeds.
    await Promise.all(figures.map(async (_, i) => {
      const context = await browser.newContext({ viewport: { width: 1100, height: 750 }, recordVideo: { dir: `${output}/video`, size: { width: 1100, height: 750 } } });
      const motionPage = await context.newPage();
      motionPage.on("pageerror", (error) => errors.push(error.message));
      await motionPage.goto(`${base}/services`, { waitUntil: "networkidle" });
      const figure = motionPage.locator("[data-service-explainer]").nth(i);
      await figure.scrollIntoViewIfNeeded();
      await motionPage.waitForTimeout(200);
      for (const rate of [1, .5]) {
        await figure.evaluate((el, rate) => el.getAnimations({ subtree: true }).forEach((animation) => {
          animation.pause(); animation.currentTime = 0; animation.playbackRate = rate; animation.play();
        }), rate);
        const start = Date.now();
        for (let second = 0; second <= 16; second++) {
          await motionPage.waitForTimeout(Math.max(0, start + second * 1000 / rate - Date.now()));
          await figure.screenshot({ path: `${output}/motion-${i}-${rate}-${second}.png`, animations: "allow" });
        }
        const elapsed = (Date.now() - start) * rate;
        assert.ok((await times(figure)).every((time) => Math.abs(time - elapsed) < 600), "independent playback follows the requested rate through the seam");
      }
      const video = motionPage.video();
      await context.close();
      await video.saveAs(`${output}/loop-${i}.webm`);
    }));
    assert.deepEqual(errors, []);
    console.log("Passed: all four complete loops at normal and half speed, including seams. Review videos and per-second frames saved.");
  }
  console.log("Passed: exact animation targets, separate layout transforms, 15s playback, principal desktop/phone beats, hidden/offscreen pause, scene-specific reduced motion, unmount cleanup, no-JS artwork, unique IDs and no console errors.");
} finally {
  await writeFile(`${output}/console-errors.json`, JSON.stringify(errors, null, 2));
  await browser.close();
}
