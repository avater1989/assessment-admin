import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const outputDir=path.resolve('verification','stage-configs');
fs.mkdirSync(outputDir,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1500,height:1200}});
const page=await context.newPage();
const errors=[];
page.on('pageerror',(error) => errors.push(error.message));
page.on('console',(message) => { if (message.type()==='error') errors.push(message.text()); });
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
await page.evaluate(() => localStorage.clear());
await page.reload({waitUntil:'networkidle'});
await page.getByRole('button',{name:'计划列表',exact:true}).click();

const checks={};
const directRow=page.locator('#plan-rows tr').filter({hasText:'一年级AI助手培训计划'});
const assessmentRow=page.locator('#plan-rows tr').filter({hasText:'春季学习能力测评（草稿）'});
const relationRow=page.locator('#plan-rows tr').filter({hasText:'个性化学习干预计划（草稿）'});
const supplementaryRow=page.locator('#plan-rows tr').filter({hasText:'学生心理状态快速评估'});
checks.entryByPlanType=await directRow.getByRole('button',{name:'配置关卡'}).count()===1
  &&await assessmentRow.getByRole('button',{name:'配置关卡'}).count()===1
  &&await relationRow.getByRole('button',{name:'配置关卡'}).count()===1
  &&await supplementaryRow.getByRole('button',{name:'配置关卡'}).count()===0;

// Direct task plans: manual pool assignment and all unlock-rule shapes.
await directRow.getByRole('button',{name:'配置关卡'}).click();
checks.directShape=await page.getByText('手动分配任务到关卡',{exact:true}).count()>=1
  &&await page.locator('[data-stage-task-assignment]').count()===1
  &&await page.locator('.stage-editor-card').count()===1;
await page.getByRole('button',{name:'线上课',exact:true}).click();
checks.taskFilter=await page.locator('[data-stage-pool]:visible').count()===0;
await page.getByRole('button',{name:'全部',exact:true}).click();
await page.locator('[data-stage-task-assignment]').selectOption('0');
checks.taskAssigned=await page.getByText('已分配到关卡 1',{exact:true}).count()===1;
const unlockDefaults={ 'point-value':'100','task-ratio':'80','point-ratio':'70' };
for (const [type,value] of Object.entries(unlockDefaults)) {
  await page.locator(`input[name="stageUnlockRule"][value="${type}"]`).check();
  checks[`unlock_${type}`]=await page.locator('#stage-unlock-value').inputValue()===value;
}
await page.locator('input[name="stageUnlockRule"][value="task-ratio"]').check();
await page.locator('#stage-unlock-value').fill('75');
checks.livePreview=(await page.locator('#stage-preview').innerText()).includes('75%');
await page.getByRole('button',{name:'保存配置',exact:true}).click();
checks.directSaved=await page.getByText('关卡配置已保存',{exact:true}).count()>=1;

// Assessment plans: split by question count and custom import are both available.
await assessmentRow.getByRole('button',{name:'配置关卡'}).click();
checks.assessmentShape=await page.locator('input[name="stageDivisionMethod"][value="by-question"]').isChecked()
  &&await page.locator('#stage-question-size').inputValue()==='10'
  &&await page.locator('.stage-editor-card').count()===3;
await page.locator('#stage-question-size').fill('15');
await page.locator('#stage-question-size').blur();
checks.questionAutoSplit=await page.locator('.stage-editor-card').count()===2
  &&(await page.locator('.stage-editor-card').last().innerText()).includes('第 16-30 题');
await page.locator('input[name="stageDivisionMethod"][value="custom"]').check();
checks.customImportShape=await page.getByText('选择规则文件',{exact:true}).count()===1&&await page.locator('#stage-custom-json').count()===1;
await page.getByRole('button',{name:'加载示例',exact:true}).click();
checks.customExample=await page.locator('.stage-editor-card').count()===3&&await page.locator('[data-stage-name]').last().inputValue()==='实践关';
await page.locator('input[name="stageDivisionMethod"][value="by-question"]').check();
await page.locator('#stage-question-size').fill('15');
await page.locator('#stage-question-size').blur();
await page.locator('[data-stage-name]').first().fill('基础测评关');
await page.getByRole('button',{name:'保存配置',exact:true}).click();
checks.assessmentSaved=await page.getByText('关卡配置已保存',{exact:true}).count()>=1;

// Association-rule plans: select several rules, group them, and use a points threshold.
await relationRow.getByRole('button',{name:'配置关卡'}).click();
checks.relationShape=await page.locator('input[name="stageDivisionMethod"][value="by-association-rule"]').isChecked()
  &&await page.locator('[data-stage-rule]').count()>=4;
const uncheckedRule=page.locator('[data-stage-rule]:not(:checked)').first();
const selectedRule=await uncheckedRule.inputValue();
await page.locator(`[data-stage-rule][value="${selectedRule}"]`).check();
await page.getByRole('button',{name:'+ 添加关卡',exact:true}).click();
await page.locator(`[data-stage-rule-assignment][data-item="${selectedRule}"]`).selectOption('1');
checks.ruleGrouped=(await page.locator('.stage-editor-card').nth(1).innerText()).includes(selectedRule);
await page.locator('input[name="stageDivisionMethod"][value="custom"]').check();
await page.locator('#stage-custom-json').fill(JSON.stringify({stages:[{name:'规则首关',items:['规则A']},{name:'规则复核关',items:['规则B']}]}));
await page.getByRole('button',{name:'解析并生成关卡',exact:true}).click();
checks.manualJsonImport=await page.locator('.stage-editor-card').count()===2&&await page.locator('[data-stage-name]').first().inputValue()==='规则首关';
await page.locator('input[name="stageDivisionMethod"][value="by-association-rule"]').check();
await page.locator('input[name="stageUnlockRule"][value="point-value"]').check();
await page.locator('#stage-unlock-value').fill('150');
await page.screenshot({path:path.join(outputDir,'relation-grouping.png'),fullPage:true});
await page.getByRole('button',{name:'保存配置',exact:true}).click();
checks.relationSaved=await page.getByText('关卡配置已保存',{exact:true}).count()>=1;

await page.reload({waitUntil:'networkidle'});
await page.getByRole('button',{name:'计划列表',exact:true}).click();
await page.locator('#plan-rows tr').filter({hasText:'个性化学习干预计划（草稿）'}).getByRole('button',{name:'配置关卡'}).click();
checks.persisted=await page.locator('input[name="stageUnlockRule"][value="point-value"]').isChecked()
  &&await page.locator('#stage-unlock-value').inputValue()==='150'
  &&await page.locator('[data-stage-rule]:checked').count()===2;

checks.errors=errors;
checks.allPassed=Object.entries(checks).filter(([key]) => key!=='errors').every(([,value]) => value===true)&&errors.length===0;
fs.writeFileSync(path.join(outputDir,'result.json'),JSON.stringify(checks,null,2));
console.log(JSON.stringify(checks,null,2));
await browser.close();
