import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const out=path.resolve('reference-site','module-interactions');
const browser=await chromium.launch({headless:true});
for(const [mode,id] of [['直接选择任务','task-based'],['关联测评','assessment-based'],['选择关联任务规则','association-rule-based'],['选择补充测评','supplementary']]){
 const page=await browser.newPage({viewport:{width:1440,height:1500}});await page.goto('https://mentor-morse-78994253.figma.site/',{waitUntil:'domcontentloaded',timeout:60000});await page.getByRole('button',{name:'计划列表',exact:true}).click();await page.getByRole('button',{name:'新建计划',exact:true}).click();await page.locator(`input[name="creationMethod"][value="${id}"]`).check();await page.waitForTimeout(300);
 const data=await page.evaluate(()=>({text:document.body.innerText,controls:[...document.querySelectorAll('input,textarea,select,button')].map((n)=>({tag:n.tagName,type:n.type,name:n.name,text:n.innerText||n.placeholder||n.getAttribute('aria-label')||'',value:n.value,checked:n.checked,options:n.tagName==='SELECT'?[...n.options].map(o=>o.textContent):[]}))}));
 fs.writeFileSync(path.join(out,`plan-mode-${id}.json`),JSON.stringify(data,null,2));await page.screenshot({path:path.join(out,`plan-mode-${id}.png`),fullPage:true});console.log(`\n===== ${mode} =====\n${data.text.slice(data.text.indexOf('创建方式'),data.text.length)}\nCONTROLS\n${JSON.stringify(data.controls.filter(c=>!['button','submit'].includes(c.type)),null,2)}`);await page.close();
}
await browser.close();
