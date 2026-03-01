我要创建一个AI资源网站，主要功能如下：1.整合各类AI网站资源，支持用户点击跳转至对应的链接2.整合自己的学习笔记，学习笔记通过解析md文档进行回显
前端UI空间采用elementplus，其主页为：https://element-plus.org/zh-CN/component/overview
整体页面分为header，包含网站title，个人头像和用户名等，下方分为左右结构，左边是菜单栏，使用element的menu，menu的结构可以通过一个对象来管理，包含一级menu，children中为submenu，右边则为每个menu下的组件
从路由设计上来看，目前包含一个首页、一个AI资源、AI知识库的一级路由，首页暂时没有子路由，AI资源中包含模型汇总、模型对比两个子路由，AI知识库包含AI基本概念、AI应用手册两个子路由
项目构建时，所有的路由页面放在view文件夹中，公共组件放在components文件夹中，一些类型定义放在types文件夹中

Update App.vue and global styles
项目构建成功，所有文件已创建完毕。以下是搭建的完整结构：

项目文件结构

src/
├── config/
│ └── menu.ts # 菜单配置对象
├── types/
│ └── menu.ts # MenuItem 类型定义
├── components/
│ ├── AppHeader.vue # 顶部导航栏（标题 + 头像 + 用户名）
│ └── AppSidebar.vue # 左侧菜单栏（基于 el-menu）
├── views/
│ ├── HomeView.vue # 首页（快捷入口卡片）
│ ├── ai-resources/
│ │ ├── ModelSummary.vue # 模型汇总（AI资源卡片 + 跳转链接）
│ │ └── ModelComparison.vue # 模型对比（el-table 表格）
│ └── ai-knowledge/
│ ├── AIConcepts.vue # AI基本概念（Markdown 笔记占位）
│ └── AIManual.vue # AI应用手册（Markdown 笔记占位）
├── router/
│ └── index.ts # 路由配置
├── App.vue # 主布局（Header + Sidebar + RouterView）
└── assets/
└── main.css # 全局样式
已完成的功能
布局：Header（深色顶栏，含标题和用户头像）+ 左侧 220px 菜单 + 右侧内容区
菜单：通过 menu.ts 配置对象驱动，支持一级/子菜单结构，点击自动路由跳转
路由：首页 /、AI资源（模型汇总 /ai-resources/model-summary、模型对比 /ai-resources/model-comparison）、AI知识库（AI基本概念 /ai-knowledge/ai-concepts、AI应用手册 /ai-knowledge/ai-manual）
