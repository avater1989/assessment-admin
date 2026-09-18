import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const out = path.resolve('verification', 'all-modules');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, acceptDownloads: true });
const page = await context.newPage();
const errors = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', (error) => errors.push(error.message));
await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });

async function nav(name) {
  await page.getByRole('button', { name, exact: true }).click();
  await page.waitForTimeout(80);
}

const checks = {};

await nav('系列测评管理');
await page.getByRole('button', { name:'新建系列', exact:true }).click();
await page.getByPlaceholder('如：综合心理健康评估').fill('成长能力系列');
await page.getByPlaceholder('简要描述该系列测评的内容和目的').fill('覆盖心理与学习能力');
await page.locator('[data-action="add-series-project"]').nth(0).click();
await page.locator('[data-action="add-series-project"]').nth(4).click();
await page.getByRole('button', { name:'保存', exact:true }).click();
checks.seriesCreated = await page.getByText('成长能力系列', { exact:true }).count() === 1;
await page.locator('#series-search').fill('成长能力');
checks.seriesFiltered = await page.locator('#series-rows tr:visible').count() === 1;

checks.publishingModuleRemoved = await page.getByRole('button', { name:'测评上下架管理', exact:true }).count() === 0;
checks.reportTemplateModuleRemoved = await page.getByRole('button', { name:'结果报告模板', exact:true }).count() === 0;
await nav('测试项目管理');
const projectRow = page.locator('#project-rows tr').filter({ hasText:'心理健康测评' });
await projectRow.getByRole('button',{ name:'报告配置',exact:true }).click();
await page.locator('#report-config-key').selectOption('mental-health-v1');
await page.getByRole('button',{ name:'模拟预览',exact:true }).click();
checks.registeredReportPreview = await page.getByText('mental-health-v1',{ exact:true }).count() === 1;
await page.getByRole('button',{ name:'返回配置',exact:true }).click();
await page.getByRole('button',{ name:'保存项目报告',exact:true }).click();
checks.reportConfigured = (await projectRow.innerText()).includes('心理健康报告') && (await projectRow.innerText()).includes('v1');
const beforeStatus = await projectRow.getAttribute('data-project-shelf');
await projectRow.locator('[data-action="toggle-shelf"]').click();
const afterStatus = await page.locator('#project-rows tr').filter({ hasText:'心理健康测评' }).getAttribute('data-project-shelf');
checks.projectShelfToggled = beforeStatus !== afterStatus;
await page.locator('#project-shelf').selectOption(afterStatus);
await page.locator('#project-search').fill('心理健康');
checks.projectShelfFiltered = await page.locator('#project-rows tr:visible').count() === 1;

await nav('测评结果');
await page.locator('[data-action="view-result"]').first().click();
checks.resultDetail = await page.getByRole('heading', { name:'测评结果详情', exact:true }).isVisible()
  && await page.locator('.coded-report-meta code').count() === 1;
await page.getByRole('button', { name:'关闭', exact:true }).click();
const downloadPromise = page.waitForEvent('download');
await page.getByRole('button', { name:'导出数据', exact:true }).click();
const download = await downloadPromise;
checks.resultExport = download.suggestedFilename() === 'assessment-results.csv';

await nav('计划列表');
await page.getByRole('button', { name:'新建计划', exact:true }).click();
await page.getByPlaceholder('请输入计划名称').fill('秋季成长计划');
await page.getByPlaceholder('请输入计划描述').fill('面向一年级学生的成长计划');
await page.locator('#plan-form input[name="planSelection"]').first().check();
await page.locator('#plan-form input[name="groups"]').first().check();
await page.getByRole('button', { name:'保存计划', exact:true }).click();
checks.planCreated = await page.getByText('秋季成长计划', { exact:true }).count() === 1;
await page.locator('#plan-rows [data-action="publish-plan"]').last().click();
checks.planPublished = await page.locator('#plan-rows tr').last().getAttribute('data-status') === '已发布';

await nav('关联规则配置');
await page.getByRole('button', { name:'新建关联规则', exact:true }).click();
await page.locator('#relation-form select[name="project"]').selectOption({ label:'学习能力测评' });
await page.locator('#condition-min').fill('60');
await page.locator('#condition-max').fill('80');
await page.getByRole('button', { name:'添加条件', exact:true }).click();
await page.getByRole('button', { name:'选择任务', exact:true }).click();
await page.locator('#relation-task-search').fill('训练');
await page.locator('#relation-task-picker input[name="tasks"]').nth(0).check();
checks.relationMultiSelectCount = await page.locator('#picker-confirm-count').textContent() === '1';
await page.screenshot({ path:path.join(out,'relation-task-picker.png'), fullPage:true });
await page.getByRole('button', { name:/确认选择/ }).click();
checks.relationSelectionShown = await page.locator('#relation-selected-tasks .selected-task-chip').count() === 1;
await page.getByRole('button', { name:'保存规则', exact:true }).click();
checks.relationCreated = await page.getByText('学习能力测评', { exact:true }).count() >= 1;
const relationBefore = await page.locator('#relation-rows tr').last().locator('.status-button').textContent();
await page.locator('#relation-rows tr').last().locator('.status-button').click();
const relationAfter = await page.locator('#relation-rows tr').last().locator('.status-button').textContent();
checks.relationToggled = relationBefore !== relationAfter;

checks.pointsModuleRemoved = await page.getByRole('button', { name:'积分规则配置', exact:true }).count() === 0;

await page.screenshot({ path:path.join(out,'final.png'), fullPage:true });
checks.errors = errors;
checks.allPassed = Object.entries(checks).filter(([key]) => key !== 'errors').every(([,value]) => value === true) && errors.length === 0;
fs.writeFileSync(path.join(out,'result.json'), JSON.stringify(checks,null,2));
console.log(JSON.stringify(checks,null,2));
await browser.close();
