# 3.0.4判题专项（2026-10-19）

| 功能×场景 | 类型 | 实际结果 | 证据 |
|---|---|---|---|
| 纯计分/架构/现有单元集成 | Node | PASS173/173 | artifacts/v3-round/unit.log |
| 旧/新判题链4/14组、All In、power/ice/boo、空答、溢出 | Chromium种子差分 | PASS80/80，状态/声音/720ms调度相同 | differential.json |
| 核心业务 | Chromium1920×1080 1× | PASS117/117 errors=[] | browser-results.json |
| 全部道具及可配置积木 | 浏览器oracle | PASS26/26 | items.log |
| 道具抽取 | 可控种子 | PASS448案例 | items.log |
| file:// | Chromium | BLOCKED | 浏览器策略禁止，不计PASS |

以下为历史阶段。

---

# 3.0.3迁移架构专项（2026-10-19）

| 功能×场景 | 类型 | 实际结果 | 证据 |
|---|---|---|---|
| 核心单元/集成 | Node | PASS160/160 | artifacts/v3-async/unit.log |
| 核心业务及五页 | Chromium1920×1080 1× | PASS117/117，无page error | artifacts/v3-async/browser-results.json |
| 异步事务命令 | 真实IndexedDB+浏览器 | PASS8类场景 | artifacts/v3-async/migration.log |
| 迁移预检/暂存/读回/源变更/损坏资源/重试 | 真实IndexedDB+设置点击 | PASS | artifacts/v3-async/migration.log及screenshots |
| file://运行 | Chromium | BLOCKED（浏览器管理策略） | browser-results.json |
| Windows真机 | 原生 | NOT TESTED | 不以Linux替代 |
| CircleCI | CI | NOT RUN（用户禁止操作） | — |

以下为历史阶段，不计入本轮通过数。

---

# 设计整改最新专项（2026-10-18）

[本轮正式验收](../reports/DESIGN_REVIEW_ACCEPTANCE.md)。后续仅Chromium、1920×1080、1×。最终构建114项Node测试、9项设计回归及14组单尺寸几何对照PASS；最终页面/窗口截图见artifacts/design-review/delivery-1920/。历史阶段专项与构建哈希在正式报告分列，不能视为同一最终文件的全部功能验收。

---

# 当前专项矩阵（2026-10-18）

本轮真实结果：[渲染/生命周期治理验收](../reports/STRUCTURE_REFACTOR_ACCEPTANCE.md)，机器矩阵artifacts/structure/acceptance.json。旧表格保留为历史，不能当作本轮全部界面的覆盖声明。

|功能×场景|类型|状态|数量|
|---|---|---|---:|
|Node单元/集成/架构守卫|Node或Chromium专项（见报告命令）|PASS|111|
|核心业务Chromium|Node或Chromium专项（见报告命令）|PASS|117|
|26道具精确结果|Node或Chromium专项（见报告命令）|PASS|26|
|异步防御完整命令|Node或Chromium专项（见报告命令）|PASS|30|
|新旧业务差分|Node或Chromium专项（见报告命令）|PASS|464|
|比赛动画/独立按钮声音|Node或Chromium专项（见报告命令）|PASS|8|
|断网HTTP/归档/弹窗|Node或Chromium专项（见报告命令）|PASS|4|
|真实作答和存储失败|Node或Chromium专项（见报告命令）|PASS|3|
|桌面交互/结算拒绝清零|Node或Chromium专项（见报告命令）|PASS|21|
|赋分/抽选/音效配置|Node或Chromium专项（见报告命令）|PASS|15|
|20/50/100连续回合|Node或Chromium专项（见报告命令）|PASS|6|
|最新基线14组布局|Node或Chromium专项（见报告命令）|PASS|3|
|单文件file直接打开|Chromium|BLOCKED|0|
|原生浏览器缩放、真实音乐听感、小时级浸泡|实际设备|NOT TESTED|0|
|CircleCI|按用户要求|NOT RUN|0|

---

> 最新桌面 UI 交付：见 `docs/reports/DESKTOP_UI_ACCEPTANCE.md`、`docs/ui/DESIGN_SYSTEM.md` 和 `artifacts/desktop-ui/acceptance-matrix.json`。以下原始审查结论保留为历史记录。

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


## 2026-10-17 遗留治理最新验收

原报告作为历史证据保留。本轮以 `079df31` 最新分支为起点，完成公开防御命令事务、攻击防御单入口与历史模块收拢。最新实际结果见 `docs/REFACTORING_REPORT.md`、`docs/TEST_MATRIX.md` 和 `artifacts/refactor/acceptance-matrix.json`；旧报告的 GP-010 OPEN 与旧测试数量不代表当前结果。


## 最新欢迎分支验收（674e12f 起点）

最新实际结果见 `docs/reports/WELCOME_V2_COMPLETION.md` 和 `artifacts/welcome-completion/acceptance-matrix.json`。旧版报告保留为历史证据，不能用其中的旧dist状态和旧测试数量代替本轮结果。


## 设置页清查与新UI补齐（e97933d 起点）

当前设置页清单、布局、动效、真实音频往返与验收范围见 docs/reports/SETTINGS_CLEANUP_ACCEPTANCE.md、docs/audit/SETTINGS_INVENTORY.md。最终同产物43个UI场景与阶段性157核心／31桌面场景分开记录，未将阶段测试合并为全量最终verify。

