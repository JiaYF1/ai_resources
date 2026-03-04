我要创建一个AI资源网站，主要功能如下：1.整合各类AI网站资源，支持用户点击跳转至对应的链接2.整合自己的学习笔记，学习笔记通过解析md文档进行回显
前端UI空间采用elementplus，其主页为：https://element-plus.org/zh-CN/component/overview
整体页面分为header，包含网站title，个人头像和用户名等，下方分为左右结构，左边是菜单栏，使用element的menu，menu的结构可以通过一个对象来管理，包含一级menu，children中为submenu，右边则为每个menu下的组件
从路由设计上来看，目前包含一个首页、一个AI资源、AI知识库的一级路由，首页暂时没有子路由，AI资源中包含模型汇总、模型对比两个子路由，AI知识库包含AI基本概念、AI应用手册两个子路由
项目构建时，所有的路由页面放在view文件夹中，公共组件放在components文件夹中，一些类型定义放在types文件夹中

## 项目文件结构

```
src/
├── config/
│   ├── menu.ts           # 菜单配置对象
│   ├── models.ts         # AI 模型配置（可用模型、侧边栏菜单等）
│   └── notebooks.ts      # 笔记分类配置
├── types/
│   ├── menu.ts           # MenuItem 类型定义
│   ├── model-comparison.ts  # 模型对比相关类型定义
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
├── App.vue               # 主布局（Header + Sidebar + RouterView）
└── assets/
    └── main.css          # 全局样式
```

## 已完成的功能

### 基础布局
- Header（深色顶栏，含标题和用户头像）+ 左侧 220px 菜单 + 右侧内容区
- 菜单：通过 menu.ts 配置对象驱动，支持一级/子菜单结构，点击自动路由跳转

### 路由系统
- 首页: `/`
- AI资源:
  - 模型汇总: `/ai-resources/model-summary`
  - 模型对比: `/ai-resources/model-comparison`
    - 多模型对话: `/ai-resources/model-comparison/chat`
    - 历史会话: `/ai-resources/model-comparison/c/:sessionId?`
    - 历史列表: `/ai-resources/model-comparison/history`
    - 图像生成: `/ai-resources/model-comparison/image-generator`
- AI知识库:
  - AI基本概念: `/ai-knowledge/ai-concepts`
    - 笔记详情: `/ai-knowledge/ai-concepts/:category`
  - AI应用手册: `/ai-knowledge/ai-manual`
    - 笔记详情: `/ai-knowledge/ai-manual/:category`

**路由设计说明**：笔记详情页作为AI知识库的子路由，确保左侧菜单能正确高亮选中对应的菜单项。

### 公共组件：NotebookCategoryGrid

**文件**: `src/components/NotebookCategoryGrid.vue`

封装了笔记分类卡片的展示逻辑，供 `AIManual.vue` 和 `AIConcepts.vue` 复用。

**Props**:
- `groups: NotebookGroup[]` — 笔记大分类数据
- `themeColor: string` — 主题颜色（默认 `#409eff`），控制标题色、卡片 hover 边框色、箭头色
- `routeBase: string` — 点击卡片时的路由前缀（如 `/ai-knowledge/ai-manual`）

**功能**:
- 按大分类分组展示笔记小分类卡片
- 卡片显示：图标、名称、描述、笔记数量
- 仅当该分类下有笔记时（`notebooks.length > 0`）才允许点击跳转
- 使用 CSS 自定义属性（`--theme-color`）实现动态主题色

### 笔记系统架构

#### 1. 配置管理
- **配置文件**: `src/config/notebooks.ts`
  - `aiManualConfig`: AI应用手册的笔记配置
  - `aiConceptsConfig`: AI基本概念的笔记配置
  - `findCategoryByKey()`: 根据category key查找对应分类

- **配置结构**:
  ```
  NotebookConfig
  └── groups (大分类)
      └── categories (小分类)
          └── notebooks (笔记列表)
  ```

#### 2. 类型定义 (`src/types/notebook.ts`)
- `Notebook`: 单个笔记（id, name, path）
- `NotebookCategory`: 小分类（key, name, description, icon, notebooks[]）
- `NotebookGroup`: 大分类（id, name, categories[]）
- `NotebookConfig`: 配置类型（groups[]）

#### 3. 页面功能

**AIManual.vue / AIConcepts.vue（分类汇总页）**
- 传入对应 config 的 groups 和 themeColor 给 `NotebookCategoryGrid` 组件
- AIManual 主题色：`#409eff`（蓝色）
- AIConcepts 主题色：`#67c23a`（绿色）

**NotebookDetail.vue（笔记详情页）**
- 布局：面包屑导航 + 左侧目录树 + 中间内容区 + 右侧目录
- 左侧：使用 `el-tree` 展示该分类下所有笔记
- 中间：使用 `md-editor-v3` 的 `MdPreview` 组件预览Markdown内容
- 右侧：使用 `MdCatalog` 组件显示文档目录
- 自动修复Markdown中的图片相对路径

