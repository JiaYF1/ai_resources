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
│   └── notebooks.ts      # 笔记分类配置（新增）
├── types/
│   ├── menu.ts           # MenuItem 类型定义
│   └── notebook.ts       # 笔记相关类型定义（新增）
├── components/
│   ├── AppHeader.vue     # 顶部导航栏（标题 + 头像 + 用户名）
│   └── AppSidebar.vue    # 左侧菜单栏（基于 el-menu）
├── views/
│   ├── HomeView.vue      # 首页（快捷入口卡片）
│   ├── NotebookDetail.vue # 笔记详情页（新增）
│   ├── ai-resources/
│   │   ├── ModelSummary.vue    # 模型汇总（AI资源卡片 + 跳转链接）
│   │   └── ModelComparison.vue # 模型对比（el-table 表格）
│   └── ai-knowledge/
│       ├── AIConcepts.vue # AI基本概念（分类卡片汇总页）
│       └── AIManual.vue   # AI应用手册（分类卡片汇总页）
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
- AI知识库:
  - AI基本概念: `/ai-knowledge/ai-concepts`
    - 笔记详情: `/ai-knowledge/ai-concepts/:category`
  - AI应用手册: `/ai-knowledge/ai-manual`
    - 笔记详情: `/ai-knowledge/ai-manual/:category`

**路由设计说明**：笔记详情页作为AI知识库的子路由，确保左侧菜单能正确高亮选中对应的菜单项。

### 笔记系统架构（新增）

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
- `NotebookConfig`: 配置类型（type, groups[]）

#### 3. 页面功能

**AIManual.vue / AIConcepts.vue（分类汇总页）**
- 使用 `el-card` 展示所有笔记分类
- 按大分类分组展示
- 每个卡片显示：图标、名称、描述、笔记数量
- 点击卡片跳转到 `/notebooks/:category` 路由

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

#### 5. 示例配置

**AI应用手册分类**:
- AI编程: Claude, Gemini, GitHub Copilot, OpenAI Codex
- AI Prompt: Prompt工程, Prompt模板库
- AI生成PPT: Gamma, Beautiful.ai

**AI基本概念分类**:
- 机器学习基础: 监督学习, 无监督学习
- 深度学习: 神经网络, Transformer架构
- 自然语言处理: NLP基础

## 使用说明

### 添加新笔记
1. 在 `public/notebooks/` 目录下创建对应的md文件
2. 在 `src/config/notebooks.ts` 中添加笔记配置
3. 配置包含：笔记名称、文件路径、所属分类

### 添加新分类
1. 在 `src/config/notebooks.ts` 的对应配置中添加新的 `NotebookCategory`
2. 指定分类的 key（用于路由）、名称、描述、图标
3. 添加该分类下的笔记列表

### 技术栈
- Vue 3 + TypeScript
- Element Plus (UI组件库)
- Vue Router (路由管理)
- md-editor-v3 (Markdown预览)
- Vite (构建工具)
