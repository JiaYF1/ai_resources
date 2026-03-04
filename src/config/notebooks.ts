import type { NotebookConfig } from '@/types/notebook';

// AI应用手册配置
export const aiManualConfig: NotebookConfig = {
  groups: [
    // 新增的大类：AI 大模型
    {
      id: 'ai-large-models',
      name: 'AI 模型及Agent',
      categories: [
        // {
        //   key: 'gpt-series',
        //   name: 'GPT 系列',
        //   description: '包括 GPT-3/4/4.1 等 OpenAI 大模型的用法与对比',
        //   icon: '🤖',
        //   notebooks: []
        // },
        // {
        //   key: 'claude-models',
        //   name: 'Claude 模型',
        //   description: 'Anthropic Claude 系列大模型介绍与实践',
        //   icon: '🧠',
        //   notebooks: []
        // },
        {
          key: 'gemini',
          name: 'Gemini',
          description: 'Google Gemini AI使用指南',
          icon: '💎',
          notebooks: [
            // {
            //   id: 'gemini-intro',
            //   name: 'Gemini入门',
            //   path: '/notebooks/gemini/gemini-intro.md'
            // }
          ]
        },
        {
          key: 'openclaw',
          name: 'OpenClaw',
          description: 'OpenClaw AI使用指南',
          icon: '🦞',
          notebooks: [
            // {
            //   id: 'gemini-intro',
            //   name: 'Gemini入门',
            //   path: '/notebooks/gemini/gemini-intro.md'
            // }
          ]
        },
      ]
    },
    {
      id: 'ai-programming',
      name: 'AI编程',
      categories: [
        {
          key: 'claude',
          name: 'Claude',
          description: 'Claude AI编程助手使用手册，包括提示词技巧、API调用等',
          icon: '/icons/claude.svg',
          notebooks: [
            {
              id: 'claude-install',
              name: 'Claude安装与配置',
              path: '/notebooks/claude/claude安装.md'
            },
            // {
            //   id: 'claude-advanced',
            //   name: 'Claude高级技巧',
            //   path: '/notebooks/claude/claude-advanced.md'
            // }
          ]
        },

        {
          key: 'copilot',
          name: 'GitHub Copilot',
          description: 'GitHub Copilot代码补全工具使用手册',
          icon: '🚀',
          notebooks: [
            // {
            //   id: 'copilot-setup',
            //   name: 'Copilot配置指南',
            //   path: '/notebooks/copilot/copilot-setup.md'
            // }
          ]
        },
        {
          key: 'codex',
          name: 'OpenAI Codex',
          description: 'OpenAI Codex编程模型使用指南',
          icon: '⚡',
          notebooks: [
            // {
            //   id: 'codex-intro',
            //   name: 'Codex介绍',
            //   path: '/notebooks/codex/codex-intro.md'
            // }
          ]
        }
      ]
    },
    {
      id: 'ai-knowledge-base',
      name: 'AI 知识库',
      categories: [
        {
          key: 'IMA',
          name: 'IMA',
          description: '提示词工程与关键词架构的技巧与最佳实践',
          icon: '✍️',
          notebooks: []
        },
        {
          key: 'Obsidian',
          name: 'Obsidian',
          description: 'Obsidian 笔记管理、插件与模板资源',
          icon: '📝',
          notebooks: []
        },
        {
          key: 'Notion',
          name: 'Notion',
          description: 'Notion 页面模板、数据库与 AI 协同方案',
          icon: '📂',
          notebooks: []
        }
      ]
    },
    // {
    //   id: 'ai-prompt',
    //   name: 'AI prompt',
    //   categories: [
    //     {
    //       key: 'prompt-engineering',
    //       name: 'Prompt工程',
    //       description: '提示词工程技巧与最佳实践',
    //       icon: '✍️',
    //       notebooks: [

    //       ]
    //     },
    //     {
    //       key: 'prompt-templates',
    //       name: 'Prompt模板库',
    //       description: '常用Prompt模板集合',
    //       icon: '📝',
    //       notebooks: [

    //       ]
    //     }
    //   ]
    // },
    // {
    //   id: 'ai-ppt',
    //   name: 'AI生成PPT',
    //   categories: [
    //     {
    //       key: 'gamma',
    //       name: 'Gamma',
    //       description: 'Gamma AI演示文稿生成工具',
    //       icon: '📊',
    //       notebooks: [
    //         {
    //           id: 'gamma-guide',
    //           name: 'Gamma使用指南',
    //           path: '/notebooks/ppt/gamma-guide.md'
    //         }
    //       ]
    //     },
    //     {
    //       key: 'beautiful-ai',
    //       name: 'Beautiful.ai',
    //       description: 'Beautiful.ai智能PPT设计工具',
    //       icon: '🎨',
    //       notebooks: [
    //         {
    //           id: 'beautiful-ai-guide',
    //           name: 'Beautiful.ai教程',
    //           path: '/notebooks/ppt/beautiful-ai-guide.md'
    //         }
    //       ]
    //     }
    //   ]
    // }
  ]
};

