import {readFile,writeFile} from 'node:fs/promises';
const template=await readFile('src/index.template.html','utf8');
const original=JSON.parse(await readFile('src/manifest.json','utf8'));
original.blocks=[...template.matchAll(/<(script|style)\b([^>]*)>\s*@@SOURCE:([^@]+)@@\s*<\/\1>/g)].map(([,type,attributes,path])=>({type,path,attributes}));
if(!original.blocks.length)throw Error('No source blocks found');
await writeFile('src/manifest.json',JSON.stringify(original,null,2)+'\n');
console.log(`Indexed ${original.blocks.length} inline source blocks`);
