// 单个笔记文件
export interface Notebook {
  id: string; // 唯一标识
  name: string; // 笔记名称
  path: string; // 在public文件夹中的路径
}

// 小分类（包含多个笔记）
export interface NotebookCategory {
  key: string; // 唯一标识，用于路由
  name: string; // 分类名称
  description: string; // 分类简介
  icon?: string; // 可选的图标
  notebooks: Notebook[]; // 该分类下的所有笔记
}

// 大分类（包含多个小分类）
export interface NotebookGroup {
  id: string; // 唯一标识
  name: string; // 大分类名称
  categories: NotebookCategory[]; // 该大分类下的所有小分类
}

// 笔记配置类型（用于AIManual和AIConcepts）
export interface NotebookConfig {
  groups: NotebookGroup[]; // 所有大分类
}
