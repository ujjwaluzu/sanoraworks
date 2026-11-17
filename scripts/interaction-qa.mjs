import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

// Optional browser QA: use an already installed Playwright and Chrome.
// Usage: node scripts/interaction-qa.mjs <installed-playwright-path> <chrome-executable>
const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_PATH || process.argv[2] || "playwright",
);
const base = process.env.QA_BASE_URL || "http://localhost:3001";
const output = path.resolve("artifacts/redesign");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH || process.argv[3]
    ? { executablePath: process.env.CHROME_PATH || process.argv[3] }
    : {}),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  acceptDownloads: true,
});
// Any unexpected submission is blocked, including when an earlier assertion fails.
await context.route("**/api/enquiry", (route) => route.abort());
const page = await context.newPage();
const report = {
  base,
  checks: [],
  pageErrors: [],
  limits: ["Email responses are intercepted in the browser. No real enquiry is sent."],
};
page.on("pageerror", (error) => report.pageErrors.push(error.message));
async function check(name, run) {
  const start = Date.now();
  try {
    await run();
    report.checks.push({ name, passed: true, durationMs: Date.now() - start });
  } catch (error) {
    report.checks.push({ name, passed: false, error: error.message });
    throw error;
  }
}
async function fillBrief(target) {
  await target
    .getByLabel("Your name", { exact: false })
    .fill("Local QA Person");
  await target
    .getByLabel("Email address", { exact: false })
    .fill("qa@example.com");
  await target.getByLabel("Company", { exact: false }).fill("Local QA");
  await target
    .getByLabel("Project type", { exact: false })
    .selectOption({ label: "Product Engineering" });
  await target
    .getByLabel("A little about your project", { exact: false })
    .fill(
      "A local browser verification of the redesigned engineering website enquiry form.",
    );
}
try {
  await check("Homepage has five sections and clear actions", async () => {
    await page.goto(base, { waitUntil: "load" });
    assert.equal(await page.locator("main > section").count(), 5);
    assert.equal(await page.locator("h1").textContent(), "Web development and AI automation for businesses and startups");
    const actions = page.locator(".hero-actions");
    await actions.getByRole("link", { name: "Tell us what you need", exact: true }).click();
    await page.waitForURL("**/contact#contact-title");
    assert.ok(await page.locator("#contact-title").isVisible());
    await page.goto(base, { waitUntil: "load" });
    await actions.getByRole("link", { name: "See our projects", exact: true }).click();
    await page.waitForURL("**/work");
  });
  await check("Homepage shortcuts reach the requested section", async () => {
    for (const [name, id] of [
      ["Services", "capabilities"],
      ["Projects", "projects"],
      ["Our process", "process"],
    ]) {
      await page.goto(base, { waitUntil: "load" });
      await page
        .getByRole("navigation", { name: "On this page", exact: true })
        .getByRole("link", { name, exact: true })
        .click();
      await page.waitForURL(`**/#${id}`);
      await page.waitForFunction(
        (id) => {
          const top = document.getElementById(id).getBoundingClientRect().top;
          const atEnd = scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
          return top >= 0 && (top < 100 || (atEnd && top < innerHeight));
        },
        id,
      );
    }
  });
  await check("Primary navigation and current page", async () => {
    await page.goto(base, { waitUntil: "load" });
    await page
      .getByRole("navigation", { name: "Main navigation", exact: true })
      .getByRole("link", { name: /Services/ })
      .click();
    await page.waitForURL("**/services");
    assert.equal(
      await page.locator(".primary-nav a[aria-current=page]").textContent(),
      "Services",
    );
    assert.equal(
      await page.locator("h1").textContent(),
      "Software development and automation services",
    );
  });
  await check("Service category anchor and enquiry preselection", async () => {
    await page
      .getByRole("navigation", { name: "Explore service categories" })
      .getByRole("link", { name: /Product engineering/ })
      .click();
    await page.waitForURL("**/services#product-engineering");
    assert.ok(await page.locator("#product-engineering").isVisible());
    await page
      .locator("#product-engineering")
      .getByRole("link", { name: /Tell us what you need for product engineering/ })
      .click();
    await page.waitForURL("**/contact?service=product-engineering");
    assert.equal(
      await page.locator("#projectType").inputValue(),
      "Product Engineering",
    );
  });
  await check("Every service preselects its existing form option", async () => {
    for (const [slug, title] of [
      ["software-web-development", "Software & Web Development"],
      ["product-engineering", "Product Engineering"],
      ["ai-intelligent-automation", "AI & Intelligent Automation"],
      ["cloud-infrastructure", "Cloud & Infrastructure"],
    ]) {
      await page.goto(`${base}/services#${slug}`, { waitUntil: "load" });
      const section = page.locator(`#${slug}`);
      await section.locator(".service-project-link").click();
      await page.waitForURL(`**/contact?service=${slug}`);
      assert.equal(await page.locator("#projectType").inputValue(), title);
    }
    await page.goto(`${base}/contact?service=product-engineering`, { waitUntil: "load" });
  });
  await check("Required validation and error summary focus", async () => {
    await page
      .getByRole("button", { name: "Send enquiry", exact: true })
      .click();
    await page.locator(".form-error-summary").waitFor();
    assert.ok(
      await page
        .locator(".form-error-summary")
        .evaluate((el) => el === document.activeElement),
    );
    assert.equal(await page.locator('[aria-invalid="true"]').count(), 3);
    await page
      .locator(".form-error-summary")
      .getByRole("link", { name: /Enter your name/ })
      .click();
    assert.ok(
      await page
        .locator("#name")
        .evaluate((el) => el === document.activeElement),
    );
  });
  await check(
    "Corrected errors clear and description guidance stays available",
    async () => {
      await page.locator("#name").fill("Local QA Person");
      assert.equal(
        await page.locator("#name").getAttribute("aria-invalid"),
        null,
      );
      const description = page.locator("#description");
      await description.fill("Short text");
      assert.equal(await description.getAttribute("aria-invalid"), "true");
      const invalidReferences = (
        await description.getAttribute("aria-describedby")
      ).split(" ");
      for (const id of [
        "description-hint",
        "description-count",
        "description-error",
      ]) {
        assert.ok(invalidReferences.includes(id));
        assert.equal(await page.locator(`#${id}`).count(), 1);
      }
      assert.equal(
        await page.locator("#description-count").textContent(),
        "10 / 5,000 characters",
      );
      await description.fill(
        "A clear project description with enough detail to start a useful conversation.",
      );
      assert.equal(await description.getAttribute("aria-invalid"), null);
      assert.equal(await page.locator("#description-error").count(), 0);
      assert.ok(
        (await description.getAttribute("aria-describedby")).includes(
          "description-hint",
        ),
      );
    },
  );
  await check("Successful email submission confirms delivery and resets fields", async () => {
    await page.route("**/api/enquiry", async (route) => {
      const payload = route.request().postDataJSON();
      assert.equal(payload.email, "qa@example.com");
      await route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify({ message: "Your enquiry has been sent. We’ll review your message, reply with any questions, and agree on the next step." }) });
    });
    await fillBrief(page);
    assert.equal(await page.getByRole("button", { name: /download/i }).count(), 0);
    await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Your enquiry has been sent" }).waitFor();
    assert.equal(await page.locator("#name").inputValue(), "");
    assert.equal(await page.locator("#description").inputValue(), "");
    assert.equal(await page.locator("#description-count").textContent(), "0 / 5,000 characters");
    assert.match(await page.locator(".status-success").textContent(), /We’ll review your message, reply with any questions, and agree on the next step\./);
    await page.unroute("**/api/enquiry");
  });
  await check("Expandable FAQs support pointer and keyboard", async () => {
    await page.goto(`${base}/services`, { waitUntil: "load" });
    const faq = page.locator("details.faq").first();
    await faq.locator("summary").click();
    assert.equal(await faq.getAttribute("open"), "");
    await faq.locator("summary").focus();
    await page.keyboard.press("Enter");
    assert.equal(await faq.getAttribute("open"), null);
  });
  await check(
    "Project filters update entries, pressed state and result count",
    async () => {
      await page.goto(`${base}/work`, { waitUntil: "load" });
      assert.equal(await page.locator(".project-card").count(), 4);
      for (const card of await page.locator(".project-card").all()) {
        assert.equal(
          await card.getByRole("link").count(),
          1,
          "One keyboard stop opens each project",
        );
      }
      for (const [category, project] of [
        ["Booking & scheduling", "SlotBreeze"],
        ["Feedback & approvals", "ProofHuddle"],
        ["AI & enquiry automation", "EnquiryWing"],
        ["Monitoring & cloud operations", "UptimePerch"],
      ]) {
        const button = page.getByRole("button", {
          name: category,
          exact: true,
        });
        await button.click();
        assert.equal(await button.getAttribute("aria-pressed"), "true");
        assert.equal(await page.locator(".project-card").count(), 1);
        assert.equal(
          await page.locator(".project-card h3").textContent(),
          project,
        );
        assert.equal(
          await page.locator(".work-count").textContent(),
          "1 project",
        );
      }
      await page
        .getByRole("button", { name: "All projects", exact: true })
        .click();
      assert.equal(await page.locator(".project-card").count(), 4);
      assert.equal(
        await page.locator(".work-count").textContent(),
        "4 projects",
      );
      await page
        .getByRole("link", { name: "SlotBreeze", exact: true })
        .last()
        .click();
      await page.waitForURL("**/work/slotbreeze");
      assert.equal(
        await page
          .getByRole("navigation", { name: "Breadcrumb", exact: true })
          .locator('[aria-current="page"]')
          .textContent(),
        "SlotBreeze",
      );
    },
  );
  await check("Project previews sit beside text on desktop and stack on mobile", async () => {
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${base}/work`, { waitUntil: "load" });
      for (const card of await page.locator(".project-card").all()) {
        const preview = await card.locator(".project-visual-link").boundingBox();
        const text = await card.locator(".project-card-info").boundingBox();
        if (width < 600) assert.ok(text.y >= preview.y + preview.height, `stacked at ${width}px`);
        else assert.ok(text.x >= preview.x + preview.width, `side by side at ${width}px`);
        assert.equal(await card.locator(".preview-disclaimer").textContent(), "Illustrative interface concept.");
      }
    }
  });
  await check("Mobile navigation keeps all links usable", async () => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(base, { waitUntil: "load" });
    await page.locator(".mobile-navigation summary").click();
    const nav = page.locator(".mobile-nav-links");
    assert.equal(await nav.getByRole("link").count(), 5);
    for (const link of await nav.getByRole("link").all()) {
      assert.ok(await link.isVisible());
      assert.ok((await link.boundingBox()).height >= 44);
    }
    await nav.getByRole("link", { name: /Contact/ }).click();
    await page.waitForURL("**/contact");
  });
  await check("Back to top works from the keyboard and returns focus", async () => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(base, { waitUntil: "load" });
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    const topButton = page.getByRole("button", { name: "Back to top", exact: true });
    await topButton.waitFor();
    await topButton.focus();
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => scrollY === 0);
    assert.ok(await page.locator(".site-header .brand").evaluate((el) => el === document.activeElement));
    await page.emulateMedia({ reducedMotion: "no-preference" });
  });
  await check(
    "Delivery failure retains fields and supports retry (browser fixture)",
    async () => {
      const failureContext = await browser.newContext({
        viewport: { width: 375, height: 812 },
        acceptDownloads: true,
      });
      const failurePage = await failureContext.newPage();
      let blockedPosts = 0;
      await failurePage.route("**/api/enquiry", async (route) => {
        blockedPosts++;
        await route.fulfill({
          status: 502,
          contentType: "application/json",
          body: JSON.stringify({
            error:
              "Local QA: delivery could not be confirmed. Please try again.",
          }),
        });
      });
      await failurePage.goto(`${base}/contact`, { waitUntil: "load" });
      await failurePage
        .getByRole("button", { name: "Send enquiry", exact: true })
        .waitFor();
      await fillBrief(failurePage);
      await failurePage
        .getByRole("button", { name: "Send enquiry", exact: true })
        .click();
      await failurePage.locator(".form-status.status-error").waitFor();
      assert.equal(blockedPosts, 1);
      assert.equal(
        await failurePage.locator("#name").inputValue(),
        "Local QA Person",
      );
      assert.equal(
        await failurePage.locator("#email").inputValue(),
        "qa@example.com",
      );
      assert.match(
        await failurePage.locator("#description").inputValue(),
        /local browser verification/,
      );
      assert.ok(
        await failurePage
          .locator(".form-status.status-error")
          .evaluate((el) => el === document.activeElement),
      );
      await failurePage.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      await failurePage.screenshot({
        path: path.join(output, "contact-delivery-failure-mobile.png"),
        fullPage: true,
      });
      assert.equal(await failurePage.getByRole("button", { name: /download/i }).count(), 0);
      await failureContext.close();
    },
  );
  assert.deepEqual(report.pageErrors, []);
} catch (error) {
  await page.screenshot({
    path: path.join(output, "interaction-failure.png"),
    fullPage: true,
  });
  process.exitCode = 1;
  console.error(error);
} finally {
  await writeFile(
    path.join(output, "interaction-report.json"),
    JSON.stringify(report, null, 2),
  );
  await browser.close();
  console.log(
    `${report.checks.filter((c) => c.passed).length}/${report.checks.length} interaction checks passed. Report: ${path.join(output, "interaction-report.json")}`,
  );
}
