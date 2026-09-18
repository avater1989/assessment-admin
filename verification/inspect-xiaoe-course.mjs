import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'file:///C:/Users/barr/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const url='https://helpcenter.xiaoe-tech.com/#/problem/detail?document_id=doc_6a545c8906351_eimin';
const out=path.resolve('verification','competitor-xiaoe');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',(error)=>errors.push(error.message));page.on('console',(message)=>{if(message.type()==='error')errors.push(message.text());});
await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(8000);
const result=await page.evaluate(()=>({title:document.title,url:location.href,text:document.body.innerText,images:[...document.images].map((image)=>({src:image.src,alt:image.alt,width:image.naturalWidth,height:image.naturalHeight})).filter((image)=>image.width>200||image.height>120)}));
await page.screenshot({path:path.join(out,'page.png'),fullPage:true});fs.writeFileSync(path.join(out,'page.json'),JSON.stringify({...result,errors},null,2));
console.log(JSON.stringify({title:result.title,url:result.url,text:result.text.slice(0,12000),imageCount:result.images.length,errors},null,2));await browser.close();
