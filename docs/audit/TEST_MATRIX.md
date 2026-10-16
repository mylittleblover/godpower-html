# 功能 × 场景 × 类型 × 结果

状态：PASS实际通过；FAIL实际失败；BLOCKED环境限制；NOT TESTED未执行；NOT APPLICABLE不适用。不将后两类计入通过。最新证据为 artifacts/browser-results.json、rule-oracles.json、ios-hotfix-verification.log；早期失败证据另存，不作为最终结果。

Node单元／存储集成共49项通过（34单元、15集成）；Chromium主回归117 PASS、0 FAIL；道具精确oracle 26 PASS。

| 功能／场景 | 类型 | 结果 | 证据 |
|---|---|---|---|
| denied browser storage getter reports failure without throwing | Chromium E2E | PASS | browser-results.json，2264 ms |
| failed item cannot persist a phantom undo snapshot | Chromium E2E | PASS | browser-results.json，321 ms |
| item save failure retains session result with explicit unsaved warning | Chromium E2E | PASS | browser-results.json，292 ms |
| archive failure never clears scores, inventory or history | Chromium E2E | PASS | browser-results.json，1768 ms |
| archive success captures full state before reset | Chromium E2E | PASS | browser-results.json，316 ms |
| successful archive plus failed classroom write restores classroom | Chromium E2E | PASS | browser-results.json，291 ms |
| fire flower damage, All In cancellation and exact undo | Chromium E2E | PASS | browser-results.json，332 ms |
| fire and ice obey queue, disabled mode, negative scores and round lock | Chromium E2E | PASS | browser-results.json，1568 ms |
| frozen flower attempt unfreezes without consuming, locks All In, undo restores ice | Chromium E2E | PASS | browser-results.json，310 ms |
| ice skips already frozen targets and consumes when all frozen | Chromium E2E | PASS | browser-results.json，593 ms |
| normalization preserves group numbers, ghost duration and continuation | Chromium E2E | PASS | browser-results.json，641 ms |
| malformed imports leave live state intact | Chromium E2E | PASS | browser-results.json，173 ms |
| legacy backup import and versioned complete backup roundtrip | Chromium E2E | PASS | browser-results.json，180 ms |
| failed import persistence rolls back | Chromium E2E | PASS | browser-results.json，120 ms |
| group name HTML injection is rendered as text | Chromium E2E | PASS | browser-results.json，216 ms |
| all A/B/C/D scoring and duplicate judge idempotence | Chromium E2E | PASS | browser-results.json，1100 ms |
| item:green: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，290 ms |
| item:green: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，311 ms |
| item:green: secondary slot rejected | Chromium E2E | PASS | browser-results.json，403 ms |
| item:triple_green: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，408 ms |
| item:triple_green: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，378 ms |
| item:triple_green: secondary slot rejected | Chromium E2E | PASS | browser-results.json，506 ms |
| item:red: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，268 ms |
| item:red: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，316 ms |
| item:red: secondary slot rejected | Chromium E2E | PASS | browser-results.json，330 ms |
| item:triple_red: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，267 ms |
| item:triple_red: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，321 ms |
| item:triple_red: secondary slot rejected | Chromium E2E | PASS | browser-results.json，772 ms |
| item:spiny: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，241 ms |
| item:spiny: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，304 ms |
| item:spiny: secondary slot rejected | Chromium E2E | PASS | browser-results.json，297 ms |
| item:banana: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，181 ms |
| item:banana: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，302 ms |
| item:banana: secondary slot rejected | Chromium E2E | PASS | browser-results.json，224 ms |
| item:triple_banana: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，83 ms |
| item:triple_banana: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，397 ms |
| item:triple_banana: secondary slot rejected | Chromium E2E | PASS | browser-results.json，217 ms |
| item:horn: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，102 ms |
| item:horn: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，394 ms |
| item:horn: secondary slot rejected | Chromium E2E | PASS | browser-results.json，183 ms |
| item:bomb: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，85 ms |
| item:bomb: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，200 ms |
| item:bomb: secondary slot rejected | Chromium E2E | PASS | browser-results.json，208 ms |
| item:hammer: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，90 ms |
| item:hammer: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，245 ms |
| item:hammer: secondary slot rejected | Chromium E2E | PASS | browser-results.json，139 ms |
| item:coin: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，109 ms |
| item:coin: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，188 ms |
| item:coin: secondary slot rejected | Chromium E2E | PASS | browser-results.json，126 ms |
| item:coin_shell: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，97 ms |
| item:coin_shell: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，128 ms |
| item:coin_shell: secondary slot rejected | Chromium E2E | PASS | browser-results.json，152 ms |
| item:question: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，52 ms |
| item:question: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，152 ms |
| item:question: secondary slot rejected | Chromium E2E | PASS | browser-results.json，114 ms |
| item:mushroom: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，83 ms |
| item:mushroom: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，130 ms |
| item:mushroom: secondary slot rejected | Chromium E2E | PASS | browser-results.json，125 ms |
| item:triple_mushroom: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，80 ms |
| item:triple_mushroom: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，177 ms |
| item:triple_mushroom: secondary slot rejected | Chromium E2E | PASS | browser-results.json，113 ms |
| item:boo: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，85 ms |
| item:boo: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，140 ms |
| item:boo: secondary slot rejected | Chromium E2E | PASS | browser-results.json，200 ms |
| item:blooper: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，75 ms |
| item:blooper: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，139 ms |
| item:blooper: secondary slot rejected | Chromium E2E | PASS | browser-results.json，130 ms |
| item:lightning: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，49 ms |
| item:lightning: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，112 ms |
| item:lightning: secondary slot rejected | Chromium E2E | PASS | browser-results.json，93 ms |
| item:star: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，24 ms |
| item:star: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，74 ms |
| item:star: secondary slot rejected | Chromium E2E | PASS | browser-results.json，85 ms |
| item:mega: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，32 ms |
| item:mega: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，109 ms |
| item:mega: secondary slot rejected | Chromium E2E | PASS | browser-results.json，72 ms |
| item:bullet: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，43 ms |
| item:bullet: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，98 ms |
| item:bullet: secondary slot rejected | Chromium E2E | PASS | browser-results.json，91 ms |
| item:power: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，55 ms |
| item:power: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，111 ms |
| item:power: secondary slot rejected | Chromium E2E | PASS | browser-results.json，86 ms |
| item:feather: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，46 ms |
| item:feather: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，115 ms |
| item:feather: secondary slot rejected | Chromium E2E | PASS | browser-results.json，106 ms |
| item:fire_flower: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，57 ms |
| item:fire_flower: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，114 ms |
| item:fire_flower: secondary slot rejected | Chromium E2E | PASS | browser-results.json，136 ms |
| item:ice_flower: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，24 ms |
| item:ice_flower: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，95 ms |
| item:ice_flower: secondary slot rejected | Chromium E2E | PASS | browser-results.json，76 ms |
| item:boomerang_flower: negative/mode/round/freeze/reload guards | Chromium E2E | PASS | browser-results.json，32 ms |
| item:boomerang_flower: acquire/use/consume/undo | Chromium E2E | PASS | browser-results.json，76 ms |
| item:boomerang_flower: secondary slot rejected | Chromium E2E | PASS | browser-results.json，74 ms |
| triple item may finish same stack but next item cannot bypass round lock | Chromium E2E | PASS | browser-results.json，25 ms |
| main passive defense consumed before target score loss | Chromium E2E | PASS | browser-results.json，172 ms |
| 50/100 rounds: correct scores, capped history and stable DOM | Chromium E2E | PASS | browser-results.json，815 ms |
| reload restores round and persistent state | Chromium E2E | PASS | browser-results.json，2652 ms |
| custom icon payload cannot add executable HTML attributes | Chromium E2E | PASS | browser-results.json，548 ms |
| unsafe item result rolls back score and inventory atomically | Chromium E2E | PASS | browser-results.json，229 ms |
| denied next round cannot clear used-item lock | Chromium E2E | PASS | browser-results.json，566 ms |
| unsafe All In scores reject whole settlement before mutation | Chromium E2E | PASS | browser-results.json，106 ms |
| all-correct/all-wrong and unchanged no-answer groups | Chromium E2E | PASS | browser-results.json，745 ms |
| real answer click, deselect, keyboard focus and hover | Chromium E2E | PASS | browser-results.json，1573 ms |
| manual score, negative score, 7-digit score, ranking and undo | Chromium E2E | PASS | browser-results.json，268 ms |
| members, group rename, add and delete undo | Chromium E2E | PASS | browser-results.json，352 ms |
| picker modes, anti-repeat exhaustion and actual spin stop | Chromium E2E | PASS | browser-results.json，805 ms |
| hand raise correct/wrong statistics and reward undo | Chromium E2E | PASS | browser-results.json，294 ms |
| normal next round and force end undo | Chromium E2E | PASS | browser-results.json，875 ms |
| all items with 1 groups remain valid | Chromium E2E | PASS | browser-results.json，987 ms |
| all items with 2 groups remain valid | Chromium E2E | PASS | browser-results.json，4820 ms |
| all items with 4 groups remain valid | Chromium E2E | PASS | browser-results.json，3678 ms |
| all items with 8 groups remain valid | Chromium E2E | PASS | browser-results.json，4930 ms |
| download JSON and full archive CSV contain real payloads | Chromium E2E | PASS | browser-results.json，3986 ms |
| audio context first gesture, mute, volume and invalid decode | Chromium E2E | PASS | browser-results.json，125 ms |
| modal/page repetition has bounded DOM after animations settle | Chromium E2E | PASS | browser-results.json，2305 ms |
| item description sync cannot destroy batch actions | Chromium E2E | PASS | browser-results.json，293 ms |
| green 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| triple_green 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| red 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| triple_red 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| spiny 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| banana 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| triple_banana 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| horn 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| bomb 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| hammer 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| coin 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| coin_shell 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| question 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| mushroom 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| triple_mushroom 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| boo 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| blooper 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| lightning 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| star 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| mega 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| bullet 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| power 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| feather 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| fire_flower 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| ice_flower 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |
| boomerang_flower 确定性目标／积分或状态初值 | Chromium E2E | PASS | rule-oracles.json |