// AI基本概念配置
export const aiConceptsConfig: NotebookConfig = {
  groups: [
    {
      id: 'ai-core-concepts',
      name: 'AI 核心概念',
      categories: [
        {
          key: 'ai-ml-basics',
          name: 'AI 与机器学习',
          description: '人工智能、机器学习、深度学习的区别与联系，以及神经网络基础原理',
          icon: '🧠',
          notebooks: []
        },
        {
          key: 'llm-fundamentals',
          name: '大语言模型（LLM）',
          description: 'Transformer、Token、上下文窗口、温度参数等大模型核心技术概念解析',
          icon: '💡',
          notebooks: []
        },
        {
          key: 'embeddings-vectors',
          name: 'Embedding 与向量',
          description: '词向量、语义相似度、向量数据库的原理与实际应用',
          icon: '📐',
          notebooks: []
        }
      ]
    },
    {
      id: 'ai-agent-stack',
      name: 'AI Agent 技术栈',
      categories: [
        {
          key: 'agent-basics',
          name: 'Agent 基础',
          description: '什么是 AI Agent、自主规划与执行能力、常见 Agent 架构与工作原理',
          icon: '🤖',
          notebooks: []
        },
        {
          key: 'rag',
          name: 'RAG 检索增强生成',
          description: 'RAG 的概念、工作流程、如何构建以及在实际场景中的应用',
          icon: '🔍',
          notebooks: []
        },
        {
          key: 'mcp',
          name: 'MCP 模型上下文协议',
          description: 'Model Context Protocol 是什么、如何配置 MCP Server 并在 AI 工具中使用',
          icon: '🔌',
          notebooks: []
        },
        {
          key: 'function-calling',
          name: 'Function Calling / Tool Use',
          description: 'AI 调用外部工具、API 的机制原理与使用方式',
          icon: '🛠️',
          notebooks: []
        }
      ]
    },
    {
      id: 'prompt-engineering',
      name: 'Prompt 工程',
      categories: [
        {
          key: 'prompt-basics',
          name: 'Prompt 基础',
          description: '编写有效提示词的基本原则、角色设定与指令设计技巧',
          icon: '✍️',
          notebooks: []
        },
        {
          key: 'prompt-advanced',
          name: '高级提示技术',
          description: 'Chain-of-Thought、Few-shot、Self-Consistency 等高级提示工程方法',
          icon: '🎯',
          notebooks: []
        }
      ]
    },
    {
      id: 'ai-ecosystem',
      name: 'AI 生态与工程',
      categories: [
        {
          key: 'ai-frameworks',
          name: '开发框架',
          description: 'LangChain、LlamaIndex 等主流 AI 开发框架的概念、定位与选型建议',
          icon: '🔗',
          notebooks: []
        },
        {
          key: 'ai-safety',
          name: 'AI 安全与对齐',
          description: '幻觉问题、模型偏见、RLHF、AI 对齐等安全相关核心概念',
          icon: '🛡️',
          notebooks: []
        }
      ]
    }
  ]
};
