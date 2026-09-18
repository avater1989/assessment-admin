# 优化日志 CHANGELOG

本文件汇总了"测评与计划管理后台"（内容中台）模块从初版到 P0/P1/P2 各阶段的所有功能与体验优化。

## 项目说明

- **定位**：大系统中的"测评管理"子模块，负责管理测评项目、关联规则、计划关卡、测评结果、报告配置、内容等
- **架构**：单文件 SPA（`app.js`）+ Node 静态服务器（`dev-server.mjs`）
- **状态持久化**：`localStorage` 键 `assessment-admin-state`

---

## P0：核心可用性修复

> 主题：补齐"功能存在但未实现/未贯通"的关键路径

### P0-② 关联规则试运行 / 模拟器

**问题**：测评项目配置页只能看到规则列表，无法在不出题的情况下验证规则是否会被命中。

**修复**：
- 新增 `evalTotalRangeCondition / evalDimensionCondition / evalOptionCondition / evaluateRule` 等 5 种触发器评估函数
- 新增 `openRelationSimulator()` Modal：列出所有学员结果（已完成 + 进行中），逐条展示匹配/未匹配，并给出命中统计（命中数、总数、命中率）
- 新增 `data-action="simulate-relation"` 与 `data-action="rerun-simulator"`
- 关联规则行尾加"试运行规则"按钮

**验证**：浏览器实测 5 种规则类型（总分区间 / 维度得分 / 选项匹配 / 按测评项目任务关联 / 脚本导入）全部跑通

---

## P1：体验一致性优化

> 主题：补齐"看起来有，但实际失效"的装饰性 UI

### P1-⑤ 持久化覆盖 view/sidebar（实际未生效）

**问题**：`persistState()` 仅保存业务数据（projects/series/relations 等），不保存 UI 状态 —— 刷新后侧边栏折叠/激活 Tab 丢失。

**修复**：新增 `sessionStateKeys` 数组（`view / sidebarCollapsed / projectTab / activeCourseIndex / activeProjectIndex / scoreTab / currentPage`），持久化逻辑改为同时写入业务键 + 会话键。

### P1-⑥ URL hash 路由（实际未生效）

**问题**：侧边栏点击切换 view 时 URL 不变，刷新丢失当前位置，无法使用浏览器前进/后退。

**修复**：
- `render()` 中 view 变化时 `history.replaceState` 同步 hash
- 新增 `hashchange` 监听器，URL 改变时反向更新 `state.view`
- `initRoute()` 启动时从 hash 恢复 view

### P1-⑦ 列表分页（实际未生效）

**问题**：`pageSize / currentPage` 已定义但未被任何列表视图使用。

**修复**：
- 新增 `pageSlice(viewKey, array)` —— 按当前页切片并保留原始 index
- 新增/改造 `pagination(viewKey, total)` —— 渲染翻页控件
- 改造所有列表视图（projects / series / results / plans / relations / courses / videos / articles）使用 `pageSlice` + `pagination`
- `goto-page` 在中央 click handler 中优先于 `data-view` 处理，避免误跳页
- 切换"独立/补充测评"Tab 时清空 projects currentPage

---

## P2：边角问题与一致性

> 主题：补齐"已经能用，但还有瑕疵"的小问题

### P2-④ 补充测评 Tab 数据不一致

**问题**：`projects()` 用 `state.projects` 全集计算 stats 和分页，但实际渲染的是当前 Tab 过滤后的 rows —— 独立/补充测评 stats/pagination 与表格行数不符。

**修复**：
- stats 改用 `rows` 计算（当前 Tab 行数）
- stats 标题从"全部项目"改为"独立测评项目 / 补充测评项目"
- 标题副文案同步改为"创建和管理{独立/补充}测评项目..."
- 切换 Tab 时 `delete state.currentPage['projects']`，避免残留页码

### P2-⑥ 报告配置预览为空

**问题**：项目级 / 系列级报告配置 Modal 右侧"预览"区仅有一个"模拟预览"按钮，默认不展示报告样子 —— 用户必须点按钮才能预览，且不能对比不同报告组件效果。

**修复**：
- Modal 重构为两列布局：左侧表单（报告组件 select / 启用 checkbox / 报告定义说明）+ 右侧实时预览
- 右侧实时渲染当前配置对应的报告 HTML
- 切换 report key / 切换启用 checkbox → 右侧实时刷新（不需要点按钮）
- 自动选择样本数据：该项目已有真实结果则用真实结果，否则用统一 mock 数据
- 新增 `data-action="save-report-config"` 处理"保存"按钮（原 form submit 逻辑移到独立 handler）
- 新增 CSS：`.report-config-layout` / `.report-config-form` / `.report-config-preview`，移动端单列适配

### P2-⑦ stage-config 预览为空

**问题**：计划关卡配置右侧"配置预览"区只显示"配置说明"4 行文字，没有真实的关卡结构预览。

