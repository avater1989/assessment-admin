import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const outputDir = path.resolve('reference-site', 'capture');
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 1080 },
  deviceScaleFactor: 1,
  colorScheme: 'light',
});
const page = await context.newPage();

await page.goto('https://mentor-morse-78994253.figma.site/', {
  waitUntil: 'domcontentloaded',
  timeout: 60_000,
});
await page.waitForTimeout(8_000);

await page.screenshot({ path: path.join(outputDir, 'viewport-top.png') });
await page.screenshot({ path: path.join(outputDir, 'full-page.png'), fullPage: true });

const snapshot = await page.evaluate(() => {
  const selectorFor = (element) => {
    if (element.id) return `#${element.id}`;
    const segments = [];
    let current = element;
    while (current && current !== document.body && segments.length < 5) {
      let segment = current.tagName.toLowerCase();
      if (current.classList.length) {
        segment += `.${[...current.classList].slice(0, 3).join('.')}`;
      }
      const parent = current.parentElement;
      if (parent) {
        const siblings = [...parent.children].filter((child) => child.tagName === current.tagName);
        if (siblings.length > 1) segment += `:nth-of-type(${siblings.indexOf(current) + 1})`;
      }
      segments.unshift(segment);
      current = parent;
    }
    return segments.join(' > ');
  };

  const scrollables = [...document.querySelectorAll('*')]
    .filter((element) => element.scrollHeight > element.clientHeight + 5)
    .map((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        selector: selectorFor(element),
        tag: element.tagName,
        className: element.className,
        clientWidth: element.clientWidth,
        clientHeight: element.clientHeight,
        scrollWidth: element.scrollWidth,
        scrollHeight: element.scrollHeight,
        overflowX: style.overflowX,
        overflowY: style.overflowY,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      };
    })
    .sort((a, b) => b.scrollHeight - a.scrollHeight);

  const interactive = [...document.querySelectorAll('button, a, input, textarea, select, [role="button"], [tabindex]')]
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        tag: element.tagName,
        role: element.getAttribute('role'),
        type: element.getAttribute('type'),
        text: element.innerText || element.getAttribute('aria-label') || element.getAttribute('placeholder') || '',
        selector: selectorFor(element),
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      };
    });

  const stylesheets = [...document.styleSheets].map((sheet) => sheet.href).filter(Boolean);
  const images = [...document.images].map((image) => ({
    src: image.currentSrc || image.src,
    alt: image.alt,
    width: image.naturalWidth,
    height: image.naturalHeight,
  }));

  return {
    title: document.title,
    url: location.href,
    viewport: { width: innerWidth, height: innerHeight },
    documentSize: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    bodyText: document.body.innerText,
    scrollables,
    interactive,
    stylesheets,
    images,
    html: document.documentElement.outerHTML,
  };
});

fs.writeFileSync(path.join(outputDir, 'page.html'), snapshot.html, 'utf8');
delete snapshot.html;
fs.writeFileSync(path.join(outputDir, 'snapshot.json'), JSON.stringify(snapshot, null, 2), 'utf8');
fs.writeFileSync(path.join(outputDir, 'page-text.txt'), snapshot.bodyText, 'utf8');

const primaryScroller = snapshot.scrollables.find((item) => item.clientWidth >= 900 && item.clientHeight >= 600);
if (primaryScroller) {
  const target = page.locator(primaryScroller.selector).first();
  const positions = [0, 540, 1080, 1620, 2160, 2700];
  for (const position of positions) {
    await target.evaluate((element, value) => { element.scrollTop = value; }, position);
    await page.waitForTimeout(350);
    const actual = await target.evaluate((element) => element.scrollTop);
    await page.screenshot({ path: path.join(outputDir, `scroll-${String(actual).padStart(4, '0')}.png`) });
    if (actual + primaryScroller.clientHeight >= primaryScroller.scrollHeight) break;
  }
}

await browser.close();
console.log(JSON.stringify({
  title: snapshot.title,
  viewport: snapshot.viewport,
  documentSize: snapshot.documentSize,
  scrollables: snapshot.scrollables.slice(0, 5),
  interactiveCount: snapshot.interactive.length,
  imageCount: snapshot.images.length,
}, null, 2));
