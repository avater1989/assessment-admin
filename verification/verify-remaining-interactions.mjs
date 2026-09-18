import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const out=path.resolve('verification','remaining');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:1440,height:1200},acceptDownloads:true});const page=await context.newPage();const errors=[];
page.on('pageerror',(error)=>errors.push(error.message));page.on('console',(message)=>{if(message.type()==='error')errors.push(message.text());});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'networkidle'});
const checks={};const nav=async(name)=>page.getByRole('button',{name,exact:true}).click();

// Plan permissions and stage configuration.
await nav('计划列表');
const published=page.locator('#plan-rows tr').filter({hasText:'2025春季心理健康测评计划'});
const ongoing=page.locator('#plan-rows tr').filter({hasText:'六年级毕业生职业规划测评'});
const directDraft=page.locator('#plan-rows tr').filter({hasText:'一年级AI助手培训计划'});
const supplementaryDraft=page.locator('#plan-rows tr').filter({hasText:'学生心理状态快速评估'});
checks.planPermissions=await published.getByRole('button',{name:'编辑计划'}).count()===0&&await published.getByRole('button',{name:'终止计划'}).count()===1&&await ongoing.getByRole('button',{name:'编辑计划'}).count()===0&&await ongoing.getByRole('button',{name:'终止计划'}).count()===1&&await directDraft.getByRole('button',{name:'配置关卡'}).count()===1&&await supplementaryDraft.getByRole('button',{name:'配置关卡'}).count()===0;
await directDraft.getByRole('button',{name:'配置关卡'}).click();
await page.locator('[data-stage-task-assignment]').first().selectOption('0');
await page.locator('input[name="stageUnlockRule"][value="task-ratio"]').check();
await page.locator('#stage-unlock-value').fill('75');
await page.getByRole('button',{name:'保存配置',exact:true}).click();
checks.stageSaved=await page.getByText('关卡配置已保存',{exact:true}).count()===1;

// Profile tags: union/intersection, category and multiple tags.
await page.getByRole('button',{name:'新建计划',exact:true}).click();
await page.getByPlaceholder('请输入计划名称').fill('画像标签计划');
await page.locator('input[name="planSelection"]').first().check();
await page.locator('input[name="targetMethod"][value="画像标签"]').check();
await page.locator('input[name="profileMode"][value="交集"]').check();
await page.locator('#profile-tag-category').selectOption('心理健康');
await page.locator('input[name="profileTags"][value="焦虑倾向"]').check();
await page.locator('input[name="profileTags"][value="抑郁倾向"]').check();
await page.getByRole('button',{name:'保存计划',exact:true}).click();
checks.profileTags=await page.getByText('画像标签计划',{exact:true}).count()===1;

// Series picker search/add/order/remove.
await nav('测试项目管理');await page.getByRole('button',{name:'新建项目',exact:true}).click();await page.locator('#project-form [name="name"]').fill('职业兴趣测评');await page.locator('#project-form [name="type"]').selectOption('独立测评');await page.locator('#project-form').getByRole('button',{name:/创建项目/}).click();
let careerProject=page.locator('#project-rows tr').filter({hasText:'职业兴趣测评'});await careerProject.getByRole('button',{name:'配置题目',exact:true}).click();await page.getByRole('button',{name:'新建题目',exact:true}).click();await page.locator('#question-form [name="content"]').fill('你更偏好哪类活动？');await page.locator('#question-form').getByRole('button',{name:'保存',exact:true}).click();await page.getByRole('button',{name:'返回项目列表',exact:true}).click();careerProject=page.locator('#project-rows tr').filter({hasText:'职业兴趣测评'});await careerProject.getByRole('button',{name:'上架',exact:true}).click();
await nav('系列测评管理');await page.getByRole('button',{name:'新建系列',exact:true}).click();
await page.getByPlaceholder('如：综合心理健康评估').fill('交互系列');
await page.locator('#series-project-search').fill('心理健康');
await page.locator('[data-action="add-series-project"][data-name="心理健康测评"]').click();
await page.locator('#series-project-search').fill('职业兴趣');
await page.locator('[data-action="add-series-project"][data-name="职业兴趣测评"]').click();
checks.seriesPicker=await page.locator('.series-selected').count()===2;
await page.getByRole('button',{name:'上移系列项目'}).last().click();
checks.seriesOrder=(await page.locator('input[name="projects"]').first().inputValue())==='职业兴趣测评';
await page.locator('#series-form').getByRole('button',{name:'保存',exact:true}).click();

