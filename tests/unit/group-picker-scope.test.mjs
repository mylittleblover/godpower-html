import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFileSync} from 'node:fs';
test('admin item ordering only inspects its owning group window',()=>{
 const source=readFileSync('src/runtime/items/group-encyclopedia.js','utf8');const start=source.indexOf('function syncGodItemPickerV2182()'),end=source.indexOf('/* 小组信息里的主要',start);
 const order=Array.from({length:28},(_,i)=>'item_'+String.fromCharCode(97+Math.floor(i/26))+String.fromCharCode(97+i%26)),appended=[],parent={appendChild:b=>appended.push(b.key)};
 const buttons=order.toReversed().map(key=>({key,parentElement:parent,getAttribute:()=>`godAddQueueItemV2120(1,'${key}')`}));
 const grid={querySelectorAll:()=>buttons};const selectors=[];
 const ctx={document:{querySelector:s=>(selectors.push(s),grid),querySelectorAll:s=>{assert.notEqual(s,'*','no global text scan');return [grid]}},ITEM_DEFS:Object.fromEntries(order.map(k=>[k,{}])),GROUP_ITEM_ORDER_V2182:order,groupItemDescV2182:k=>k};
 vm.runInNewContext(source.slice(start,end)+'\nsyncGodItemPickerV2182()',ctx);
 assert.deepEqual(appended,order);assert.ok(selectors.every(s=>s.startsWith('#itemWindowBody')));
});
