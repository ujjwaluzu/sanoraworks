import fs from "node:fs/promises";
import { createRequire } from "node:module";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_PATH || process.argv[2] || "playwright",
);
const base = process.env.QA_BASE_URL || "http://localhost:3001";
const folder = new URL("../artifacts/screenshots/", import.meta.url);
await fs.mkdir(folder, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH || process.argv[3]
    ? { executablePath: process.env.CHROME_PATH || process.argv[3] }
    : {}),
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const routes = [
  "/",
  "/services",
  "/work",
  "/work/uzzutv",
  "/work/repoteam",
  "/work/crewlab",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/not-a-page",
];
const report = [];
try {
  for (const width of [375, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      const response = await page.goto(base + route, {
        waitUntil: "networkidle",
      });
      const measure = await page.evaluate(() => ({
        viewport: innerWidth,
        document: document.documentElement.scrollWidth,
        main: document.querySelector("main")?.getBoundingClientRect().width,
        columns: getComputedStyle(document.querySelector(".site-columns"))
          .gridTemplateColumns,
        horizontalOffenders: [...document.querySelectorAll("body *")]
          .filter((el) => {
            const box = el.getBoundingClientRect();
            return (
              box.width > 0 &&
              (box.left < -1 || box.right > innerWidth + 1) &&
              getComputedStyle(el).position !== "fixed"
            );
          })
          .slice(0, 8)
          .map((el) => el.tagName + "." + el.className),
      }));
      report.push({ route, width, status: response.status(), ...measure });
      const name = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
      await page.screenshot({
        path: new URL(`${name}-${width}.png`, folder).pathname.replace(
          /^\/(.:)/,
          "$1",
        ),
        fullPage: true,
      });
      assert.ok(
        measure.document <= width,
        `${route} at ${width}px overflows: ${JSON.stringify(measure)}`,
      );
      assert.equal(await page.locator("h1").count(), 1);
    }
  }
  // A 720px CSS viewport exercises desktop content at the effective width of
  // a 1440px display with 200% browser zoom. Also stress the 320px minimum.
  for (const width of [720, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: "networkidle" });
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      report.push({
        route,
        width,
        scrollWidth,
        check:
          width === 720 ? "200-percent-effective-width" : "narrow-overflow",
      });
      assert.ok(
        scrollWidth <= width,
        `${route} at ${width}px overflows: ${scrollWidth}`,
      );
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.screenshot({
    path: new URL("home-desktop-viewport.png", folder).pathname.replace(
      /^\/(.:)/,
      "$1",
    ),
  });
  assert.deepEqual(errors, []);
} finally {
  await fs.writeFile(
    new URL("../artifacts/visual-report.json", import.meta.url),
    JSON.stringify({ errors, pages: report }, null, 2),
  );
  await browser.close();
}
console.log(
  `Passed visual layout checks: ${report.length} route/viewport combinations; screenshots saved.`,
);
