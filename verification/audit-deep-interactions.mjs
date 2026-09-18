import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const out=path.resolve('verification','interaction-audit');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});
async function pageAt(actions=[]){const page=await browser.newPage({viewport:{width:1440,height:1200}});await page.goto('https://mentor-morse-78994253.figma.site/',{waitUntil:'domcontentloaded',timeout:60000});for(const action of actions){const locator=action.role? page.getByRole(action.role,{name:action.name,exact:true}):page.locator(action.selector).nth(action.index||0);await locator.click();await page.waitForTimeout(250);}return page;}
async function dump(page,id){const data=await page.evaluate(()=>({text:document.body.innerText,buttons:[...document.querySelectorAll('button')].map((b)=>({text:b.innerText.trim(),svg:b.querySelector('svg')?.getAttribute('class')||'',row:b.closest('tr')?.innerText.slice(0,240)||''})),controls:[...document.querySelectorAll('input,textarea,select')].map((n)=>({tag:n.tagName,type:n.type,placeholder:n.placeholder,value:n.value,options:n.tagName==='SELECT'?[...n.options].map(o=>o.textContent):[]}))}));fs.writeFileSync(path.join(out,`${id}.json`),JSON.stringify(data,null,2));console.log(`\n===== ${id} =====\n${data.text.slice(-5000)}\nBUTTONS\n${JSON.stringify(data.buttons.filter(b=>b.row||b.text).slice(-30),null,2)}\nCONTROLS\n${JSON.stringify(data.controls.slice(-30),null,2)}`);await page.close();}
{
 const page=await pageAt();const data=await page.evaluate(()=>[...document.querySelectorAll('button')].map((b)=>({text:b.innerText.trim(),svg:b.querySelector('svg')?.getAttribute('class')||'',row:b.closest('tr')?.innerText||''})).filter(x=>x.row));console.log('\n===== project-row-buttons =====\n'+JSON.stringify(data,null,2));await page.close();
}
for(const tab of ['题目组合评分','自定义脚本']){const page=await pageAt([{role:'button',name:'评分规则'},{role:'tab',name:tab}]);await dump(page,`scoring-${tab==='题目组合评分'?'combination':'script'}`);}
{
 const page=await pageAt([{role:'button',name:'配置题目'}]);const buttons=page.locator('button').filter({has:page.locator('svg.lucide-workflow')});if(await buttons.count())await buttons.first().click();await dump(page,'question-individual-jump');
}
{
 const page=await pageAt([{role:'button',name:'系列测评管理'},{role:'button',name:'新建系列'},{role:'button',name:'添加项目'}]);await dump(page,'series-project-picker');
}
{
 const page=await pageAt([{role:'button',name:'报告模板管理（待研究）'},{role:'button',name:'新建模板'},{role:'button',name:'添加自定义字段'}]);await dump(page,'template-custom-field');
}
{
 const page=await pageAt([{role:'button',name:'测评上下架管理'},{role:'button',name:'已上架测评排序'}]);await dump(page,'publishing-sort');
}
await browser.close();
