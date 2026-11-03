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
