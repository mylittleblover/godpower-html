import test from 'node:test';
import assert from 'node:assert/strict';
import {core} from '../fixtures/core.mjs';
function scene(){const item={key:'horn',charges:1},target={id:2,inventory:[item]};const state={groups:[{id:1},target],itemGlobal:{pkTotal:0},hasStartedOnce:true,roundActive:true,evaluated:false,correctAns:''};return {item,target,state};}
test('current defense belongs to exact main item',()=>{const {state,target}=scene(),d=core.captureDefenseDecision(state,target,'horn');assert.ok(d);assert.equal(core.isDefenseDecisionCurrent(state,d),true);assert.equal(core.captureDefenseDecision(state,target,'mushroom'),null)});
test('new command invalidates pending confirmation',()=>{const {state,target}=scene(),d=core.captureDefenseDecision(state,target,'horn');core.invalidateDefenseDecisions();assert.equal(core.isDefenseDecisionCurrent(state,d),false)});
test('replaced item invalidates confirmation',()=>{const {state,target}=scene(),d=core.captureDefenseDecision(state,target,'horn');target.inventory[0]={key:'horn'};assert.equal(core.isDefenseDecisionCurrent(state,d),false)});
test('restore/import invalidates former target',()=>{const {state,target}=scene(),d=core.captureDefenseDecision(state,target,'horn');state.groups[1]={...target};assert.equal(core.isDefenseDecisionCurrent(state,d),false);assert.equal(core.isDefenseDecisionCurrent(scene().state,d),false)});
test('phase/answer/round/settlement changes invalidate confirmation',()=>{for(const change of [s=>{s.evaluated=true},s=>{s.correctAns='B'},s=>{s.round=2},s=>{s.itemGlobal.pkTotal++}]){const {state,target}=scene(),d=core.captureDefenseDecision(state,target,'horn');change(state);assert.equal(core.isDefenseDecisionCurrent(state,d),false)}});
