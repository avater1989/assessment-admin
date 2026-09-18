import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const out=path.resolve('verification','p0-guards');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1500,height:1200}});const errors=[];
page.on('pageerror',(error)=>errors.push(error.message));page.on('console',(message)=>{if(message.type()==='error')errors.push(message.text());});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'networkidle'});
const checks={};const nav=async(name)=>page.getByRole('button',{name,exact:true}).click();

// Project publish readiness and lifecycle consistency.
let project=page.locator('#project-rows tr').filter({hasText:'心理健康测评'});await project.getByRole('button',{name:'上架',exact:true}).click();
project=page.locator('#project-rows tr').filter({hasText:'心理健康测评'});checks.projectPublishReady=(await project.innerText()).includes('已发布')&&(await project.innerText()).includes('已上架');

// Missing source projects block a series from going live.
await nav('系列测评管理');const missingSeries=page.locator('#series-rows tr').filter({hasText:'职业规划系列测评'});await missingSeries.getByRole('button',{name:'上架',exact:true}).click();
checks.seriesReferenceGuard=(await page.locator('.readiness-list').innerText()).includes('引用的项目不存在');await page.getByRole('button',{name:'我知道了',exact:true}).click();

// Published plans are read-only, while all common fields on a draft survive editing.
await nav('计划列表');let assessmentPlan=page.locator('#plan-rows tr').filter({hasText:'2025春季心理健康测评计划'});checks.publishedPlanReadOnly=await assessmentPlan.getByRole('button',{name:'编辑计划'}).count()===0;
let editablePlan=page.locator('#plan-rows tr').filter({hasText:'一年级AI助手培训计划'});await editablePlan.getByRole('button',{name:'编辑计划'}).click();
await page.locator('#plan-form [name="start"]').fill('2025-03-01');await page.locator('#plan-form [name="end"]').fill('2025-06-30');
checks.planFieldsRestored=await page.locator('#plan-form input[name="groups"][value="一年级全体学生"]').isChecked();await page.locator('#plan-form').getByRole('button',{name:'保存计划',exact:true}).click();
checks.planFieldsPreserved=await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('assessment-admin-state')).planItems.find((item)=>item.name==='一年级AI助手培训计划');return p.start==='2025-03-01'&&p.end==='2025-06-30'&&p.groups.includes('一年级全体学生');});

// A draft with missing content and stages cannot publish.
const invalidPlan=page.locator('#plan-rows tr').filter({hasText:'春季学习能力测评（草稿）'});await invalidPlan.getByRole('button',{name:'发布计划'}).click();
const invalidIssues=await page.locator('.readiness-list').innerText();checks.planReadinessGuard=invalidIssues.includes('关联的测评内容不存在')&&invalidIssues.includes('尚未配置关卡');await page.getByRole('button',{name:'我知道了',exact:true}).click();

// Assessment gates use question semantics and reject impossible thresholds.
await invalidPlan.getByRole('button',{name:'配置关卡'}).click();checks.assessmentUnlockSemantics=await page.locator('input[name="stageUnlockRule"][value="question-count"]').isChecked()&&await page.locator('input[name="stageUnlockRule"][value="task-count"]').count()===0;
await page.locator('#stage-unlock-value').fill('20');await page.getByRole('button',{name:'保存配置',exact:true}).click();checks.impossibleGateBlocked=(await page.locator('.readiness-list').innerText()).includes('最多可完成 10 题');await page.getByRole('button',{name:'我知道了',exact:true}).click();
await page.locator('#stage-unlock-value').fill('10');await page.getByRole('button',{name:'保存配置',exact:true}).click();checks.validGateSaved=await page.getByText('关卡配置已保存',{exact:true}).count()===1;

// Rich stage configuration survives a subsequent plan edit.
let direct=page.locator('#plan-rows tr').filter({hasText:'一年级AI助手培训计划'});await direct.getByRole('button',{name:'配置关卡'}).click();await page.locator('[data-stage-task-assignment]').selectOption('0');await page.locator('input[name="stageUnlockRule"][value="point-value"]').check();await page.locator('#stage-unlock-value').fill('150');await page.getByRole('button',{name:'保存配置',exact:true}).click();
direct=page.locator('#plan-rows tr').filter({hasText:'一年级AI助手培训计划'});await direct.getByRole('button',{name:'编辑计划'}).click();await page.locator('#plan-form').getByRole('button',{name:'保存计划',exact:true}).click();checks.stageConfigPreserved=await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('assessment-admin-state')).planItems.find((item)=>item.name==='一年级AI助手培训计划');return p.stageConfig?.unlockRule?.type==='point-value'&&p.stageConfig.unlockRule.value===150;});
direct=page.locator('#plan-rows tr').filter({hasText:'一年级AI助手培训计划'});await direct.getByRole('button',{name:'发布计划'}).click();checks.readyPlanCanPublish=(await page.locator('#plan-rows tr').filter({hasText:'一年级AI助手培训计划'}).innerText()).includes('已发布');

// Reports consume explicit real dimensions and disclose missing fields.
await nav('测评结果');let result=page.locator('#result-rows tr').filter({hasText:'心理健康测评'});await result.getByRole('button',{name:'查看',exact:true}).click();checks.realDimensionsUsed=await page.getByText('71',{exact:true}).count()>=1&&await page.getByText('62',{exact:true}).count()>=1&&await page.getByText('84',{exact:true}).count()>=1;await page.getByRole('button',{name:'关闭',exact:true}).click();
result=page.locator('#result-rows tr').filter({hasText:'大五人格测试'}).first();await result.getByRole('button',{name:'查看',exact:true}).click();checks.missingRealDataDisclosed=await page.getByText(/缺少维度得分/).count()===1;

checks.errors=errors;checks.allPassed=Object.entries(checks).filter(([key])=>key!=='errors').every(([,value])=>value===true)&&errors.length===0;
fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(checks,null,2));console.log(JSON.stringify(checks,null,2));await browser.close();