// Series association exposes only the two valid modes.
await nav('关联规则配置');await page.getByRole('button',{name:'新建关联规则',exact:true}).click();
await page.locator('#relation-form-project').selectOption('交互系列');
checks.seriesRelationModes=await page.locator('[data-relation-type-label]:visible').count()===2&&await page.locator('[data-relation-type][value="按照测评项目任务关联"]').isChecked();
checks.seriesTasksAutoDerived=await page.locator('#relation-visual-tasks').isHidden();await page.locator('#relation-form').getByRole('button',{name:/保存规则/}).click();
checks.seriesRelationSaved=await page.getByText('交互系列',{exact:true}).count()>0;

// Shelf state and display order now live with their owning project/series modules.
checks.publishingModuleRemoved=await page.getByRole('button',{name:'测评上下架管理',exact:true}).count()===0;
await nav('测试项目管理');const psychologyRow=page.locator('#project-rows tr').filter({hasText:'心理健康测评'});await psychologyRow.getByRole('button',{name:'上架',exact:true}).click();
await page.locator('#project-shelf').selectOption('已上架');checks.projectShelfIntegrated=await page.locator('#project-rows tr:visible').count()===2&&await psychologyRow.getAttribute('data-project-shelf')==='已上架';
await nav('系列测评管理');let interactionSeries=page.locator('#series-rows tr').filter({hasText:'交互系列'});await interactionSeries.getByRole('button',{name:'上架',exact:true}).click();
interactionSeries=page.locator('#series-rows tr').filter({hasText:'交互系列'});checks.seriesShelfIntegrated=await interactionSeries.getAttribute('data-shelf')==='已上架';
await interactionSeries.getByRole('button',{name:'上移系列',exact:true}).click();checks.seriesDisplayOrder=(await page.locator('#series-rows tr').nth(1).innerText()).includes('交互系列');

// Reports are code-owned; projects only bind a registered renderer and version.
await nav('测试项目管理');const reportProject=page.locator('#project-rows tr').filter({hasText:'心理健康测评'});await reportProject.getByRole('button',{name:'报告配置',exact:true}).click();
await page.locator('#report-config-key').selectOption('mental-health-v2');await page.getByRole('button',{name:'真实结果预览',exact:true}).click();
checks.realReportPreview=await page.getByText('mental-health-v2',{exact:true}).count()===1&&await page.getByText('真实测评结果',{exact:true}).count()===1;
await page.getByRole('button',{name:'返回配置',exact:true}).click();await page.getByRole('button',{name:'保存项目报告',exact:true}).click();
checks.reportBinding=await reportProject.getByText(/v2 · 心理健康/).count()===1;
checks.reportTemplateModuleRemoved=await page.getByRole('button',{name:'结果报告模板',exact:true}).count()===0;

// Filtered export only contains visible records.
await nav('测评结果');await page.locator('#result-search').fill('张小明');
const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'导出数据',exact:true}).click();const download=await downloadPromise;const exportPath=await download.path();const csv=fs.readFileSync(exportPath,'utf8');
checks.filteredExport=csv.includes('张小明')&&!csv.includes('李小红');

// Task points module has been removed from navigation and runtime state.
checks.pointsModuleRemoved=await page.getByRole('button',{name:'积分规则配置',exact:true}).count()===0;

// Account settings and logout confirmation.
await page.getByRole('button',{name:'管理员',exact:true}).click();await page.getByRole('button',{name:'账户设置',exact:true}).click();await page.locator('#account-form [name="name"]').fill('运营管理员');await page.getByRole('button',{name:'保存账户设置',exact:true}).click();
checks.accountSettings=await page.getByRole('button',{name:'运营管理员',exact:true}).count()===1;await page.getByRole('button',{name:'运营管理员',exact:true}).click();await page.getByRole('button',{name:'退出登录',exact:true}).click();checks.logoutConfirm=await page.getByRole('dialog').getByText(/确定退出/).count()===1;

await page.screenshot({path:path.join(out,'final.png'),fullPage:true});checks.errors=errors;checks.allPassed=Object.entries(checks).filter(([key])=>key!=='errors').every(([,value])=>value===true)&&errors.length===0;fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(checks,null,2));console.log(JSON.stringify(checks,null,2));await browser.close();
