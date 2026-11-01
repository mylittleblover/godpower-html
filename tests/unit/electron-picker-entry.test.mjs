import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
test('dock picker opens the floating window; only engine calls may hide an internal modal',()=>{
 let external=0,shown=0;const attrs=new Set();
 const modal={dataset:{},classList:{contains:()=>false},toggleAttribute:(k,v)=>v?attrs.add(k):attrs.delete(k)};
 const c=vm.createContext({window:{godpowerDesktop:{role:'main',openPicker(){external++}},GodpowerPicker:{setExternalPresentation(){}}},document:{getElementById:()=>modal},DesktopUI:{cancelPickerPreparation(){}},showClassroomWindow(){shown++},updatePickerView(){},updatePickerPoolUI(){},resetSlotDisplay(){}});
 vm.runInContext(readFileSync('src/runtime/picker/selection-engine.js','utf8').split('function closePickerModal')[0],c);
 // The dock button must never open the in-page modal in the desktop build.
 vm.runInContext('openPickerModal()',c);assert.equal(external,1);assert.equal(shown,0);assert.equal(attrs.has('data-external-picker'),false);
 // The hidden engine modal is what the external window drives.
 vm.runInContext('openPickerModal({internal:true})',c);assert.equal(external,1);assert.equal(shown,1);assert.equal(attrs.has('data-external-picker'),true);
});
