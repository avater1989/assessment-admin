import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const out = path.resolve('reference-site', 'question-flows');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 1080 }, colorScheme: 'light', acceptDownloads: true });

async function openQuestions(page) {
  await page.goto('https://mentor-morse-78994253.figma.site/', { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.getByRole('button', { name: '配置题目', exact: true }).waitFor({ timeout: 30_000 });
  await page.getByRole('button', { name: '配置题目', exact: true }).click();
  await page.getByText('你最近是否感到情绪低落？', { exact: true }).waitFor({ timeout: 20_000 });
}

async function save(page, id) {
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(out, `${id}.png`) });
  const state = await page.evaluate(() => ({
    text: document.body.innerText,
    dialogs: [...document.querySelectorAll('[role="dialog"], [role="alertdialog"]')].map((node) => node.innerText),
    controls: [...document.querySelectorAll('button,input,textarea,select,[role="option"],[role="tab"],[role="switch"]')].map((node) => ({
      tag: node.tagName, role: node.getAttribute('role'), type: node.getAttribute('type'),
      text: node.innerText || node.getAttribute('aria-label') || node.getAttribute('placeholder') || '',
      value: node.value ?? '', checked: node.checked ?? node.getAttribute('aria-checked'),
    })),
  }));
  fs.writeFileSync(path.join(out, `${id}.json`), JSON.stringify(state, null, 2), 'utf8');
  return id;
}

async function scenario(id, action) {
  const page = await context.newPage();
  await openQuestions(page);
  await action(page);
  const result = await save(page, id);
  await page.close();
  return result;
}

const results = [];
results.push(await scenario('question-type-options', async (page) => {
  await page.getByRole('button', { name: '新建题目', exact: true }).click();
  await page.getByRole('combobox').click();
}));
results.push(await scenario('question-add-option', async (page) => {
  await page.getByRole('button', { name: '新建题目', exact: true }).click();
  await page.getByRole('button', { name: '添加选项', exact: true }).click();
}));
results.push(await scenario('question-saved', async (page) => {
  await page.getByRole('button', { name: '新建题目', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByPlaceholder('请输入题目内容').fill('最近一周你的睡眠质量如何？');
  await dialog.getByPlaceholder('如：情绪状态').fill('睡眠状态');
  await dialog.getByRole('button', { name: '保存', exact: true }).click();
  await page.getByText('最近一周你的睡眠质量如何？', { exact: true }).waitFor();
}));
results.push(await scenario('jump-add-rule', async (page) => {
  await page.getByRole('button', { name: '整体跳转规则配置', exact: true }).click();
  await page.getByRole('button', { name: '添加规则', exact: true }).click();
}));
results.push(await scenario('jump-script-mode', async (page) => {
  await page.getByRole('button', { name: '整体跳转规则配置', exact: true }).click();
  await page.getByRole('tab', { name: '脚本配置', exact: true }).click();
}));

await browser.close();
console.log(JSON.stringify(results));
