import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const out=path.resolve('verification','p1-guards');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1500,height:1200}});const errors=[];
page.on('pageerror',(error)=>errors.push(error.message));page.on('console',(message)=>{if(message.type()==='error')errors.push(message.text());});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'networkidle'});
const checks={};const nav=async(name)=>page.getByRole('button',{name,exact:true}).click();

// Scoring edits are isolated until Save, and navigation asks before discarding them.
let project=page.locator('#project-rows tr').filter({hasText:'心理健康测评'});await project.getByRole('button',{name:'评分规则',exact:true}).click();
await page.locator('[data-score-field="title"]').first().fill('未保存标题');await nav('计划列表');
checks.scoringLeaveGuard=await page.getByText('放弃评分规则修改',{exact:true}).count()===1;await page.getByRole('button',{name:'确认',exact:true}).click();
checks.scoringDiscarded=await page.evaluate(()=>JSON.parse(localStorage.getItem('assessment-admin-state')).projects[0].scoring.segments[0].title==='低风险');
await nav('测试项目管理');project=page.locator('#project-rows tr').filter({hasText:'心理健康测评'});await project.getByRole('button',{name:'评分规则',exact:true}).click();await page.locator('[data-score-field="title"]').first().fill('已保存标题');await page.getByRole('button',{name:'保存配置',exact:true}).click();
checks.scoringCommitted=await page.evaluate(()=>JSON.parse(localStorage.getItem('assessment-admin-state')).projects[0].scoring.segments[0].title==='已保存标题');
const segmentCount=await page.locator('.segment').count();await page.getByRole('button',{name:'删除分段'}).first().click();checks.scoreDeleteConfirm=await page.getByText('删除评分分段',{exact:true}).count()===1;await page.keyboard.press('Escape');checks.scoreDeleteCancelable=await page.locator('.segment').count()===segmentCount;

// Jump rules also use a draft; cancel does not leak mutations, Save commits valid rules.
await nav('测试项目管理');project=page.locator('#project-rows tr').filter({hasText:'心理健康测评'});await project.getByRole('button',{name:'配置题目',exact:true}).click();await page.getByRole('button',{name:/整体跳转规则配置/}).click();await page.getByRole('button',{name:/添加规则/}).click();await page.getByRole('button',{name:'取消',exact:true}).click();
checks.jumpDiscardGuard=await page.getByText('放弃未保存修改',{exact:true}).count()===1;await page.getByRole('button',{name:'确认',exact:true}).click();
checks.jumpDiscarded=await page.evaluate(()=>JSON.parse(localStorage.getItem('assessment-admin-state')).projects[0].jumpRules.length===0);
await page.getByRole('button',{name:/整体跳转规则配置/}).click();await page.getByRole('button',{name:/添加规则/}).click();await page.locator('[data-rule-field="action"]').selectOption('finish');await page.getByRole('button',{name:'保存配置',exact:true}).click();
checks.jumpCommitted=await page.evaluate(()=>JSON.parse(localStorage.getItem('assessment-admin-state')).projects[0].jumpRules.length===1);

// Published plans are read-only; termination is confirmed and cancelable.
await nav('计划列表');let published=page.locator('#plan-rows tr').filter({hasText:'2025春季心理健康测评计划'});
checks.publishedReadOnly=await published.getByRole('button',{name:'编辑计划'}).count()===0;
await published.getByRole('button',{name:'终止计划'}).click();checks.terminateConfirm=await page.getByText('终止计划',{exact:true}).count()===1;await page.keyboard.press('Escape');
checks.terminateCancelable=(await published.innerText()).includes('已发布');await published.getByRole('button',{name:'终止计划'}).click();await page.getByRole('button',{name:'确认',exact:true}).click();published=page.locator('#plan-rows tr').filter({hasText:'2025春季心理健康测评计划'});checks.terminated=(await published.innerText()).includes('已终止');

