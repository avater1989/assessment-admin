import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const out = path.resolve('verification');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 1080 }, colorScheme: 'light' });
const consoleErrors = [];
page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', (error) => consoleErrors.push(String(error)));

await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(out, 'home.png') });

await page.getByRole('button', { name: '管理员' }).click();
const accountMenu = await page.getByText('账户设置', { exact: true }).isVisible();
await page.getByRole('button', { name: '管理员' }).click();

await page.getByRole('button', { name: '新建项目' }).click();
const modalVisible = await page.getByRole('dialog').isVisible();
await page.getByPlaceholder('如：心理健康测评').fill('睡眠质量测评');
await page.locator('select[name="type"]').selectOption({ label: '补充测评' });
await page.locator('textarea[name="description"]').fill('用于快速了解近期睡眠状态');
await page.getByRole('button', { name: '创建项目' }).click();
const createdVisible = await page.getByText('睡眠质量测评', { exact: true }).isVisible();

await page.getByRole('button', { name: '独立测评' }).click();
await page.getByRole('button', { name: '配置题目' }).click();
const questionPage = await page.getByText('你最近是否感到情绪低落？', { exact: true }).isVisible();
await page.getByRole('button', { name: '返回项目列表' }).click();
await page.getByRole('button', { name: '评分规则' }).click();
const scoringPage = await page.getByText('整体测评累计分值分段结果', { exact: true }).isVisible();
await page.getByRole('button', { name: '返回项目列表' }).click();

const navigation = [
  ['系列测评管理', '系列测评管理'],
  ['测评结果', '测评结果'],
  ['计划列表', '计划管理'],
  ['关联规则配置', '任务关联管理'],
];
const navResults = [];
for (const [buttonName, heading] of navigation) {
  await page.getByRole('button', { name: buttonName, exact: true }).click();
  navResults.push({ buttonName, visible: await page.getByRole('heading', { name: heading, exact: true }).isVisible() });
}
const pointsModuleRemoved = await page.getByRole('button', { name: '积分规则配置', exact: true }).count() === 0;
const reportTemplateModuleRemoved = await page.getByRole('button', { name: '结果报告模板', exact: true }).count() === 0;

await page.getByRole('button', { name: '测试项目管理', exact: true }).click();
await page.screenshot({ path: path.join(out, 'home-final.png') });

console.log(JSON.stringify({
  title: await page.title(),
  accountMenu,
  modalVisible,
  createdVisible,
  questionPage,
  scoringPage,
  navResults,
  pointsModuleRemoved,
  reportTemplateModuleRemoved,
  consoleErrors,
}, null, 2));
await browser.close();
