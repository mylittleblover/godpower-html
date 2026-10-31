import {createServer}from'node:http';import{readFile,writeFile}from'node:fs/promises';import{launch,setup}from'../../tests/fixtures/browser.mjs';
const html=await readFile('dist/godpower.html');const server=createServer((_,r)=>r.end(html));await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await launch();
try{const page=await browser.newPage({viewport:{width:1920,height:1080}});await page.goto(`http://127.0.0.1:${server.address().port}`);await setup(page,4);
 const normal=await page.evaluate(async()=>{const before=state.itemGlobal.totalDraws;globalItemDraw();await new Promise(r=>setTimeout(r,1800));return{awarded:state.groups.reduce((n,g)=>n+g.inventory.length,0),countDelta:state.itemGlobal.totalDraws-before};});
 await page.waitForFunction(()=>!itemDrawBusy);await setup(page,4);
 const undo=await page.evaluate(async()=>{const before=state.itemGlobal.totalDraws;globalItemDraw();await undoLast();await new Promise(r=>setTimeout(r,1800));return{before,after:state.itemGlobal.totalDraws,inventory:state.groups.reduce((n,g)=>n+g.inventory.length,0),busy:itemDrawBusy};});
 await writeFile('artifacts/code-review-3.0.61/draw-before.json',JSON.stringify({normal,undo},null,2));console.log(JSON.stringify({normal,undo}));
}finally{await browser.close();server.close();}
