import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const require=createRequire(import.meta.url);const sharp=require('C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const out=path.resolve('verification','reference-audit');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const sites={reference:'https://mentor-morse-78994253.figma.site/',local:'http://127.0.0.1:4173/'};
const states=[
 ['home',[]],['supplementary',[['tab','补充测评']]],['questions',[['button','配置题目']]],['scoring',[['button','评分规则']]],
 ['series',[['button','系列测评管理']]],['reports',[['button','报告模板管理（待研究）']]],['publishing',[['button','测评上下架管理']]],['results',[['button','测评结果']]],['plans',[['button','计划列表']]],['relations',[['button','关联规则配置']]],['points',[['button','积分规则配置']]],
 ['new-project',[['button','新建项目']]],['new-series',[['button','系列测评管理'],['button','新建系列']]],['new-template',[['button','报告模板管理（待研究）'],['button','新建模板']]],['new-plan',[['button','计划列表'],['button','新建计划']]],['new-relation',[['button','关联规则配置'],['button','新建关联规则']]],['new-point',[['button','积分规则配置'],['button','新建积分规则']]],
];
function lines(text){return [...new Set(text.split('\n').map((line)=>line.trim()).filter(Boolean))];}
async function snap(siteName,url,id,actions){
 const context=await browser.newContext({viewport:{width:1440,height:1100},colorScheme:'light'});const page=await context.newPage();const errors=[];page.on('pageerror',(error)=>errors.push(error.message));await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
 for(const [role,name] of actions){const target=page.getByRole(role,{name,exact:true});await target.waitFor({timeout:30000});await target.click();await page.waitForTimeout(180);}
 await page.waitForTimeout(350);const file=path.join(out,`${id}-${siteName}.png`);await page.screenshot({path:file});
 const data=await page.evaluate(()=>({title:document.title,text:document.body.innerText,headings:[...document.querySelectorAll('h1,h2,h3')].map((n)=>n.innerText.trim()).filter(Boolean),buttons:[...document.querySelectorAll('button')].map((n)=>n.innerText.trim()||n.getAttribute('aria-label')).filter(Boolean),placeholders:[...document.querySelectorAll('input,textarea')].map((n)=>n.placeholder).filter(Boolean),selectOptions:[...document.querySelectorAll('select')].map((n)=>[...n.options].map((o)=>o.textContent.trim())),dialogs:document.querySelectorAll('[role="dialog"]').length}));data.errors=errors;await context.close();return {file,data};
}
async function pixelDiff(a,b){const ia=await sharp(a).removeAlpha().raw().toBuffer({resolveWithObject:true});const ib=await sharp(b).removeAlpha().raw().toBuffer({resolveWithObject:true});let absolute=0,changed=0;for(let i=0;i<ia.data.length;i+=3){const avg=(Math.abs(ia.data[i]-ib.data[i])+Math.abs(ia.data[i+1]-ib.data[i+1])+Math.abs(ia.data[i+2]-ib.data[i+2]))/3;absolute+=avg;if(avg>12)changed++;}const pixels=ia.info.width*ia.info.height;return {mean:Number((absolute/pixels).toFixed(2)),changedPercent:Number((changed/pixels*100).toFixed(2))};}
const report=[];
for(const [id,actions] of states){const reference=await snap('reference',sites.reference,id,actions);const local=await snap('local',sites.local,id,actions);const refLines=lines(reference.data.text),localLines=lines(local.data.text);report.push({id,pixels:await pixelDiff(reference.file,local.file),reference:{headings:reference.data.headings,buttons:reference.data.buttons,placeholders:reference.data.placeholders,selectOptions:reference.data.selectOptions,dialogs:reference.data.dialogs},local:{headings:local.data.headings,buttons:local.data.buttons,placeholders:local.data.placeholders,selectOptions:local.data.selectOptions,dialogs:local.data.dialogs},missingLocally:refLines.filter((line)=>!localLines.includes(line)).slice(0,40),extraLocally:localLines.filter((line)=>!refLines.includes(line)).slice(0,40),errors:[...reference.data.errors,...local.data.errors]});console.log(id,report.at(-1).pixels);}
fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));await browser.close();
