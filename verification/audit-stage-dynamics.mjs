import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const outputDir=path.resolve('verification','stage-reference');
fs.mkdirSync(outputDir,{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1600,height:1200}});
await page.goto('https://void-ninth-65613617.figma.site/',{waitUntil:'networkidle',timeout:60000});
const openStage=async(planName) => {
  await page.getByRole('button',{name:'计划列表',exact:true}).click();
  await page.locator('tr').filter({hasText:planName}).locator('button[title="配置关卡"]').click();
  await page.waitForTimeout(250);
};
const capture=async(name) => {
  await page.screenshot({path:path.join(outputDir,`${name}.png`),fullPage:true});
  const data=await page.evaluate(() => ({
    text:document.body.innerText,
    controls:[...document.querySelectorAll('input,select,textarea,button')].slice(13).map((element) => ({
      tag:element.tagName,
      type:element.type || '',
      name:element.name || '',
      value:element.value || '',
      checked:Boolean(element.checked),
      text:(element.innerText || element.getAttribute('title') || element.getAttribute('placeholder') || '').trim(),
      options:element.tagName==='SELECT'?[...element.options].map((option) => ({value:option.value,text:option.text})):[],
    })),
  }));
  fs.writeFileSync(path.join(outputDir,`${name}.json`),JSON.stringify(data,null,2));
  return {text:data.text.slice(-10000),controls:data.controls};
};

const results={};
await openStage('一年级AI助手培训计划');
await page.locator('select').filter({has:page.locator('option[value="0"]')}).first().selectOption('0');
results.directAssigned=await capture('stage-direct-assigned');
for (const value of ['point-value','task-ratio','point-ratio']) {
  await page.locator(`input[name="unlockRule"][value="${value}"]`).check();
  results[`unlock-${value}`]=await capture(`stage-unlock-${value}`);
}
await page.locator('button:has(svg.lucide-arrow-left)').first().click();

await openStage('春季学习能力测评（草稿）');
await page.locator('input[name="divisionMethod"][value="custom"]').check();
results.assessmentCustom=await capture('stage-assessment-custom');
await page.locator('button:has(svg.lucide-arrow-left)').first().click();

await openStage('个性化学习干预计划（草稿）');
await page.locator('input[name="divisionMethod"][value="by-association-rule"]').check();
results.relationGrouped=await capture('stage-relation-grouped');
await page.locator('input[name="divisionMethod"][value="custom"]').check();
results.relationCustom=await capture('stage-relation-custom');

console.log(JSON.stringify(results,null,2));
await browser.close();
