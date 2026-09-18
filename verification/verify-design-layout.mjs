import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const out=path.resolve('verification','design-layout');
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];
page.on('pageerror',(error)=>errors.push(error.message));
page.on('console',(message)=>{if(message.type()==='error')errors.push(message.text());});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'networkidle'});

const checks={};
const metrics=await page.evaluate(()=>{
  const rect=(selector)=>document.querySelector(selector).getBoundingClientRect();
  return {topbar:rect('.topbar').height,sidebar:rect('.sidebar').width,mainLeft:rect('.main').left};
});
checks.desktopShell=metrics.topbar===56&&metrics.sidebar===208&&metrics.mainLeft===208;
checks.leftMenuHierarchy=await page.locator('.primary-nav-item').count()===0&&await page.locator('.nav-group-toggle').count()===3&&await page.locator('.sidebar .nav-item').count()===5;
checks.allModulesInSidebar=await page.getByRole('button',{name:'测试项目管理',exact:true}).count()===1&&await page.getByRole('button',{name:'计划列表',exact:true}).count()===1&&await page.getByRole('button',{name:'关联规则配置',exact:true}).count()===1;

await page.getByRole('button',{name:'计划列表',exact:true}).click();
checks.planContext=await page.locator('.nav-group.active .nav-group-toggle').getAttribute('title')==='计划管理'&&await page.getByRole('heading',{name:'计划管理',exact:true}).count()===1;
checks.listPattern=await page.locator('.pagination').count()===1&&await page.locator('.table-scroll').count()===1;
await page.getByRole('button',{name:'收起侧边栏',exact:true}).click();
checks.collapsedDesktop=await page.evaluate(()=>document.querySelector('.sidebar').getBoundingClientRect().width===64&&document.querySelector('.main').getBoundingClientRect().left===64);

await page.setViewportSize({width:1024,height:900});
checks.tabletRail=await page.evaluate(()=>document.querySelector('.sidebar').getBoundingClientRect().width===64&&document.querySelector('.main').getBoundingClientRect().left===64);
await page.setViewportSize({width:800,height:900});
await page.waitForTimeout(250);
checks.mobileDrawerClosed=await page.evaluate(()=>document.querySelector('.sidebar').getBoundingClientRect().right<=0&&document.querySelector('.main').getBoundingClientRect().left===0);
await page.getByRole('button',{name:'打开导航',exact:true}).click();
checks.mobileDrawerOpen=await page.evaluate(()=>document.querySelector('.sidebar').getBoundingClientRect().left===0&&Boolean(document.querySelector('.nav-backdrop')));
await page.getByRole('button',{name:'关闭导航',exact:true}).click();

await page.setViewportSize({width:1440,height:1000});
await page.getByRole('button',{name:'展开侧边栏',exact:true}).click();
await page.getByRole('button',{name:'测试项目管理',exact:true}).click();
await page.screenshot({path:path.join(out,'projects-1440.png'),fullPage:true});
checks.errors=errors;
checks.allPassed=Object.entries(checks).filter(([key])=>key!=='errors').every(([,value])=>value===true)&&errors.length===0;
fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(checks,null,2));
console.log(JSON.stringify(checks,null,2));
await browser.close();
