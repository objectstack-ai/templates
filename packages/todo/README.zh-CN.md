# Todo — ObjectStack 起步模板

> 一个小而真实的任务与项目跟踪应用。可作为任何形如 *"按某种方式分组的待办事项"* 的内部工具的起步分支。

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/objectstack-ai/templates/tree/main/packages/todo)

📜 **请先阅读 [CHARTER.md](./CHARTER.md)** —— 它说明了模板的边界与设计取舍。

## 在浏览器中运行

点击上方 StackBlitz 徽章可在 WebContainer 中启动本模板。WebContainer 内无法编译 `better-sqlite3`，模板改用 `@objectstack/driver-sqlite-wasm`（基于 sql.js）。`.stackblitzrc` 中已设置 `OS_DATABASE_DRIVER=sqlite-wasm`，独立运行栈会自动选择 WASM 驱动。`packageManager` 字段固定 **pnpm**，避免 npm 在 WebContainer 中触发 `better-sqlite3` 的可选依赖错误。

## 快速开始

```bash
# 1. 脚手架
pnpm dlx @objectstack/cli create my-app --template todo
cd my-app

# 2. 安装并运行
pnpm install
pnpm dev   # http://localhost:4002
```

首次访问会跳转到 `/_account/setup` 创建管理员账户。

## 适用场景

- 内部团队的任务管理 / 项目跟踪
- 带审批流的待办事项
- 需要看板 / 列表 / 日历多视图的轻量协作工具
- 想用作脚手架快速衍生其他业务对象（工单、需求、报销单等）

## 国际化

模板内置 `en` / `zh-CN` / `ja-JP` / `es-ES` 四种语言的应用内字面量翻译，
`objectstack.manifest.json` 中的 `translations` 字段同时为应用市场页面
（`displayName` / `description` / `readme` / `tagline`）提供多语言版本。

切换语言：在用户菜单或环境设置中切换 locale，UI 会自动按 `requested →
language-only → fallback ('en')` 的链路解析。
