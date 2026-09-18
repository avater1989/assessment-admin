import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const out = path.resolve('reference-site', 'module-interactions');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function openModule(page, nav) {
  await page.goto('https://mentor-morse-78994253.figma.site/', { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const button = page.getByRole('button', { name: nav, exact: true });
  await button.waitFor({ timeout: 30_000 });
  await button.click();
  await page.waitForTimeout(500);
}

async function dump(page, id) {
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(out, `${id}.png`), fullPage: true });
  const data = await page.evaluate(() => ({
    text: document.body.innerText,
    dialogs: [...document.querySelectorAll('[role="dialog"],[role="alertdialog"]')].map((node) => node.innerText),
    buttons: [...document.querySelectorAll('button')].map((button, i) => ({
      i,
      text: button.innerText.trim(),
      aria: button.getAttribute('aria-label'),
      title: button.getAttribute('title'),
      svg: button.querySelector('svg')?.getAttribute('class') || '',
      row: button.closest('tr')?.innerText.slice(0, 350) || '',
      disabled: button.disabled,
    })),
    controls: [...document.querySelectorAll('input,textarea,select,[role="combobox"],[role="checkbox"],[role="radio"],[role="switch"]')].map((node) => ({
      tag: node.tagName,
      role: node.getAttribute('role'),
      type: node.getAttribute('type'),
      name: node.getAttribute('name'),
      placeholder: node.getAttribute('placeholder'),
      value: node.value ?? node.getAttribute('aria-checked') ?? '',
      text: node.innerText || node.getAttribute('aria-label') || '',
      options: node.tagName === 'SELECT' ? [...node.options].map((option) => option.textContent) : [],
    })),
  }));
  fs.writeFileSync(path.join(out, `${id}.json`), JSON.stringify(data, null, 2), 'utf8');
  return { id, dialogs: data.dialogs.length, controls: data.controls.length, buttons: data.buttons.length };
}

const modules = [
  ['series', '系列测评管理', '新建系列'],
  ['reports', '报告模板管理（待研究）', '新建模板'],
  ['publishing', '测评上下架管理', null],
  ['results', '测评结果', '导出数据'],
  ['plans', '计划列表', '新建计划'],
  ['relations', '关联规则配置', '新建关联规则'],
  ['points', '积分规则配置', '新建积分规则'],
];

const summary = [];
for (const [id, nav, primary] of modules) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, colorScheme: 'light' });
  await openModule(page, nav);
  summary.push(await dump(page, `${id}-base`));
  if (primary && primary !== '导出数据') {
    const action = page.getByRole('button', { name: primary, exact: true });
    if (await action.count()) {
      await action.click();
      summary.push(await dump(page, `${id}-new`));
    }
  }
  await page.close();
}

await browser.close();
console.log(JSON.stringify(summary, null, 2));