## 道具19维覆盖

P=PASS；N=NOT TESTED；A=NOT APPLICABLE。组合场景不能由单次正常使用推出。防御成功仅绿壳专例，不能推广到所有道具。表中的防御失败仅指无防御目标正常命中，不代表已测每一种防具的失效／优先级。

| key | 获取 | 使用 | 禁用条件 | 目标 | 数值/初效 | 防御成功 | 防御失败 | 库存消耗 | 耗尽 | 持续 | 叠加 | 到期 | 打断 | All In | 撤销 | 存档 | 动画 | 界面 | 音效 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| green | P | P | P | P | P | P | P | P | N | A | N | N | N | P | P | P | N | N | N |
| triple_green | P | P | P | P | P | N | P | P | N | A | N | N | N | P | P | P | N | N | N |
| red | P | P | P | P | P | N | P | P | N | A | N | N | N | P | P | P | N | N | N |
| triple_red | P | P | P | P | P | N | P | P | N | A | N | N | N | P | P | P | N | N | N |
| spiny | P | P | P | P | P | N | P | P | N | A | N | N | N | P | P | P | N | N | N |
| banana | P | P | P | P | P | N | P | P | N | A | N | N | N | P | P | P | N | N | N |
| triple_banana | P | P | P | P | P | N | P | P | N | A | N | N | N | P | P | P | N | N | N |
| horn | P | P | P | P | P | N | P | P | N | A | N | N | N | P | P | P | N | N | N |
| bomb | P | P | P | P | P | N | P | P | N | A | N | N | N | P | P | P | N | N | N |
| hammer | P | P | P | P | P | N | P | P | N | A | N | N | N | P | P | P | N | N | N |
| coin | P | P | P | A | P | A | A | P | N | A | N | N | N | P | P | P | N | N | N |
| coin_shell | P | P | P | A | P | A | A | P | N | A | N | N | N | P | P | P | N | N | N |
| question | P | P | P | A | P | A | A | P | N | A | N | N | N | P | P | P | N | N | N |
| mushroom | P | P | P | A | P | A | A | P | N | A | N | N | N | P | P | P | N | N | N |
| triple_mushroom | P | P | P | A | P | A | A | P | P | A | N | N | N | P | P | P | N | N | N |
| boo | P | P | P | A | P | A | A | P | N | P | N | N | N | P | P | P | N | N | N |
| blooper | P | P | P | A | P | A | A | P | N | P | N | N | N | P | P | P | N | N | N |
| lightning | P | P | P | P | P | N | P | P | N | A | N | N | N | P | P | P | N | N | N |
| star | P | P | P | A | P | A | A | P | N | P | N | N | N | P | P | P | N | N | N |
| mega | P | P | P | A | P | A | A | P | N | P | N | N | N | P | P | P | N | N | N |
| bullet | P | P | P | A | P | A | A | P | N | A | N | N | N | P | P | P | N | N | N |
| power | P | P | P | A | P | A | A | P | N | P | N | N | N | P | P | P | N | N | N |
| feather | P | P | P | A | P | A | A | P | N | P | N | N | N | P | P | P | N | N | N |
| fire_flower | P | P | P | P | P | N | P | P | N | A | N | N | N | P | P | P | N | N | N |
| ice_flower | P | P | P | P | P | N | P | P | N | P | N | N | N | P | P | P | N | N | N |
| boomerang_flower | P | P | P | P | P | N | P | P | N | A | N | N | N | P | P | P | N | N | N |

