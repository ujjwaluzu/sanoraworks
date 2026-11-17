import assert from "node:assert/strict";

const base = new URL(process.env.SMOKE_BASE_URL || "http://localhost:3001");
const canonicalBase = "https://sanoraworks.com";
const pages = [
  "/",
  "/services",
  "/services/software-web-development",
  "/services/product-engineering",
  "/services/ai-intelligent-automation",
  "/services/cloud-infrastructure",
  "/work",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/work/slotbreeze",
  "/work/proofhuddle",
  "/work/enquirywing",
  "/work/uptimeperch",
];
const documents = new Map();
const titles = new Set();
const socialUrls = [
  "https://x.com/sanoraworks",
  "https://www.instagram.com/sanoraworks/",
  "https://www.youtube.com/@sanoraworks",
];

for (const path of pages) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, path);
  const html = await response.text();
  documents.set(path, html);
  assert.doesNotMatch(html, /href="\/brand\/(?:index\.html|sanoraworks-brand-kit\.zip)"/, `${path}: no public brand kit link`);
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
  const organization = JSON.parse(
    html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1],
  );
  assert.equal(organization.name, "SanoraWorks", `${path}: current organization name`);
  const sidebar = html.match(/<aside\b[^>]*class="site-sidebar"[^>]*>(.*?)<\/aside>/s)?.[1];
  assert.ok(sidebar, `${path}: current directory sidebar`);
  assert.deepEqual(
    [...sidebar.matchAll(/<h2>(.*?)<\/h2>/g)].map((match) => match[1]),
    ["Services", "Projects", "Contact"],
    `${path}: approved sidebar sections`,
  );
  for (const url of socialUrls) {
    assert.ok(organization.sameAs.includes(url), `${path}: social identity ${url}`);
    assert.ok(
      html.split(`href="${url}"`).length - 1 >= 1,
      `${path}: social profile visible in footer: ${url}`,
    );
  }
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title && !titles.has(title), `${path}: unique page title`);
  assert.ok(title.includes("SanoraWorks"), `${path}: current page branding`);
  titles.add(title);
}

assert.ok(documents.get("/").includes("Web development, product engineering, AI automation, and cloud services"));
for (const [path, html] of documents) {
  assert.doesNotMatch(html, /Workshop directory|Email the workshop|About the workshop|More from the workshop|To be introduced|The people behind SanoraWorks/);
  if (path.startsWith("/work")) {
    assert.ok(html.includes("Illustrative interface concept."), `${path}: visible preview label`);
    assert.doesNotMatch(html, /Technology details forthcoming|Public URL not yet published|built with purpose/);
  }
}
assert.ok(documents.get("/contact").includes("Send enquiry"));
assert.doesNotMatch(documents.get("/about"), /Founder profile|Our mission|Our vision|The SANORA philosophy/);


const projectRoutes = ["slotbreeze", "proofhuddle", "enquirywing", "uptimeperch"];
for (const slug of projectRoutes) {
  const html = documents.get(`/work/${slug}`);
  assert.ok(html.includes("In development"), `${slug}: clear development status`);
  assert.ok(html.includes("How a similar system could help your business"), `${slug}: business use explained`);
  assert.ok(html.includes("What we are working towards"), `${slug}: planned capabilities explained`);
  assert.ok(html.includes("Discuss a similar project"), `${slug}: relevant enquiry action`);
}
for (const html of documents.values()) {
  assert.doesNotMatch(html, /UzzUTV|RepoTeam|CrewLab/, "Retired projects are absent from public pages");
}
for (const slug of ["uzzutv", "repoteam", "crewlab"]) {
  assert.equal((await fetch(new URL(`/work/${slug}`, base))).status, 404, `Retired route ${slug}`);
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

for (const path of ["/does-not-exist", "/work/does-not-exist", "/insights", "/brand/index.html", "/brand/sanoraworks-brand-kit.zip"]) {
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
assert.ok(robots.includes("Disallow: /api/enquiry"));
assert.ok(robots.includes("Content-Signal: search=yes, ai-input=yes, ai-train=no"));
assert.equal((sitemap.match(/<loc>/g) || []).length, 15);
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
// Valid submissions are covered with a stub email binding in unit tests.
// Never send a real enquiry as part of a routine smoke check.

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
