import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const out=path.resolve('verification','relation-modes');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:1440,height:1200}});const page=await context.newPage();
const errors=[];page.on('pageerror',(error)=>errors.push(error.message));page.on('console',(message)=>{if(message.type()==='error')errors.push(message.text());});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'networkidle'});
let project=page.locator('#project-rows tr').filter({hasText:'心理健康测评'});await project.getByRole('button',{name:'评分规则',exact:true}).click();await page.locator('[data-score-tab="questions"]').click();await page.getByRole('button',{name:/添加分组/}).click();await page.getByRole('button',{name:/选择题目/}).click();await page.locator('input[name="scoreQuestion"]').check();await page.getByRole('button',{name:'确认选择',exact:true}).click();await page.getByRole('button',{name:'保存配置',exact:true}).click();
await page.getByRole('button',{name:'关联规则配置',exact:true}).click();await page.getByRole('button',{name:'新建关联规则',exact:true}).click();await page.locator('#relation-form-project').selectOption('心理健康测评');
const checks={};

await page.locator('input[name="type"][value="维度得分"]').check();
checks.dimensionFields=await page.locator('#condition-dimension,#condition-min,#condition-max').count()===3&&await page.locator('#condition-from').count()===0;
await page.locator('#condition-dimension').selectOption('维度 1');await page.locator('#condition-min').fill('60');await page.locator('#condition-max').fill('80');await page.getByRole('button',{name:'添加条件',exact:true}).click();
checks.dimensionAdded=(await page.locator('.condition-item').textContent()).includes('维度 1得分 60–80 分');

await page.locator('input[name="type"][value="选项匹配"]').check();
await page.locator('#condition-question').selectOption('q1');
checks.optionDynamic=await page.locator('#condition-option option').count()===5 && await page.locator('#condition-option').isEnabled();
await page.locator('#condition-option').selectOption({label:'经常'});await page.getByRole('button',{name:'添加条件',exact:true}).click();
checks.optionAdded=(await page.locator('.condition-item').textContent()).includes('经常');

await page.locator('input[name="type"][value="脚本导入"]').check();
checks.scriptMode=await page.locator('#relation-script').isVisible() && await page.locator('#relation-visual-tasks').isHidden();
await page.getByRole('button',{name:'加载模板',exact:true}).click();
checks.templateLoaded=(await page.locator('#relation-script').inputValue()).includes('score_range');
await page.getByRole('button',{name:'验证脚本',exact:true}).click();
checks.scriptValidated=await page.getByText(/脚本验证通过/).isVisible();
await page.locator('#relation-form select[name="project"]').selectOption({label:'学习能力测评'});
await page.getByRole('button',{name:'保存规则',exact:true}).click();
checks.scriptSaved=await page.getByText('已导入 3 条脚本规则',{exact:true}).count()===1;
checks.scriptTasksDerived=await page.locator('#relation-rows tr').last().textContent().then((text)=>text.includes('放松训练课程'));
await page.screenshot({path:path.join(out,'script-saved.png'),fullPage:true});
checks.errors=errors;checks.allPassed=Object.entries(checks).filter(([key])=>key!=='errors').every(([,value])=>value===true)&&errors.length===0;
fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(checks,null,2));console.log(JSON.stringify(checks,null,2));await browser.close();
