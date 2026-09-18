import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const out=path.resolve('verification','report-renderers');
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1500,height:1200}});
const page=await context.newPage();
const errors=[];
page.on('pageerror',(error)=>errors.push(error.message));
page.on('console',(message)=>{if(message.type()==='error')errors.push(message.text());});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'networkidle'});

const checks={};
checks.templateModuleRemoved=await page.getByRole('button',{name:'结果报告模板',exact:true}).count()===0;
checks.projectLevelLabel=await page.getByRole('columnheader',{name:'项目级报告',exact:true}).count()===1;
const projectRow=page.locator('#project-rows tr').filter({hasText:'心理健康测评'});
checks.projectOwnsReport=await projectRow.getByRole('button',{name:'报告配置',exact:true}).count()===1;
await projectRow.getByRole('button',{name:'报告配置',exact:true}).click();
checks.registryOptions=await page.locator('#report-config-key option').count()===5;
checks.defaultRenderer=await page.locator('#report-config-key').inputValue()==='mental-health-v2';
checks.codeOwnedNotice=await page.getByText(/单道题目只提供计分和维度数据/).count()===1;

await page.locator('#report-config-key').selectOption('career-profile-v1');
checks.definitionUpdated=await page.getByText('career-profile-v1',{exact:true}).count()===1&&await page.getByText(/职业类型画像/).count()===1;
await page.getByRole('button',{name:'模拟预览',exact:true}).click();
checks.careerRenderer=await page.getByText('职业兴趣画像',{exact:true}).count()===1&&await page.getByText('career-profile-v1',{exact:true}).count()===1;
await page.screenshot({path:path.join(out,'career-preview.png'),fullPage:true});
await page.getByRole('button',{name:'返回配置',exact:true}).click();
await page.getByRole('button',{name:'保存项目报告',exact:true}).click();
checks.bindingShown=(await projectRow.innerText()).includes('职业画像报告')&&(await projectRow.innerText()).includes('v1 · 职业发展');

await projectRow.getByRole('button',{name:'报告配置',exact:true}).click();
await page.getByRole('button',{name:'真实结果预览',exact:true}).click();
checks.realDataPreview=await page.getByText('真实测评结果',{exact:true}).count()===1&&await page.getByText(/陈同学/).count()>=1;
await page.getByRole('button',{name:'返回配置',exact:true}).click();
await page.locator('#report-config-form [name="enabled"]').uncheck();
await page.getByRole('button',{name:'保存项目报告',exact:true}).click();
checks.fallbackConfigured=(await projectRow.innerText()).includes('未启用')&&(await projectRow.innerText()).includes('通用兜底报告');

checks.questionsHaveNoReportConfig=await page.evaluate(() => {
  const saved=JSON.parse(localStorage.getItem('assessment-admin-state') || '{}');
  return (saved.projects || []).every((project) => (project.questionItems || []).every((question) => !('report' in question)&&!('reportKey' in question)&&!('reportTemplate' in question)));
});

await page.reload({waitUntil:'networkidle'});
const persistedRow=page.locator('#project-rows tr').filter({hasText:'心理健康测评'});
checks.persisted=(await persistedRow.innerText()).includes('未启用');

await page.getByRole('button',{name:'测评结果',exact:true}).click();
const dedicatedResult=page.locator('#result-rows tr').filter({hasText:'心理健康测评'});
await dedicatedResult.getByRole('button',{name:'查看',exact:true}).click();
checks.resultUsesFallback=await page.getByText('generic-v1',{exact:true}).count()===1;
await page.getByRole('button',{name:'关闭',exact:true}).click();
const legacyResult=page.locator('#result-rows tr').filter({hasText:'大五人格测试'}).first();
await legacyResult.getByRole('button',{name:'查看',exact:true}).click();
checks.unboundProjectFallback=await page.getByText(/未绑定专属前端报告/).count()===1&&await page.getByText('generic-v1',{exact:true}).count()===1;

checks.errors=errors;
checks.allPassed=Object.entries(checks).filter(([key])=>key!=='errors').every(([,value])=>value===true)&&errors.length===0;
fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(checks,null,2));
console.log(JSON.stringify(checks,null,2));
await browser.close();
