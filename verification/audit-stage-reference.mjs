import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const outputDir=path.resolve('verification','stage-reference');
fs.mkdirSync(outputDir,{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1600,height:1200}});
await page.goto('https://void-ninth-65613617.figma.site/',{waitUntil:'networkidle',timeout:60000});
const capture=async(name) => {
  await page.screenshot({path:path.join(outputDir,`${name}.png`),fullPage:true});
  const snapshot=await page.evaluate(() => ({
    title:document.title,
    url:location.href,
    text:document.body.innerText,
    controls:[...document.querySelectorAll('button,a,input,select,textarea,[role="button"]')].map((element,index) => ({
      index,
      tag:element.tagName,
      text:(element.innerText || element.getAttribute('aria-label') || element.getAttribute('title') || element.getAttribute('placeholder') || '').trim(),
      type:element.getAttribute('type') || '',
      value:'value' in element ? element.value : '',
      html:element.outerHTML.slice(0,500),
    })),
    rows:[...document.querySelectorAll('tr')].map((row,index) => ({index,text:row.innerText,buttons:[...row.querySelectorAll('button')].map((button) => button.outerHTML.slice(0,500))})),
  }));
  fs.writeFileSync(path.join(outputDir,`${name}.json`),JSON.stringify(snapshot,null,2));
  return snapshot;
};

await capture('landing');
await page.getByRole('button',{name:'计划列表',exact:true}).click();
await page.waitForTimeout(400);
const plans=await capture('plans');
const stagePlans=[
  ['direct','一年级AI助手培训计划'],
  ['assessment','春季学习能力测评（草稿）'],
  ['relation','个性化学习干预计划（草稿）'],
];
const stageSnapshots=[];
for (const [kind,name] of stagePlans) {
  const row=page.locator('tr').filter({hasText:name});
  await row.locator('button[title="配置关卡"]').click();
  await page.waitForTimeout(300);
  stageSnapshots.push([kind,await capture(`stage-${kind}`)]);
  const backButton=page.locator('button:has(svg.lucide-arrow-left)').first();
  if (await backButton.count()) await backButton.click();
  else await page.getByRole('button',{name:'计划列表',exact:true}).click();
  await page.waitForTimeout(200);
}
console.log(JSON.stringify({
  plans:{text:plans.text.slice(0,12000),rows:plans.rows},
  stages:Object.fromEntries(stageSnapshots.map(([kind,snapshot]) => [kind,{text:snapshot.text.slice(-12000),controls:snapshot.controls.slice(13)}])),
},null,2));
await browser.close();
