# 28 道具实测抽样审计

范围：4/8/14/20组；均分与倍差；固定种子，真实命令及持久化ACK。即时分值不代表防御/持续状态的总价值。此表用于查明影响，不作为删除功能或平衡排名的依据。

| Key | 名称 | 效果 | 目标 | 余次 | 成功/案例 | 自身平均即时变化 | 平均实际扣分 |
|---|---|---|---|---:|---:|---:|---:|
| kamek | 卡美克 | kamek | randomOther | 1 | 8/8 | 0.00 | 0.00 |
| item_box | 道具箱 | itemBox | self | 1 | 8/8 | 0.00 | 0.00 |
| green | 绿龟壳 | fraction | randomOther | 1 | 8/8 | 0.00 | 121.88 |
| triple_green | 三重绿龟壳 | fraction | randomOther | 3 | 8/8 | 0.00 | 121.88 |
| red | 红龟壳 | fraction | above | 1 | 8/8 | 0.00 | 145.63 |
| triple_red | 三重红龟壳 | fraction | above | 3 | 8/8 | 0.00 | 145.63 |
| spiny | 刺龟壳 | fraction | leader | 1 | 8/8 | 0.00 | 312.50 |
| banana | 香蕉皮 | fraction | below | 1 | 8/8 | 0.00 | 84.38 |
| triple_banana | 三重香蕉皮 | fraction | below | 3 | 8/8 | 0.00 | 84.38 |
| horn | 超级喇叭 | fraction | adjacent | 1 | 8/8 | 0.00 | 193.75 |
| bomb | 炸弹兵 | fraction | blast | 1 | 8/8 | 0.00 | 315.63 |
| hammer | 锤子 | fraction | randomAhead | 1 | 8/8 | 0.00 | 368.75 |
| coin | 金币 | flat | self | 1 | 8/8 | 2.00 | 0.00 |
| coin_shell | 金币龟壳 | boost | aheadInclusive | 1 | 8/8 | 96.88 | 0.00 |
| question | ？砖块 | boost | behindInclusive | 1 | 8/8 | 96.88 | 0.00 |
| mushroom | 蘑菇 | boost | self | 1 | 8/8 | 96.88 | 0.00 |
| triple_mushroom | 三重蘑菇 | boost | self | 3 | 8/8 | 96.88 | 0.00 |
| boo | 害羞幽灵 | steal | above | 1 | 8/8 | 0.00 | 0.00 |
| blooper | 鱿鱿 | mask | self | 1 | 8/8 | 0.00 | 0.00 |
| lightning | 闪电 | lightning | allAhead | 1 | 8/8 | 0.00 | 1631.25 |
| star | 无敌星 | status | self | 1 | 8/8 | 0.00 | 0.00 |
| mega | 巨大蘑菇 | status | self | 1 | 8/8 | 0.00 | 0.00 |
| bullet | 炮弹刺客 | overtake | threeAhead | 1 | 8/8 | 126.00 | 0.00 |
| power | 强力蘑菇 | status | self | 1 | 8/8 | 0.00 | 0.00 |
| feather | 羽毛 | dodge | self | 1 | 8/8 | 0.00 | 0.00 |
| fire_flower | 火之花 | fraction | randomOther | 3 | 8/8 | 0.00 | 121.88 |
| ice_flower | 冰之花 | freeze | randomUnfrozen | 3 | 8/8 | 0.00 | 97.50 |
| boomerang_flower | 回旋镖花 | fraction | adjacent | 3 | 8/8 | 0.00 | 155.00 |

HTML SHA256：b391cc93202dd393561aeb26c01d8508b0ce4a66ca0d8310e31ea9d55a5ad1d9
实际案例 224；renderer errors 0；耗时 167593 ms。非性能基准。

未覆盖：防御组合、负分/零分/满包、持续期完整收益与人工听感。不能宣称全部道具组合通过。

## 本轮规则核对裁定

基线为59f9abc（连续使用修复后、数值变更前），224个真实命令全部成功，未发现renderer异常。即时代价不能替代持续/防御收益，因而不根据均分直接给28道具排序。

已批准变化只包括：绿/三绿的主动伤害与蘑菇/三蘑的主动增益由1/4变1/3；其余比例保留；新启用强力蘑菇持续5次有效答题，已存档正在生效的旧3次状态不强制延长。随机范围按实际target类型randomOther/randomUnfrozen/randomAhead/blast限定：kamek、green、triple_green、hammer、bomb、fire_flower、ice_flower；炸弹的所有实际目标也必须在范围内。指定相邻、全部领先、固定榜首不改变。空候选不消费。

强力蘑菇严格oracle：使用答题前积分排序中最近的严格高分组为参照；使用完成基础/普通状态修正后的冻结积分快照计算+1，不按各组遍历顺序累加；已经自然超过不降分；答错/漏答不发动，漏答不消耗。与自己同分者不视为更高分组。多人发动后实际最终名次不保证恰好提升一位，因为其他发动者也可能超越；优先保持确定性及原参照关系。该裁定补全已批准方案中的多人/并列歧义，不改变普通ranking排序。

后续连续权重采用旧前/中/后权重作为形状锚点，移除道具专属硬分区；以相对名次和正向分差连续调节追赶项，保留首次举手特殊池、第一名喇叭10%与前60%资格、场上唯一、库存去重和既有冷却。所有例外必须在规则版本中可查。既有硬分区与此需求冲突时以本轮新权重要求为准，不把两套权重叠加包装。
