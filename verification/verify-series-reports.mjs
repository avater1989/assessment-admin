import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const out=path.resolve('verification','series-reports');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1500,height:1200}});const errors=[];
page.on('pageerror',(error)=>errors.push(error.message));page.on('console',(message)=>{if(message.type()==='error')errors.push(message.text());});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'networkidle'});
const checks={};const nav=async(name)=>page.getByRole('button',{name,exact:true}).click();

await nav('系列测评管理');let row=page.locator('#series-rows tr').filter({hasText:'综合心理健康评估'});
checks.entryVisible=await row.getByRole('button',{name:'报告配置',exact:true}).count()===1&&await page.locator('#series-rows').locator('xpath=../thead').getByText('系列报告',{exact:true}).count()===1;
await row.getByRole('button',{name:'报告配置',exact:true}).click();
checks.seriesSemantics=await page.getByText('系列级报告配置',{exact:true}).count()===1&&await page.getByText('一系列一报告',{exact:true}).count()===1&&await page.getByText(/不会覆盖子项目/).count()===1;
await page.locator('#report-config-key').selectOption('ability-radar-v1');await page.getByRole('button',{name:'模拟预览',exact:true}).click();
checks.preview=await page.getByText('ability-radar-v1',{exact:true}).count()===1;await page.getByRole('button',{name:'返回配置',exact:true}).click();await page.getByRole('button',{name:'保存系列报告',exact:true}).click();
row=page.locator('#series-rows tr').filter({hasText:'综合心理健康评估'});checks.savedInList=(await row.innerText()).includes('能力雷达报告')&&(await row.innerText()).includes('v1 · 能力测评');
checks.persisted=await page.evaluate(()=>JSON.parse(localStorage.getItem('assessment-admin-state')).seriesItems.find((item)=>item.name==='综合心理健康评估').report.key==='ability-radar-v1');

// Editing the series preserves its report binding.
await row.getByRole('button',{name:'编辑系列'}).click();await page.locator('#series-form').getByRole('button',{name:'保存',exact:true}).click();
checks.survivesSeriesEdit=await page.evaluate(()=>JSON.parse(localStorage.getItem('assessment-admin-state')).seriesItems.find((item)=>item.name==='综合心理健康评估').report.key==='ability-radar-v1');

// A completed result whose test is the series uses the series report renderer.
await page.evaluate(()=>{const saved=JSON.parse(localStorage.getItem('assessment-admin-state'));saved.resultItems.push({name:'系列用户',id:'SERIES-001',test:'综合心理健康评估',type:'实名',group:'测试人群',score:'88',dimensionScores:[['综合状态',88]],time:'2026-09-06 10:00',status:'已完成'});localStorage.setItem('assessment-admin-state',JSON.stringify(saved));});await page.reload({waitUntil:'networkidle'});await nav('测评结果');const result=page.locator('#result-rows tr').filter({hasText:'系列用户'});await result.getByRole('button',{name:'查看',exact:true}).click();
checks.resultUsesSeriesReport=await page.getByText('ability-radar-v1',{exact:true}).count()===1&&await page.getByText('综合能力指数',{exact:true}).count()===1;

checks.errors=errors;checks.allPassed=Object.entries(checks).filter(([key])=>key!=='errors').every(([,value])=>value===true)&&errors.length===0;
await page.screenshot({path:path.join(out,'final.png'),fullPage:true});fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(checks,null,2));console.log(JSON.stringify(checks,null,2));await browser.close();