- 全部二三级菜单与全部交互视觉状态：NOT TESTED（UI；主要页面／6弹窗已捕获；非穷举）。
- 人工节奏、过门、音量听感及设备不可用：NOT TESTED（人工音频；步骤见MAINTENANCE_GUIDE）。
- 有效音轨／音效包导入导出大包回环：NOT TESTED（E2E；缺少真实素材场景）。
- IndexedDB被禁用全部流程：NOT TESTED（E2E；尚未注入拒绝覆盖全部页面）。
- 50MB上限和大档案配额边界：NOT TESTED（集成；已测写入抛异常，未实填满50MB）。
- 刺龟壳蘑菇／喇叭选择与跨回合撤销：NOT TESTED（E2E；GP-010）。
- 30分钟资源／音频内存与监听器趋势：NOT TESTED（性能；100回合仅有限合成负载）。
- 读屏、投影设备、真实触摸、浏览器缩放全矩阵：NOT TESTED（人工UI；GP-018/019）。
- Firefox／WebKit后续验收：NOT APPLICABLE（浏览器；用户最终要求只使用Chromium）。
- 远端CI执行：NOT TESTED（CI；用户禁止CircleCI；仅本地验证，未触发其他远端CI）。
- chromium file：BLOCKED；page.goto: net::ERR_BLOCKED_BY_ADMINISTRATOR at file:///workspace/godpower-html/dist/godpower.html
Call log:
[2m  - navigating to "file:///workspace/godpower-html/dist/godpower.html", waiting until "domcontentloaded"[22m
