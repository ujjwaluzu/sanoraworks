import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.QA_BASE_URL || 'http://localhost:3004';
const label = process.argv[2] || 'current';
const browser = await chromium.launch({ channel: 'chrome' });
const results = [];
await mkdir('artifacts/performance', { recursive: true });
try {
  for (let run = 0; run < 3; run++) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    await context.route('**/api/enquiry', route => route.abort());
    await context.addInitScript(() => {
      window.__performanceLab = { lcp: 0, cls: 0, longTasks: 0, shifts: [] };
      new PerformanceObserver(list => { for (const e of list.getEntries()) window.__performanceLab.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) { window.__performanceLab.cls += e.value; window.__performanceLab.shifts.push({ time: e.startTime, value: e.value, sources: e.sources.map(s => ({ node: s.node?.outerHTML.slice(0, 180), previous: s.previousRect, current: s.currentRect })) }); } }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(list => { for (const e of list.getEntries()) window.__performanceLab.longTasks += Math.max(0, e.duration - 50); }).observe({ type: 'longtask', buffered: true });
    });
    const page = await context.newPage();
    const session = await context.newCDPSession(page);
    await session.send('Network.enable');
    await session.send('Network.setCacheDisabled', { cacheDisabled: true });
    await session.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 });
    await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    const metrics = await page.evaluate(() => ({
      ...window.__performanceLab,
      fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      ttfb: performance.getEntriesByType('navigation')[0].responseStart,
      resources: performance.getEntriesByType('resource').map(r => ({ name: new URL(r.name).pathname, bytes: r.transferSize, type: r.initiatorType })),
      stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
      overflow: document.documentElement.scrollWidth > innerWidth,
    }));
    if (!run) await page.screenshot({ path: 'artifacts/performance/' + label + '-mobile.png', fullPage: true });
    results.push({ run, ...metrics, errors });
    await context.close();
  }
  await writeFile('artifacts/performance/' + label + '.json', JSON.stringify({ base, label, conditions: 'Cold cache, 390px/2x, 150ms latency, 1.6Mbps download, 4x CPU; local lab, not Lighthouse or field data.', results }, null, 2));
  console.log(JSON.stringify(results.map(({ resources, ...r }) => ({ ...r, transferred: resources.reduce((s, r) => s + r.bytes, 0), requests: resources.length })), null, 2));
  if (results.some(r => r.overflow || r.errors.length)) process.exitCode = 1;
} finally { await browser.close(); }
