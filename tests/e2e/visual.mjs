import {execFileSync} from 'node:child_process';
import {createServer} from 'node:http';import {readFile,mkdir,writeFile} from 'node:fs/promises';import {launch,setup} from '../fixtures/browser.mjs';
const original=execFileSync('git',['show','378f2d23d180802171a8e7d237fe1fb631ee3318:dist/godpower.html'],{maxBuffer:16e6});
const srv=createServer(async(req,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(req.url.includes('baseline')?original:await readFile('dist/godpower.html'))});await new Promise(r=>srv.listen(0,'127.0.0.1',r));const browser=await launch();const result=[];
for(const version of ['baseline','fixed']){
 const c=await browser.newContext({viewport:{width:1920,height:1080}});const p=await c.newPage();await p.goto(`http://127.0.0.1:${srv.address().port}/${version}`,{waitUntil:'domcontentloaded'});await p.waitForTimeout(500);await setup(p);
 await p.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important} #toast,#dockHumorV2185,#dockHumorTipV2185{visibility:hidden!important} #welcomeClock,#welcomeDate{visibility:hidden!important}'});
 await mkdir(`artifacts/screenshots/reference-${version}`,{recursive:true});
 for(const view of ['welcome','battle','history','archives','settings']){await p.evaluate(view=>switchView(view),view);await p.waitForTimeout(400);const path=`artifacts/screenshots/reference-${version}/${view}.png`;await p.screenshot({path});result.push({version,view,path})}
 await c.close();
}
await writeFile('artifacts/visual-captures.json',JSON.stringify(result,null,2));await browser.close();srv.close();
