# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

这是一个使用Vue 3、TypeScript、Vite和Element Plus构建的人工智能资源和知识库Web应用程序。该应用程序是人工智能相关文档、教程和模型比较的集中平台。它具有响应式侧边栏导航、基于md-editor-v3的笔记本系统和基于SSE的聊天功能。

## 开发命令

```bash
# 安装依赖（使用 pnpm）
pnpm install

# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 生产环境构建（并行运行 type-check + build-only）
npm run build

# 仅构建（不进行类型检查）
npm run build-only

# 预览生产构建
npm run preview

# 使用 Prettier 格式化代码
npm run format
```

## 架构设计

### 核心结构

- **应用布局**: `src/App.vue` 管理响应式布局，桌面端使用可折叠侧边栏，移动端使用抽屉式侧边栏。断点为 768px。
- **路由**: Vue Router 配合懒加载视图。主要路由: `/` (首页), `/ai-resources/*`, `/ai-knowledge/*`
- **状态管理**: Pinia stores 位于 `src/stores/`
- **路径别名**: `@/` 映射到 `src/`

### 笔记本系统

应用使用 `src/config/notebooks.ts` 中定义的分层笔记本结构：

- **NotebookGroup**: 顶级分类（例如 "AI编程", "提示工程"）
- **NotebookCategory**: 子分类，包含 key、name、description、icon 和 notebooks 数组
- **Notebook**: 单个 markdown 文件，包含 id、name 和 path

两个主要配置：

- `aiManualConfig`: AI 应用手册 (`/ai-knowledge/ai-manual`)
- `aiConceptsConfig`: AI 概念文档 (`/ai-knowledge/ai-concepts`)

Markdown 文件存储在 `public/notebooks/` 中并动态加载。`NotebookDetail.vue` 组件使用 `md-editor-v3` 处理渲染，自动修复相对图片路径以适配 base URL。

### 菜单系统

导航菜单在 `src/config/menu.ts` 中配置，支持：

- 内部路由 (`path`)
- 外部链接 (`externalLink`)
- 带图标的嵌套子菜单（Element Plus 图标）

### 自动导入

项目使用 `unplugin-auto-import` 和 `unplugin-vue-components`：

- Vue API 自动导入（ref、computed 等）
- Element Plus 组件自动导入
- 类型定义生成在 `auto-imports.d.ts` 和 `components.d.ts` 中

### SSE 工具

`src/utils/sse.ts` 提供 `parseSSEResponse()` 用于处理 Server-Sent Events 流，用于聊天/模型对比功能。解析 `data: ` 前缀的消息并处理 `[DONE]` 终止符。

### 样式

- TailwindCSS 4.2.1 用于工具类
- Element Plus 主题配置（size: 'small', zIndex: 3000）
- 组件作用域样式使用 CSS 变量
- 主样式文件在 `src/assets/styles/main.css`

## 环境变量

- `.env.development`: 开发环境配置
- `.env.production`: 生产环境配置
- `VITE_BASE_URL`: 部署的基础 URL（默认为 `/`）

## TypeScript 配置

- `tsconfig.app.json`: 应用特定配置，启用 `noUncheckedIndexedAccess: true` 以提高安全性
- `tsconfig.node.json`: Node/构建工具配置
- 路径映射: `@/*` → `./src/*`

## 主要依赖

- Vue 3.5.29 + Vue Router 5.0.3
- Element Plus 2.13.3 (UI 组件)
- md-editor-v3 6.3.1 (Markdown 预览/编辑)
- Pinia 3.0.4 (状态管理)
- TailwindCSS 4.2.1
- Vite 7.3.1

## Node 版本

需要 Node.js ^20.19.0 || >=22.12.0

## 项目文件结构

```
src/
├── config/
│   ├── menu.ts           # 菜单配置对象
│   ├── models.ts         # AI 模型配置（可用模型、侧边栏菜单等）
│   └── notebooks.ts      # 笔记分类配置
├── types/
│   ├── menu.ts           # MenuItem 类型定义
│   ├── model-comparison.ts  # 模型对比相关类型定义（含 ChatEvent, ChatError, SendMessageParams）
│   └── notebook.ts       # 笔记相关类型定义
├── components/
│   ├── AppHeader.vue          # 顶部导航栏（标题 + 头像 + 用户名）
│   ├── AppSidebar.vue         # 左侧菜单栏（基于 el-menu）
│   ├── NotebookCategoryGrid.vue  # 笔记分类卡片网格（公共组件）
│   └── model-comparison/      # 模型对比相关组件
│       ├── Sidebar.vue        # 模型工具箱侧边栏（深色主题）
│       ├── ChatPanel.vue      # 单个聊天面板
│       ├── ChatHeader.vue     # 聊天面板头部
│       ├── MessageBubble.vue  # 消息气泡
│       └── MessageInput.vue   # 消息输入框
├── views/
│   ├── HomeView.vue      # 首页（快捷入口卡片）
│   ├── NotebookDetail.vue # 笔记详情页
│   ├── ai-resources/
│   │   ├── ModelSummary.vue    # 模型汇总（AI资源卡片 + 跳转链接）
│   │   ├── ModelComparison.vue # 模型对比（左右分屏布局）
│   │   └── model-comparison/   # 模型对比子路由页面
│   │       ├── ChatView.vue       # 多模型对话页面
│   │       ├── HistoryView.vue    # 历史会话列表
│   │       └── ImageGenerator.vue # 图像生成器
│   └── ai-knowledge/
│       ├── AIConcepts.vue # AI基本概念（使用 NotebookCategoryGrid 展示分类）
│       └── AIManual.vue   # AI应用手册（使用 NotebookCategoryGrid 展示分类）
├── router/
│   └── index.ts          # 路由配置
├── utils/
│   ├── sse.ts            # SSE (Server-Sent Events) 流式响应解析器
│   └── bots/             # 各模型 API 通信层（Bot 架构）
│       ├── abstract-bot.ts   # AbstractBot 基类（统一错误捕获）
│       ├── index.ts          # getBot() 工厂函数
│       ├── openai/index.ts   # OpenAI 流式实现
│       ├── anthropic/index.ts # Anthropic 流式实现
│       ├── gemini/index.ts   # Gemini 流式实现
│       └── deepseek/index.ts # DeepSeek 流式实现
├── App.vue               # 主布局（Header + Sidebar + RouterView）
└── assets/
    └── main.css          # 全局样式
```

## 维护规则（给 Claude 看的）

- 每次我们确定新的代码规范，请主动建议更新此文件
- 发现项目结构有重大变化时，提醒我更新项目概述
- 新增依赖后，更新技术栈列表
