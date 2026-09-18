import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const out = path.resolve('reference-site', 'question-flows');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 1080 }, colorScheme: 'light' });

async function openQuestions(page) {
  await page.goto('https://mentor-morse-78994253.figma.site/', { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.getByRole('button', { name: '配置题目', exact: true }).waitFor({ timeout: 30_000 });
  await page.getByRole('button', { name: '配置题目', exact: true }).click();
  await page.getByText('你最近是否感到情绪低落？', { exact: true }).waitFor({ timeout: 20_000 });
}

async function dump(page, id) {
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(out, `${id}.png`) });
  const data = await page.evaluate(() => ({
    title: document.title,
    url: location.href,
    text: document.body.innerText,
    dialogs: [...document.querySelectorAll('[role="dialog"], [role="alertdialog"]')].map((node) => node.innerText),
    controls: [...document.querySelectorAll('button,input,textarea,select,[role="combobox"],[role="tab"],[role="radio"],[role="checkbox"]')].map((node) => ({
      tag: node.tagName,
      role: node.getAttribute('role'),
      type: node.getAttribute('type'),
      text: node.innerText || node.getAttribute('aria-label') || node.getAttribute('placeholder') || '',
      value: node.value ?? '',
      options: node.tagName === 'SELECT' ? [...node.options].map((option) => option.textContent) : [],
    })),
  }));
  fs.writeFileSync(path.join(out, `${id}.json`), JSON.stringify(data, null, 2), 'utf8');
  return { id, dialogCount: data.dialogs.length, controlCount: data.controls.length };
}

const results = [];
{
  const page = await context.newPage();
  await openQuestions(page);
  await page.getByRole('button', { name: '新建题目', exact: true }).click();
  results.push(await dump(page, 'new-question'));
  await page.close();
}
{
  const page = await context.newPage();
  await openQuestions(page);
  await page.getByRole('button', { name: '整体跳转规则配置', exact: true }).click();
  results.push(await dump(page, 'jump-rules'));
  await page.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
