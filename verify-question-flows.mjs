import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const out = path.resolve('verification');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 1080 }, acceptDownloads: true });
const errors = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', (error) => errors.push(String(error)));

await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: '配置题目', exact: true }).click();

await page.getByRole('button', { name: '新建题目', exact: true }).click();
await page.screenshot({ path: path.join(out, 'new-question-modal.png') });
const dialog = page.getByRole('dialog');
await dialog.getByRole('button', { name: '添加选项', exact: true }).click();
const optionCount = await dialog.locator('.option-row').count();
await dialog.locator('select[name="questionType"]').selectOption({ label: '文本题' });
const optionsHiddenForText = await dialog.locator('#question-options').isHidden();
await dialog.locator('select[name="questionType"]').selectOption({ label: '单选题' });
await dialog.getByPlaceholder('请输入题目内容').fill('最近一周你的睡眠质量如何？');
await dialog.getByPlaceholder('如：情绪状态').fill('睡眠状态');
await dialog.getByRole('button', { name: '保存', exact: true }).click();
const createdQuestion = await page.getByText('最近一周你的睡眠质量如何？', { exact: true }).isVisible();
const countUpdated = await page.getByText('综合心理健康评估 · 2 道题目', { exact: true }).isVisible();

await page.getByRole('button', { name: '编辑题目', exact: true }).nth(1).click();
await page.getByPlaceholder('请输入题目内容').fill('最近一周你的睡眠质量怎么样？');
await page.getByRole('button', { name: '保存', exact: true }).click();
const editedQuestion = await page.getByText('最近一周你的睡眠质量怎么样？', { exact: true }).isVisible();

await page.getByRole('button', { name: '整体跳转规则配置', exact: true }).click();
const emptyJumpRules = await page.getByText('暂无全局跳转规则', { exact: true }).isVisible();
await page.getByRole('button', { name: '添加规则', exact: true }).click();
await page.locator('[data-rule-field="name"]').fill('低分跳转');
await page.locator('[data-rule-field="scoreMax"]').fill('5');
await page.locator('[data-rule-field="target"]').selectOption('2');
const previewUpdated = await page.getByText(/跳转至第 2 题/).isVisible();
await page.screenshot({ path: path.join(out, 'jump-rule-editor.png') });

const downloadPromise = page.waitForEvent('download');
await page.getByRole('button', { name: '导出规则', exact: true }).click();
const download = await downloadPromise;
const exportName = download.suggestedFilename();

await page.getByRole('button', { name: '脚本配置', exact: true }).click();
const scriptArea = page.locator('#jump-script');
const scriptContainsRule = (await scriptArea.inputValue()).includes('低分跳转');
await scriptArea.fill('[{"name":"脚本规则","from":1,"to":2,"scoreMin":0,"scoreMax":3,"action":"finish","target":"","enabled":true}]');
await page.getByRole('button', { name: '导入脚本', exact: true }).click();
const importedRule = await page.locator('[data-rule-field="name"]').inputValue();
await page.getByRole('button', { name: '保存配置', exact: true }).click();
const savedToast = await page.getByText('整体跳转规则已保存', { exact: true }).isVisible();

console.log(JSON.stringify({ optionCount, optionsHiddenForText, createdQuestion, countUpdated, editedQuestion, emptyJumpRules, previewUpdated, exportName, scriptContainsRule, importedRule, savedToast, errors }, null, 2));
await browser.close();