**修复**：
- `stagePreviewHTML()` 重写：保留划分方式/解锁规则 summary，新增 stage-preview-list，每个关卡用卡片（tag + 名称 + 任务 chips）展示
- 第一关 tag 高亮蓝色 + "(默认解锁)" 标识
- 未分配任务的关卡显示 "(尚未分配任务)" 占位
- 新增 CSS：`.stage-preview-card` / `.stage-preview-card-tag` / `.stage-preview-task-chip`

### P2-⑧ series 名字不一致

**问题**：`relationItems[4].project = '综合心理健康评估系列'`，但 `seriesItems` 中实际名称是 `'综合心理健康评估'` —— 系列选择下拉找不到匹配项。

**修复**：`relationItems[4].project` 修正为 `'综合心理健康评估'`。

### P2-host dev-server 局域网绑定

**问题**：`dev-server.mjs` 用 `'.listen(port, '127.0.0.1')'` 仅绑定本地，团队成员通过局域网 IP 访问不到。

**修复**：
- 默认改为 `'0.0.0.0'`，支持局域网访问
- 通过环境变量 `HOST=127.0.0.1` 可恢复仅本地
- 启动日志显示当前监听范围

---

## P3：关联规则归属重构

> 主题：让关联规则从"顶层独立模块"变成"项目/系列的子能力"

### P3 关联规则归属重构（方案 ①）

**问题**：关联规则在侧栏是顶层菜单（"任务关联管理 → 关联规则配置"），用户需要从一堆飘在空中的规则里选 project 编辑，**配置语境断裂**，且与"关联规则是项目子能力"的实际语义不符。

**修复**：
- **侧栏移除"任务关联管理"菜单**
- **新建 `projectRelations(projectName)` / `seriesRelations(targetName)` view**：从项目/系列详情进入，规则严格按 `state.projectRelationContext.targetName` 过滤
- **新增 `state.projectRelationContext = { targetName, isSeries }`**（持久化到 `sessionStateKeys`）
- **`projectRow` / `seriesRow` 行操作新增"关联规则 (N)"按钮**（带规则计数 chip）
- **`openRelationModal` 根据 context 锁定 project 字段**：副标题改为"为「XX」配置关联规则 —— 此规则仅属于该项目/系列"，Modal 顶部用蓝色锁定 chip 显示项目名
- **路由兼容**：旧的 `#relations` hash 通过 `migrateLegacyRelationsHash` 重定向到 `#projects`
- **`isKnownView` 加入 `project-relations` / `series-relations`**
- **`breadcrumb` 修复**：根据上下文显示"返回测试项目管理" / "返回系列测评管理"

**新增功能**：
- **`openBulkRelationSimulator(targetName, isSeries)` 批量试运行本项目/系列的所有规则**：顶部按钮"试运行本项目所有规则"+ 每条规则卡片显示命中数/派单任务数/命中率，可点"详细试运行"跳到单规则试运行
- **"可试运行结果" stat**：显示当前项目/系列关联的结果数量
- **5 个 stats（替代原 4 个）**：本项目/系列规则数 / 启用中 / 已停用 / 关联任务数 / 可试运行结果

**改动文件**：
- `app.js`：
  - `navGroups` 删除 relations 组
  - 新增 `scopedRelationRows / scopedRelationRow / ensureRelationContext / projectRelations / seriesRelations / scopedRelationView / openBulkRelationSimulator`
  - `projectRow` / `seriesRow` 加"关联规则"按钮
  - `openRelationModal` 支持锁定 project
  - `relations()` 改为 redirect 到 projects
  - `breadcrumb` 加 `back-relation-list` 处理
  - `isKnownView` / `migrateLegacyRelationsHash` / 路由兼容
  - 5 个 click handler 新增：`open-project-relations` / `open-series-relations` / `back-relation-list` / `simulate-all-relations` / `save-report-config`
- `styles.css`：新增 `.locked-project-field`（蓝色锁定 chip 样式）

**验证**：浏览器实测全流程：项目列表 → 关联规则 (3) → 进入项目关联规则页 → 试运行本项目所有规则 → 批量试运行 Modal → 详细试运行单规则 → 编辑规则（project 字段锁定）→ 返回测试项目管理 → 系列测评管理 → 系列关联规则页 → breadcrumb 正确 → 老 `#relations` hash 自动重定向到 `#projects`

---

## 排查备注

### 浏览器 cache 问题
浏览器对 `app.js` / `styles.css` 有较强的 disk cache —— 修改后首次刷新可能仍拿到旧版。

**绕过**：在 `<script>` / `<link>` 后加版本号 `?v=2` 强制刷新（见 `index.html`）。

### ESC + dirty 保护（已实现）
所有 Modal 在用户输入且未保存时按 ESC 弹出确认而非直接关闭 —— 已在 P1 复查阶段确认存在，不属于 P1 缺失项。
