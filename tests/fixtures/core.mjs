import vm from 'node:vm';import {readFileSync} from 'node:fs';
const c=vm.createContext({});vm.runInContext(readFileSync('src/core/reliability.js','utf8')+'\nglobalThis.api=Reliability',c);export const core=c.api;
export function memoryStorage(){const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),data}}
