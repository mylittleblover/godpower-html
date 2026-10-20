# 插件依赖SemVer约束（3.0.29）

日期：2026-10-20。分支：`feat/v3-foundation-sp01-sp02`。本变更是插件runtime基础的后续补强，不改变课堂业务状态。

## 改动

manifest依赖版本现在接受并验证四种明确范围：精确版本、caret（`^`）、tilde（`~`）和半开比较区间（`>=x.y.z <a.b.c`）。解析遵循主/次/补丁优先级、零主版本caret边界、预发布优先级和构建元数据忽略规则。未知语法会在安装前被拒绝，避免错误范围被误当成有效兼容声明。

激活required依赖时，宿主按当前scope要求provider已安装、版本符合范围且处于active；提供方版本不符或未启用时消费者不能进入active。任何非uninstalled记录仍被required dependency引用时，provider不能被卸载。optionalDependencies仅作安装声明，不阻止激活或卸载；本阶段尚未提供可选能力降级通知。

没有切换存储格式，也没有修改旧课堂存档。旧版插件manifest如果使用本次明确定义以外的范围语法，在再次安装时会收到校验错误；现有已保存插件记录可继续读取，但激活时不支持的范围会明确失败，不会被忽略。

## 验证

- `node --test tests/unit/plugin-platform.test.mjs`：9/9 PASS。
- `npm test`：271/271 PASS。
- `node tests/e2e/plugin-platform.mjs`：PASS，Chromium 1920×1080 1x。
- `npm run build` 与 `npm run check`：PASS，源码版本、包版本和内部版本均为3.0.29。
- Electron共享协议合同尚未执行；运行时尚未从HTML/Electron抽取为共享包。

## 后续

PLUG-M1仍标为PARTIAL：依赖拓扑安装顺序、optional降级、包签名/升级/回滚与隔离执行仍未实现。该实现只完成激活期版本范围校验。
