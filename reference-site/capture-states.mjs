import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const outputDir = path.resolve('reference-site', 'states');
fs.mkdirSync(outputDir, { recursive: true });

const scenarios = [
  { id: 'account-menu', role: 'button', name: '管理员' },
  { id: 'supplementary-tab', role: 'tab', name: '补充测评' },
  { id: 'new-project', role: 'button', name: '新建项目' },
  { id: 'configure-questions', role: 'button', name: '配置题目' },
  { id: 'scoring-rules', role: 'button', name: '评分规则' },
  { id: 'publish-project', role: 'button', name: '上架', exact: true },
  { id: 'series-management', role: 'button', name: '系列测评管理' },
  { id: 'report-templates', role: 'button', name: '报告模板管理（待研究）' },
  { id: 'publish-management', role: 'button', name: '测评上下架管理' },
  { id: 'assessment-results', role: 'button', name: '测评结果' },
  { id: 'plan-list', role: 'button', name: '计划列表' },
  { id: 'relation-rules', role: 'button', name: '关联规则配置' },
  { id: 'points-rules', role: 'button', name: '积分规则配置' },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 1080 },
  deviceScaleFactor: 1,
  colorScheme: 'light',
});

const results = [];
for (const scenario of scenarios) {
  const page = await context.newPage();
  try {
    await page.goto('https://mentor-morse-78994253.figma.site/', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await page.getByText('测试项目管理', { exact: true }).first().waitFor({ timeout: 30_000 });
    await page.waitForTimeout(500);

    const locator = page.getByRole(scenario.role, {
      name: scenario.name,
      exact: scenario.exact ?? true,
    }).first();
    await locator.click({ timeout: 10_000 });
    await page.waitForTimeout(700);

    await page.screenshot({ path: path.join(outputDir, `${scenario.id}.png`) });
    const state = await page.evaluate(() => ({
      title: document.title,
      url: location.href,
      text: document.body.innerText,
      dialogs: [...document.querySelectorAll('[role="dialog"], [role="alertdialog"]')].map((element) => ({
        role: element.getAttribute('role'),
        text: element.innerText,
      })),
      interactive: [...document.querySelectorAll('button, a, input, textarea, select, [role="tab"]')].map((element) => ({
        tag: element.tagName,
        type: element.getAttribute('type'),
        role: element.getAttribute('role'),
        text: element.innerText || element.getAttribute('aria-label') || element.getAttribute('placeholder') || '',
        disabled: element.disabled || element.getAttribute('aria-disabled') === 'true',
      })),
    }));
    fs.writeFileSync(path.join(outputDir, `${scenario.id}.json`), JSON.stringify(state, null, 2), 'utf8');
    results.push({ id: scenario.id, ok: true, url: state.url, dialogCount: state.dialogs.length });
  } catch (error) {
    results.push({ id: scenario.id, ok: false, error: String(error) });
  } finally {
    await page.close();
  }
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
