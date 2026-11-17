import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.QA_BASE_URL || "http://localhost:8787";
const pages = [
  "/",
  "/services",
  ...[
    "software-web-development",
    "product-engineering",
    "ai-intelligent-automation",
    "cloud-infrastructure",
  ].map((s) => `/services/${s}`),
  "/about",
  "/contact",
  "/work",
  ...["slotbreeze", "proofhuddle", "enquirywing", "uptimeperch"].map(
    (s) => `/work/${s}`,
  ),
  "/privacy",
  "/terms",
];
const browser = await chromium.launch({
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : {}),
});
const context = await browser.newContext({ reducedMotion: "reduce" });
await context.route("**/api/enquiry", (route) => route.abort());
await context.addInitScript(() => {
  window.__lab = { cls: 0, lcp: 0 };
  new PerformanceObserver((list) => {
    for (const e of list.getEntries())
      if (!e.hadRecentInput) window.__lab.cls += e.value;
  }).observe({ type: "layout-shift", buffered: true });
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) window.__lab.lcp = e.startTime;
  }).observe({ type: "largest-contentful-paint", buffered: true });
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const report = {
  base,
  caveat:
    "Local Chromium lab observations with reduced motion; no network/CPU throttling. These are not field Core Web Vitals or a Lighthouse score.",
  checks: [],
};
await mkdir("artifacts/seo", { recursive: true });
try {
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of pages) {
      const response = await page.goto(base + path, {
        waitUntil: "networkidle",
      });
      assert.equal(response.status(), 200, path);
      const measure = await page.evaluate(async () => {
        await document.fonts.ready;
        return {
          width: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          h1s: document.querySelectorAll("h1").length,
          ...window.__lab,
          images: [...document.images]
            .filter((i) => {
              const r = i.getBoundingClientRect();
              return (
                r.top < innerHeight &&
                r.bottom > 0 &&
                r.width > 0 &&
                r.height > 0
              );
            })
            .map((i) => ({
              src: i.currentSrc,
              width: i.width,
              height: i.height,
              complete: i.complete,
              naturalWidth: i.naturalWidth,
              alt: i.getAttribute("alt"),
            })),
        };
      });
      assert.ok(
        measure.scrollWidth <= width + 1,
        `${path} at ${width}: horizontal overflow ${measure.scrollWidth}`,
      );
      assert.equal(measure.h1s, 1, path);
      for (const img of measure.images) {
        assert.notEqual(img.alt, null, path);
        assert.ok(
          img.width > 0 && img.height > 0,
          `${path}: reserved image size`,
        );
        assert.ok(
          img.complete && img.naturalWidth > 0,
          `${path}: loaded above-fold image`,
        );
      }
      if (width === 375) {
        const axe = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        measure.accessibilityViolations = axe.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          targets: v.nodes.map((n) => n.target),
        }));
        assert.deepEqual(
          measure.accessibilityViolations,
          [],
          `${path}: accessibility`,
        );
        assert.ok(
          measure.cls <= 0.1,
          `${path}: layout stability ${measure.cls}`,
        );
      }
      report.checks.push({ path, viewport: width, ...measure });
      if (
        [375, 1440].includes(width) &&
        [
          "/",
          "/services/product-engineering",
          "/services/ai-intelligent-automation",
          "/contact",
        ].includes(path)
      )
        await page.screenshot({
          path: `artifacts/seo/${path.replaceAll("/", "_") || "home"}-${width}.png`,
          fullPage: true,
        });
    }
  }
  assert.deepEqual(errors, [], "Browser runtime errors");
  report.passed = true;
} finally {
  report.errors = errors;
  await writeFile(
    "artifacts/seo/browser-report.json",
    JSON.stringify(report, null, 2),
  );
  await browser.close();
}
console.log(
  `Passed ${report.checks.length} responsive page checks and mobile WCAG scans; report: artifacts/seo/browser-report.json`,
);
