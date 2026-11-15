import assert from "node:assert/strict";

const base = new URL(process.env.SMOKE_BASE_URL || "http://localhost:3001");
const canonicalBase = "https://sanoraworks.com";
const pages = [
  "/",
  "/services",
  "/work",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/work/uzzutv",
  "/work/repoteam",
  "/work/crewlab",
];
const documents = new Map();
const titles = new Set();

for (const path of pages) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, path);
  const html = await response.text();
  documents.set(path, html);
  assert.equal(
    (html.match(/<h1\b/g) || []).length,
    1,
    `${path}: one main heading`,
  );
  assert.ok(html.includes('id="main-content"'), `${path}: skip link target`);
  const canonical = html.match(/rel="canonical" href="([^\"]+)"/)?.[1];
  assert.ok(canonical, `${path}: canonical exists`);
  assert.equal(
    new URL(canonical).href,
    `${canonicalBase}${path}`,
    `${path}: canonical`,
  );
  assert.match(
    html,
    /name="description" content="[^\"]+"/,
    `${path}: description`,
  );
  assert.match(html, /property="og:title"/, `${path}: Open Graph`);
  assert.match(
    html,
    /name="twitter:card" content="summary_large_image"/,
    `${path}: Twitter card`,
  );
  assert.match(html, /application\/ld\+json/, `${path}: structured data`);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title && !titles.has(title), `${path}: unique page title`);
  titles.add(title);
}

const links = new Set();
for (const [path, html] of documents) {
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^\"]*)"/g)) {
    const href = match[1].replaceAll("&amp;", "&");
    assert.ok(href && href !== "#", `${path}: no empty placeholder link`);
    const target = new URL(href, new URL(path, base));
    if (target.origin === base.origin) links.add(target.href);
  }
}

for (const href of links) {
  const url = new URL(href);
  const path = url.pathname + url.search;
  if (!documents.has(path)) {
    const response = await fetch(url);
    assert.equal(response.status, 200, `${url.pathname}: internal destination`);
    documents.set(path, await response.text());
  }
  if (url.hash)
    assert.ok(
      documents
        .get(path)
        .includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
      `${path}${url.hash}: anchor target`,
    );
}

for (const path of ["/does-not-exist", "/work/does-not-exist", "/insights"]) {
  assert.equal(
    (await fetch(new URL(path, base))).status,
    404,
    `${path}: completed routes only`,
  );
}

const sitemap = await (await fetch(new URL("/sitemap.xml", base))).text();
for (const path of pages)
  assert.ok(
    sitemap.includes(`${canonicalBase}${path}</loc>`),
    `${path}: sitemap`,
  );
const robots = await (await fetch(new URL("/robots.txt", base))).text();
assert.ok(robots.includes("Disallow: /api/"));
assert.ok(robots.includes(`${canonicalBase}/sitemap.xml`));

for (const [path, width, height] of [
  ["/opengraph-image", 1200, 630],
  ["/apple-icon", 180, 180],
]) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get("content-type"), /image\/png/);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.readUInt32BE(16), width);
  assert.equal(bytes.readUInt32BE(20), height);
}
assert.equal((await fetch(new URL("/icon.svg", base))).status, 200);

const api = new URL("/api/enquiry", base);
const post = (body, extra = {}) =>
  fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...extra },
    body,
  });
assert.equal((await fetch(api)).status, 405);
assert.equal(
  (await post("{}", { Origin: "https://unrelated.example" })).status,
  403,
);
assert.equal((await post("{}", { "Content-Type": "text/plain" })).status, 415);
assert.equal((await post("{broken")).status, 400);
const invalid = await post("{}");
assert.equal(invalid.status, 400);
assert.ok((await invalid.json()).errors.email);
assert.equal(
  (await post(JSON.stringify({ description: "a".repeat(40_000) }))).status,
  413,
);
if (documents.get("/contact").includes("Online enquiries are not open yet")) {
  const response = await post(
    JSON.stringify({
      name: "Test Person",
      email: "test@example.com",
      company: "",
      projectType: "Product Engineering",
      budget: "",
      description: "A local verification of the unconfigured enquiry service.",
      website: "",
    }),
  );
  assert.equal(
    response.status,
    503,
    "unconfigured delivery must not claim success",
  );
  assert.match((await response.json()).error, /not been sent/);
} else {
  console.log(
    "Skipping valid enquiry POST: delivery is configured; no test message sent.",
  );
}

const serviceEnquiry = await (
  await fetch(new URL("/contact?service=product-engineering", base))
).text();
assert.match(
  serviceEnquiry,
  /<option[^>]*selected[^>]*>Product Engineering<\/option>/,
);
console.log(
  `Passed: ${pages.length} pages, ${links.size} internal links and anchors, unique metadata, 404s, sitemap, robots, share images, service selection, and enquiry safeguards.`,
);
