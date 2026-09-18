import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const out = path.resolve('reference-site','module-interactions');
const browser = await chromium.launch({ headless:true });
const page = await browser.newPage({ viewport:{ width:1440, height:1100 } });
await page.goto('https://mentor-morse-78994253.figma.site/', { waitUntil:'domcontentloaded', timeout:60000 });
await page.getByRole('button', { name:'关联规则配置', exact:true }).click();
await page.getByRole('button', { name:'新建关联规则', exact:true }).click();
await page.getByRole('button', { name:'选择任务', exact:true }).click();
await page.waitForTimeout(500);
const data = await page.evaluate(() => ({
  text:document.body.innerText,
  dialogs:[...document.querySelectorAll('[role="dialog"]')].map((node) => node.innerText),
  controls:[...document.querySelectorAll('input,select,button')].map((node) => ({ tag:node.tagName, type:node.type, text:node.innerText || node.getAttribute('placeholder') || node.getAttribute('aria-label') || '', value:node.value, checked:node.checked }))
}));
fs.writeFileSync(path.join(out,'relation-task-picker.json'),JSON.stringify(data,null,2));
await page.screenshot({ path:path.join(out,'relation-task-picker.png'), fullPage:true });
console.log(JSON.stringify({ dialogs:data.dialogs, controls:data.controls.filter((control) => control.type === 'checkbox' || control.text) },null,2));
await browser.close();
