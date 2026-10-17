import test from 'node:test';
import assert from 'node:assert/strict';
import {core} from '../fixtures/core.mjs';
test('batch scoring plans each group exactly once',()=>{const groups=[{id:1,score:100},{id:2,score:5}];const p=core.planBatchScoreChanges(groups,[[1,3],[2,1]],2);assert.equal(JSON.stringify(p),JSON.stringify([{id:1,old:100,delta:6,score:106},{id:2,old:5,delta:2,score:7}]));assert.deepEqual(groups,[{id:1,score:100},{id:2,score:5}])});
test('batch scoring refuses partial integer overflow',()=>{const groups=[{id:1,score:1},{id:2,score:Number.MAX_SAFE_INTEGER}];assert.throws(()=>core.planBatchScoreChanges(groups,[[1,1],[2,1]],1));assert.equal(groups[0].score,1)});
for(const points of [0,1.5,Infinity,Number.MAX_SAFE_INTEGER+1])test('batch invalid points '+points,()=>assert.throws(()=>core.planBatchScoreChanges([{id:1,score:0}],[[1,1]],points)));
test('batch rejects missing groups and invalid counts',()=>{assert.throws(()=>core.planBatchScoreChanges([{id:1,score:0}],[[2,1]],1));assert.throws(()=>core.planBatchScoreChanges([{id:1,score:0}],[[1,-1]],1))});