## 2026-10-18 界面与动效回归

新增 [功能界面验收矩阵](APPLICATION_SURFACES_TEST_MATRIX.md)；最终状态及产物SHA以 [报告](../reports/APPLICATION_SURFACES_ACCEPTANCE.md) 为准。阶段测试、最终回归和BLOCKED项目分开记录。

## 2026-10-18 六槽赋分、课堂特效和音频接入

本轮证据与各阶段产物哈希统一见 `docs/reports/CLASSROOM_FEEDBACK_ACCEPTANCE.md`，不得把历史验收结果当成此次最终 HTML 的重新执行结果。

| 功能 × 场景 | 测试类型 | 证据 |
|---|---|---|
| 五个自由赋分入口 × 六槽/输入/锁定/撤销 | Chromium E2E | artifacts/classroom-feedback/results.json |
| 三种抽取 × 连续滚动/减速/赢家/防重复历史 | Chromium E2E | 同上；captured/artifacts/visual-unification/motion/results.json |
| 全屏演出 × 三尺寸/三页面缩放/中断/关闭 | Chromium E2E + 几何 | fullscreen-zoom.json；results.json |
| 偏好 × 实际重载/损坏配置 | Chromium E2E | restore-results.json |
| 设置两卡 × 三尺寸/三页面缩放/键盘 | Chromium E2E + 截图 | settings-behavior-results.json |
| 41 活动槽 × 自定义资源/播放路径 | Chromium 状态注入 | audio-slots.json |
| 音频上传 × WAV/并发/损坏/存储中止 | Chromium E2E | audio-results.json |
| 配置 × 默认/校验/复制/边界 | Node 单元 | logs/gp-settings-unit.log |
| 14 小组 × 修改前后同配置 | Chromium DOM + 截图 | layout/battle-14-comparison.json |
| HTTP 离线、归档及正常答对加分 | Chromium E2E | captured/artifacts/desktop-ui/release-smoke.json |
| file:// | BLOCKED | 当前浏览器环境 ERR_BLOCKED_BY_ADMINISTRATOR，不能记 PASS |
| 真实音箱听感、原生浏览器工具栏缩放 | NOT TESTED | CF-004；页面缩放 .8/1/1.25 不等于原生工具栏缩放 |
| Firefox、WebKit、CircleCI | NOT APPLICABLE | 按用户指示不执行 |
| 同一操作多音效 × 上传/随机播放/26 道具/循环/刷新/BIN/删除失败 | Chromium E2E | artifacts/classroom-feedback/multiple-audio-results.json |

## 比赛连贯动画与操作声音（2026-10-18）

| 范围 | 证据 | 状态说明 |
|---|---|---|
| 26 道具表现、帧内淡出、重绘恢复 | artifacts/battle-motion/results.json | 以该文件的实际 PASS/FAIL 为准 |
| 三页面缩放的分数颜色、右锚点 | 同上 | 真实 CSS/DOM 测量 |
| 抽取入场、揭晓、退出与库存一次性提交 | 同上；draw-*.png | 真实业务流程与中间透明度 |
| 连续改分、撤销、跳过旧状态、新事件 | 同上；skip-red-results.json | 保存红绿回归证据 |
| 22 按钮槽、七分类、试听与去重 | 同上；preview-red-results.json | 实际鼠标试听与 BufferSource 验证 |
| 14 小组 × 三尺寸 | artifacts/battle-motion/layout | 同配置前后对比，教师真实配置仍未知 |
| 核心业务、26 道具预言机、音频上传/BIN | artifacts/battle-motion/captured、logs | 执行阶段与哈希见验收报告 |


## 3.0.1 主题增量

见reports/MARX_THEME_3_0_1.md；新增npm run test:theme覆盖主题、五页、八类设置、14组精确几何、语义色、版本、金色按钮、开关持久化和3秒提示。全项目旧功能未重跑的项目保留原状态，不自动标为PASS。


## 3.0.5旧道具链治理实际回归

|范围|结果|证据|
|---|---|---|
|Node unit/integration|PASS175/175|artifacts/v3-items/unit.log|
|26公开道具旧入口抛错|PASS26/26|item-oracles.json/rules.log|
|攻防差分|PASS464/464|item-differential.json|
|异步防御生命周期|PASS30,pageErrors=[]|defense.json|
|回合差分|PASS80|round-differential.json|
|14组1920×1080 1x|PASS|layout.json,before.png,after.png|
|Windows真机|NOT TESTED|无真机|


## 3.0.6 pure ranking and target policies (verified)

Extracted domain/competition/ranking.js and domain/items/targets.js; production ranking() and ItemOperationBlocks use these ports. Ranking is stable and nonmutating; target policy receives RNG and eligibility explicitly and returns original group references. Existing randomAhead comparator and RNG consumption are retained, not rebalanced. New 200 seeded ordering cases and17target contract/boundary tests were RED before implementation. Node195/195 PASS;464item-defense differential,448seeded draws,26oracle and configured-item tests PASS; Chromium core117/117 errors=[] at1920×1080 1x. file:// BLOCKED by managed policy. Evidence artifacts/v3-domain. No default storage cutover or achievement activation. Next: persistent migration verification journal and recovery distinction.