// Build one real scoring dimension, then ensure dimension rules reference it rather than question ranges.
await nav('测试项目管理');project=page.locator('#project-rows tr').filter({hasText:'心理健康测评'});await project.getByRole('button',{name:'评分规则',exact:true}).click();await page.locator('[data-score-tab="questions"]').click();await page.getByRole('button',{name:/添加分组/}).click();await page.getByRole('button',{name:/选择题目/}).click();await page.locator('input[name="scoreQuestion"]').first().check();await page.getByRole('button',{name:'确认选择',exact:true}).click();await page.getByRole('button',{name:'保存配置',exact:true}).click();
await nav('关联规则配置');await page.getByRole('button',{name:'新建关联规则',exact:true}).click();await page.locator('#relation-form-project').selectOption('心理健康测评');await page.locator('[data-relation-type][value="维度得分"]').check();
checks.realDimensionSelector=await page.locator('#condition-dimension').count()===1&&await page.locator('#condition-from').count()===0&&(await page.locator('#condition-dimension option').allTextContents()).includes('维度 1');
await page.locator('#condition-dimension').selectOption('维度 1');await page.locator('#condition-min').fill('1');await page.locator('#condition-max').fill('3');await page.getByRole('button',{name:/添加条件/}).click();await page.locator('#condition-dimension').selectOption('维度 1');await page.locator('#condition-min').fill('4');await page.locator('#condition-max').fill('6');await page.getByRole('button',{name:/添加条件/}).click();
checks.multiConditionLogic=await page.locator('#relation-logic').count()===1;await page.locator('#relation-logic').selectOption('ANY');checks.priorityField=await page.locator('[name="priority"]').inputValue()==='100';
await page.getByRole('button',{name:/选择任务/}).click();await page.locator('input[name="tasks"]').first().check();await page.getByRole('button',{name:/确认选择/}).click();await page.locator('[name="priority"]').fill('5');await page.locator('#relation-form').getByRole('button',{name:/保存规则/}).click();
checks.relationMetadataSaved=await page.evaluate(()=>{const item=JSON.parse(localStorage.getItem('assessment-admin-state')).relationItems.at(-1);return item.logic==='ANY'&&item.priority===5&&item.conditions.every((condition)=>condition.dimension==='维度 1');});

// Script validation rejects missing condition payloads and empty task lists.
await page.getByRole('button',{name:'新建关联规则',exact:true}).click();await page.locator('#relation-form-project').selectOption('心理健康测评');await page.locator('[data-relation-type][value="脚本导入"]').check();await page.locator('#relation-script').fill('[{"type":"dimension","dimension":"维度 1","minScore":1,"tasks":[]}]');await page.getByRole('button',{name:'验证脚本',exact:true}).click();checks.strictScriptValidation=await page.getByText(/至少需要一个任务/).count()===1;await page.keyboard.press('Escape');await page.getByRole('button',{name:'确认',exact:true}).click();

// Destructive question deletion is confirmable and Escape restores the page unchanged.
await nav('测试项目管理');project=page.locator('#project-rows tr').filter({hasText:'心理健康测评'});await project.getByRole('button',{name:'配置题目',exact:true}).click();await page.getByRole('button',{name:'删除题目'}).first().click();checks.questionDeleteConfirm=await page.getByText('删除题目',{exact:true}).count()===1;await page.keyboard.press('Escape');checks.escapeClosesConfirm=await page.locator('.question-row').count()===1;

// Typed modal changes are protected, and Escape can restore then discard the draft.
await nav('计划列表');await page.getByRole('button',{name:'新建计划',exact:true}).click();await page.getByPlaceholder('请输入计划名称').fill('未保存计划');await page.keyboard.press('Escape');checks.modalLeaveGuard=await page.getByText('放弃未保存修改',{exact:true}).count()===1;await page.keyboard.press('Escape');checks.escapeRestoresModal=await page.getByPlaceholder('请输入计划名称').inputValue()==='未保存计划';await page.keyboard.press('Escape');await page.getByRole('button',{name:'确认',exact:true}).click();checks.modalDiscarded=await page.locator('#plan-form').count()===0;

checks.errors=errors;checks.allPassed=Object.entries(checks).filter(([key])=>key!=='errors').every(([,value])=>value===true)&&errors.length===0;
await page.screenshot({path:path.join(out,'final.png'),fullPage:true});fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(checks,null,2));console.log(JSON.stringify(checks,null,2));await browser.close();
