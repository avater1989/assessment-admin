import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const out=path.resolve('reference-site','module-interactions');
const browser=await chromium.launch({headless:true});
async function base(mode){const page=await browser.newPage({viewport:{width:1440,height:1300}});await page.goto('https://mentor-morse-78994253.figma.site/',{waitUntil:'domcontentloaded',timeout:60000});await page.getByRole('button',{name:'关联规则配置',exact:true}).click();await page.getByRole('button',{name:'新建关联规则',exact:true}).click();await page.locator(`input[type="radio"][value="${mode}"]`).check();return page;}
async function dump(page,id){await page.waitForTimeout(250);const data=await page.evaluate(()=>({text:document.body.innerText,controls:[...document.querySelectorAll('input,textarea,select,button')].map((n)=>({tag:n.tagName,type:n.type,text:n.innerText||n.placeholder||'',value:n.value,checked:n.checked,options:n.tagName==='SELECT'?[...n.options].map(o=>o.textContent):[]}))}));fs.writeFileSync(path.join(out,`${id}.json`),JSON.stringify(data,null,2));await page.screenshot({path:path.join(out,`${id}.png`),fullPage:true});console.log(`\n===== ${id} =====\n${data.text.slice(-3500)}\n`,JSON.stringify(data.controls.slice(-16),null,2));}
{
 const page=await base('option');
 const selects=page.locator('select'); await selects.nth(1).selectOption({index:1}); await dump(page,'relation-option-question-selected'); await page.close();
}
{
 const page=await base('dimension');
 const numbers=page.locator('input[type="number"]'); await numbers.nth(0).fill('1');await numbers.nth(1).fill('5');await numbers.nth(2).fill('60');await numbers.nth(3).fill('80');await page.getByRole('button',{name:'添加条件',exact:true}).click();await dump(page,'relation-dimension-added');await page.close();
}
{
 const page=await base('script');
 await page.getByRole('button',{name:'加载模板',exact:true}).click(); await dump(page,'relation-script-template'); await page.close();
}
await browser.close();
