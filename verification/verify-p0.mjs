import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const out = path.resolve('verification','p0');
fs.mkdirSync(out,{ recursive:true });
const browser = await chromium.launch({ headless:true });
const context = await browser.newContext({ viewport:{ width:1440,height:1100 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror',(error) => errors.push(error.message));
page.on('console',(message) => { if (message.type() === 'error') errors.push(message.text()); });
await page.goto('http://127.0.0.1:4173/',{ waitUntil:'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil:'networkidle' });

const checks = {};
const nav = async (name) => { await page.getByRole('button',{ name,exact:true }).click(); };

// Create a second independent project.
await page.getByRole('button',{ name:'新建项目',exact:true }).click();
await page.locator('#project-form [name="name"]').fill('项目B');
await page.locator('#project-form [name="type"]').selectOption('独立测评');
await page.locator('#project-form [name="description"]').fill('用于P0隔离验证');
await page.locator('#project-form').getByRole('button',{ name:/创建项目/ }).click();
checks.projectCreated = await page.getByText('项目B',{ exact:true }).count() === 1;
let rowB = page.locator('#project-rows tr').filter({ hasText:'项目B' });
await rowB.getByRole('button',{ name:'上架',exact:true }).click();
checks.emptyProjectBlockedFromShelf = (await page.locator('.readiness-list').innerText()).includes('至少配置一道题目') && await rowB.getAttribute('data-project-shelf') === '已下架';
await page.getByRole('button',{name:'我知道了',exact:true}).click();

// Add a scale question and a choice question to project B.
await rowB.getByRole('button',{ name:'配置题目',exact:true }).click();
checks.projectBStartsEmpty = await page.getByText(/0 道题目/).count() > 0;
await page.getByRole('button',{ name:'新建题目',exact:true }).click();
await page.locator('#question-form [name="content"]').fill('当前压力等级');
await page.locator('#question-form [name="questionType"]').selectOption('量表题');
await page.locator('#question-form [name="scaleMin"]').fill('0');
await page.locator('#question-form [name="scaleMax"]').fill('10');
await page.locator('#question-form [name="scaleMinLabel"]').fill('无压力');
await page.locator('#question-form [name="scaleMaxLabel"]').fill('压力极高');
await page.locator('#question-form').getByRole('button',{ name:'保存',exact:true }).click();
checks.scaleSaved = await page.getByText(/量表：0–10/).count() === 1;

await page.getByRole('button',{ name:'新建题目',exact:true }).click();
await page.locator('#question-form [name="content"]').fill('是否需要帮助');
await page.locator('#question-form [name="questionType"]').selectOption('单选题');
await page.locator('[data-option-content]').nth(0).fill('需要');
await page.locator('[data-option-content]').nth(1).fill('暂不需要');
await page.locator('#question-form').getByRole('button',{ name:'保存',exact:true }).click();

// Configure per-question branching for the scale question.
await page.getByRole('button',{ name:'配置题目跳转',exact:true }).first().click();
await page.getByRole('button',{ name:'添加规则',exact:true }).click();
await page.locator('[data-branch-field="min"]').fill('8');
await page.locator('[data-branch-field="max"]').fill('10');
await page.locator('[data-branch-field="target"]').selectOption('1');
await page.getByRole('button',{ name:'保存规则',exact:true }).click();
checks.branchSaved = await page.getByText('1 条跳转',{ exact:true }).count() === 1;
await page.getByRole('button',{ name:'返回项目列表',exact:true }).click();

// Project A must still own only its original question.
const rowA = page.locator('#project-rows tr').filter({ hasText:'心理健康测评' });
await rowA.getByRole('button',{ name:'配置题目',exact:true }).click();
checks.projectIsolation = await page.getByText(/1 道题目/).count() > 0 && await page.getByText('当前压力等级',{ exact:true }).count() === 0;
await page.getByRole('button',{ name:'返回项目列表',exact:true }).click();

// Sort project B upward.
rowB = page.locator('#project-rows tr').filter({ hasText:'项目B' });
await rowB.getByRole('button',{ name:'上移项目',exact:true }).click();
checks.projectSort = (await page.locator('#project-rows tr').first().innerText()).includes('项目B');

// Scoring: overall segment, group, question picker and custom script.
rowB = page.locator('#project-rows tr').filter({ hasText:'项目B' });
await rowB.getByRole('button',{ name:'评分规则',exact:true }).click();
checks.projectScoringContext = await page.getByText('为 项目B 配置评分规则和结果判定',{ exact:true }).count() === 1;
await page.getByRole('button',{ name:'添加分段',exact:true }).click();
await page.locator('[data-score-field="title"]').last().fill('压力关注');
await page.getByRole('button',{ name:/题目组合评分/ }).click();
await page.getByRole('button',{ name:'添加分组',exact:true }).click();
await page.getByRole('button',{ name:/选择题目 \(0\)/ }).click();
await page.locator('input[name="scoreQuestion"]').first().check();
await page.locator('input[name="scoreQuestion"]').nth(1).check();
await page.getByRole('button',{ name:'确认选择',exact:true }).click();
checks.groupQuestionPicker = await page.getByRole('button',{ name:/选择题目 \(2\)/ }).count() === 1;
await page.getByRole('button',{ name:'添加分段',exact:true }).click();
await page.locator('[data-score-field="title"]').fill('组合结果');
await page.getByRole('button',{ name:/自定义脚本/ }).click();
await page.getByRole('button',{ name:'测试脚本',exact:true }).click();
checks.scriptTest = await page.locator('#score-script-result.success').count() === 1;
await page.getByRole('button',{ name:'保存配置',exact:true }).click();
checks.scoringSaved = await page.getByText('评分规则已保存',{ exact:true }).count() === 1;
await page.getByRole('button',{ name:'返回项目列表',exact:true }).click();

// Dynamic project sources: series, project-owned report configuration, shelf controls, plan and relation.
await nav('系列测评管理');
await page.getByRole('button',{ name:'新建系列',exact:true }).click();
checks.seriesSource = await page.locator('[data-action="add-series-project"][data-name="项目B"]').count() === 1;
await page.getByRole('button',{ name:'取消',exact:true }).click();

await nav('测试项目管理');
const integratedRowB = page.locator('#project-rows tr').filter({ hasText:'项目B' });
await integratedRowB.getByRole('button',{ name:'报告配置',exact:true }).click();
checks.reportRegistryAvailable = await page.locator('#report-config-key option').count() === 5 && await page.locator('#report-config-key').inputValue() === 'generic-v1';
await page.getByRole('button',{ name:'取消',exact:true }).click();
checks.projectShelfIntegrated = await integratedRowB.getByRole('button',{ name:'上架',exact:true }).count() === 1 && await page.locator('#project-shelf').count() === 1;
checks.publishingModuleRemoved = await page.getByRole('button',{ name:'测评上下架管理',exact:true }).count() === 0;
checks.reportTemplateModuleRemoved = await page.getByRole('button',{ name:'结果报告模板',exact:true }).count() === 0;

await nav('计划列表');
await page.getByRole('button',{ name:'新建计划',exact:true }).click();
await page.locator('[data-plan-method][value="关联测评"]').check();
checks.planAssessmentSource = await page.locator('input[name="planSelection"][value="项目B"]').count() === 1;
await page.getByRole('button',{ name:'取消',exact:true }).click();await page.getByRole('button',{name:'确认',exact:true}).click();

await nav('关联规则配置');
await page.getByRole('button',{ name:'新建关联规则',exact:true }).click();
checks.relationProjectSource = await page.locator('#relation-form-project option',{ hasText:'项目B' }).count() === 1;
await page.locator('#relation-form-project').selectOption('项目B');
await page.locator('[data-relation-type][value="脚本导入"]').check();
await page.locator('#relation-form').getByRole('button',{ name:/保存规则/ }).click();

await nav('计划列表');
await page.getByRole('button',{ name:'新建计划',exact:true }).click();
await page.locator('[data-plan-method][value="选择关联任务规则"]').check();
checks.planRuleSource = await page.locator('input[name="planSelection"][value="项目B · 脚本导入规则"]').count() === 1;

// Reload to prove that project-owned questions and scoring survive persistence.
await page.getByRole('button',{ name:'取消',exact:true }).click();await page.getByRole('button',{name:'确认',exact:true}).click();
await nav('测试项目管理');
await page.reload({ waitUntil:'networkidle' });
rowB = page.locator('#project-rows tr').filter({ hasText:'项目B' });
await rowB.getByRole('button',{ name:'配置题目',exact:true }).click();
checks.persistedAfterReload = await page.getByText('当前压力等级',{ exact:true }).count() === 1 && await page.getByText('1 条跳转',{ exact:true }).count() === 1;

await page.screenshot({ path:path.join(out,'final.png'),fullPage:true });
const result = { checks, allPassed:Object.values(checks).every(Boolean) && errors.length === 0, errors };
fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
await browser.close();