#### 4. Markdown加载机制
- 笔记文件存放在 `public/notebooks/` 目录
- 使用 `fetch()` 异步加载md文件
- 自动处理图片路径：将 `./images/xxx.png` 转换为绝对路径
- 支持点击目录树切换笔记

#### 5. 笔记分类配置

**AI应用手册分类（aiManualConfig）**:
- AI 大模型: GPT 系列, Claude 模型
- AI编程: Claude, Gemini, GitHub Copilot, OpenAI Codex
- AI 知识库: IMA, Obsidian, Notion

**AI基本概念分类（aiConceptsConfig）**:
- AI 核心概念: AI与机器学习、大语言模型（LLM）、Embedding与向量
- AI Agent 技术栈: Agent基础、RAG检索增强生成、MCP模型上下文协议、Function Calling
- Prompt 工程: Prompt基础、高级提示技术
- AI 生态与工程: 开发框架、AI安全与对齐

## 使用说明

### 添加新笔记
1. 在 `public/notebooks/` 目录下创建对应的md文件
2. 在 `src/config/notebooks.ts` 中添加笔记配置
3. 配置包含：笔记名称、文件路径、所属分类

### 添加新分类
1. 在 `src/config/notebooks.ts` 的对应配置中添加新的 `NotebookCategory`
2. 指定分类的 key（用于路由）、名称、描述、图标
3. 添加该分类下的笔记列表

### 模型对比 —— ChatHub 多模型对话工具箱

**布局**: 参考 ChatHub (https://app.chathub.gg/) 设计

左右分屏结构：
- **左侧**：深色主题导航栏（`Sidebar.vue`），可折叠
- **右侧**：子路由出口，展示对话/历史/图像生成等页面

#### 侧边栏功能分区

1. **模型对比**
   - 单模型 / 双模型 / 三模型 / 四模型
   - 点击切换对话面板数量（1-4）

2. **工具**
   - 图像生成器（DALL-E）

3. **历史记录**
   - 查看历史会话列表

#### 组件拆分 (`src/components/model-comparison/`)

| 组件 | 功能 |
|------|------|
| `Sidebar.vue` | 深色主题侧边栏，支持折叠，菜单分区展示 |
| `ChatPanel.vue` | 单个聊天面板，包含头部和消息列表 |
| `ChatHeader.vue` | 面板头部（模型名称、切换模型、关闭按钮） |
| `MessageBubble.vue` | 消息气泡（用户/AI 样式区分） |
| `MessageInput.vue` | 底部输入框，支持 Enter 发送 |

#### 类型定义 (`src/types/model-comparison.ts`)

- `Message`: 消息（id, role, content, timestamp）
- `ModelConfig`: 模型配置（id, name, provider, modelId, color, logo）
- `ChatSession`: 会话（包含多个面板）
- `ChatPanel`: 单个面板数据
- `ApiKeys`: API Key 存储结构

#### 模型配置 (`src/config/models.ts`)

**支持的模型**:
| 模型 | Provider | Model ID |
|------|----------|----------|
| GPT-4o | OpenAI | gpt-4o |
| GPT-4o Mini | OpenAI | gpt-4o-mini |
| Claude 3.5 Sonnet | Anthropic | claude-3-5-sonnet-20241022 |
| Claude 3 Opus | Anthropic | claude-3-opus-20240229 |
| Gemini 1.5 Pro | Google | gemini-1.5-pro |
| Gemini 2.0 Flash | Google | gemini-2.0-flash |
| DeepSeek V3 | DeepSeek | deepseek-chat |

**新增模型步骤**:
1. 在 `src/config/models.ts` 的 `AVAILABLE_MODELS` 数组中添加新模型配置
2. 若是新 provider，在 `src/types/model-comparison.ts` 的 `ProviderType` 和 `PROVIDER_LABELS` 中添加对应条目
3. 在 `ChatView.vue` 的 `callModel` switch 中添加对应 provider 的调用函数

**API Key 管理**:
- 点击"API 设置"弹窗配置各 provider 的 API Key
- Key 通过 `localStorage` 保存在本地浏览器，不上传服务器
- 存储键名：`ai-chat-api-keys`

**API 调用**:
- OpenAI / DeepSeek：标准 REST，`Authorization: Bearer <key>`
- Anthropic：需要 `anthropic-dangerous-direct-browser-access: true` header
- Gemini：URL 参数传 key，role 字段 `assistant` → `model`

#### 图像生成器 (`ImageGenerator.vue`)

- 支持 DALL-E 2 / DALL-E 3
- 可选图像尺寸：1024×1024、1792×1024（横向）、1024×1792（纵向）
- 生成的图像显示在网格中，支持下载

### 技术栈
- Vue 3 + TypeScript
- Element Plus (UI组件库)
- Vue Router (路由管理)
- md-editor-v3 (Markdown预览)
- Vite (构建工具)
