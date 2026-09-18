import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const out = path.resolve('reference-site','module-interactions');
const browser = await chromium.launch({ headless:true });

async function capture(mode,id) {
  const page = await browser.newPage({ viewport:{ width:1440,height:1250 } });
  await page.goto('https://mentor-morse-78994253.figma.site/', { waitUntil:'domcontentloaded',timeout:60000 });
  await page.getByRole('button',{ name:'关联规则配置',exact:true }).click();
  await page.getByRole('button',{ name:'新建关联规则',exact:true }).click();
  const radio = page.locator(`input[type="radio"][value="${id}"]`);
  await radio.check();
  await page.waitForTimeout(350);
  const data = await page.evaluate(() => ({
    text:document.body.innerText,
    controls:[...document.querySelectorAll('input,textarea,select,button')].map((node) => ({ tag:node.tagName,type:node.type,name:node.name,text:node.innerText || node.getAttribute('placeholder') || node.getAttribute('aria-label') || '',value:node.value,checked:node.checked,options:node.tagName==='SELECT'?[...node.options].map((option)=>option.textContent):[] }))
  }));
  fs.writeFileSync(path.join(out,`relation-mode-${id}.json`),JSON.stringify(data,null,2));
  await page.screenshot({ path:path.join(out,`relation-mode-${id}.png`),fullPage:true });
  console.log(`\n===== ${mode} =====\n` + data.text.slice(data.text.indexOf('触发条件配置'),data.text.indexOf('关联任务')));
  console.log(JSON.stringify(data.controls.filter((control)=>!['button','submit'].includes(control.type) || ['导入脚本','导出模板'].some((text)=>control.text.includes(text))),null,2));
  await page.close();
}

await capture('维度得分','dimension');
await capture('选项匹配','option');
await capture('脚本导入','script');
await browser.close();
