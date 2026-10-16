import {readFile} from 'node:fs/promises';import {parse} from 'acorn';
const s=await readFile('dist/godpower.html','utf8');let count=0;
for(const m of s.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)){parse(m[1],{ecmaVersion:'latest',allowReturnOutsideFunction:false});count++}
const baseline=await readFile('baseline/V2.18.13.html','utf8');
const resources=x=>[...x.matchAll(/data:[a-zA-Z0-9.+/-]+(?:;[a-zA-Z0-9=.+-]+)*;base64,[a-zA-Z0-9+/=\s]+/g)].map(m=>m[0]);
if(JSON.stringify(resources(s))!==JSON.stringify(resources(baseline)))throw Error('Embedded resources changed');
if(/<(?:script|link)[^>]+(?:src|href)=["']https?:/i.test(s))throw Error('External runtime dependency');
console.log(`${count} script blocks parse; all ${resources(s).length} original embedded resources preserved`);
