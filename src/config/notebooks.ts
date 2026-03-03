import type { NotebookConfig } from '@/types/notebook';

// AI应用手册配置
export const aiManualConfig: NotebookConfig = {
  groups: [
    {
      id: 'ai-programming',
      name: 'AI编程',
      categories: [
        {
          key: 'claude',
          name: 'Claude',
          description: 'Claude AI编程助手使用手册，包括提示词技巧、API调用等',
          icon: '🤖',
          notebooks: [
            {
              id: 'claude-basic',
              name: 'Claude基础使用',
              path: '/notebooks/claude/claude-basic.md'
            },
            {
              id: 'claude-advanced',
              name: 'Claude高级技巧',
              path: '/notebooks/claude/claude-advanced.md'
            }
          ]
        },
        {
          key: 'gemini',
          name: 'Gemini',
          description: 'Google Gemini AI使用指南',
          icon: '💎',
          notebooks: [
            {
              id: 'gemini-intro',
              name: 'Gemini入门',
              path: '/notebooks/gemini/gemini-intro.md'
            }
          ]
        },
        {
          key: 'copilot',
          name: 'GitHub Copilot',
          description: 'GitHub Copilot代码补全工具使用手册',
          icon: '🚀',
          notebooks: [
            {
              id: 'copilot-setup',
              name: 'Copilot配置指南',
              path: '/notebooks/copilot/copilot-setup.md'
            }
          ]
        },
        {
          key: 'codex',
          name: 'OpenAI Codex',
          description: 'OpenAI Codex编程模型使用指南',
          icon: '⚡',
          notebooks: [
            {
              id: 'codex-intro',
              name: 'Codex介绍',
              path: '/notebooks/codex/codex-intro.md'
            }
          ]
        }
      ]
    },
    {
      id: 'ai-prompt',
      name: 'AI Prompt',
      categories: [
        {
          key: 'prompt-engineering',
          name: 'Prompt工程',
          description: '提示词工程技巧与最佳实践',
          icon: '✍️',
          notebooks: [
            {
              id: 'prompt-basics',
              name: 'Prompt基础',
              path: '/notebooks/prompt/prompt-basics.md'
            },
            {
              id: 'prompt-advanced',
              name: 'Prompt高级技巧',
              path: '/notebooks/prompt/prompt-advanced.md'
            }
          ]
        },
        {
          key: 'prompt-templates',
          name: 'Prompt模板库',
          description: '常用Prompt模板集合',
          icon: '📝',
          notebooks: [
            {
              id: 'coding-prompts',
              name: '编程类Prompt',
              path: '/notebooks/prompt/coding-prompts.md'
            },
            {
              id: 'writing-prompts',
              name: '写作类Prompt',
              path: '/notebooks/prompt/writing-prompts.md'
            }
          ]
        }
      ]
    },
    {
      id: 'ai-ppt',
      name: 'AI生成PPT',
      categories: [
        {
          key: 'gamma',
          name: 'Gamma',
          description: 'Gamma AI演示文稿生成工具',
          icon: '📊',
          notebooks: [
            {
              id: 'gamma-guide',
              name: 'Gamma使用指南',
              path: '/notebooks/ppt/gamma-guide.md'
            }
          ]
        },
        {
          key: 'beautiful-ai',
          name: 'Beautiful.ai',
          description: 'Beautiful.ai智能PPT设计工具',
          icon: '🎨',
          notebooks: [
            {
              id: 'beautiful-ai-guide',
              name: 'Beautiful.ai教程',
              path: '/notebooks/ppt/beautiful-ai-guide.md'
            }
          ]
        }
      ]
    }
  ]
};

// AI基本概念配置
export const aiConceptsConfig: NotebookConfig = {
  groups: [
    {
      id: 'ml-basics',
      name: '机器学习基础',
      categories: [
        {
          key: 'supervised-learning',
          name: '监督学习',
          description: '监督学习的基本概念和算法',
          icon: '📚',
          notebooks: [
            {
              id: 'linear-regression',
              name: '线性回归',
              path: '/notebooks/concepts/linear-regression.md'
            },
            {
              id: 'classification',
              name: '分类算法',
              path: '/notebooks/concepts/classification.md'
            }
          ]
        },
        {
          key: 'unsupervised-learning',
          name: '无监督学习',
          description: '无监督学习的基本概念和算法',
          icon: '🔍',
          notebooks: [
            {
              id: 'clustering',
              name: '聚类算法',
              path: '/notebooks/concepts/clustering.md'
            }
          ]
        }
      ]
    },
    {
      id: 'deep-learning',
      name: '深度学习',
      categories: [
        {
          key: 'neural-networks',
          name: '神经网络',
          description: '神经网络基础知识',
          icon: '🧠',
          notebooks: [
            {
              id: 'nn-basics',
              name: '神经网络基础',
              path: '/notebooks/concepts/nn-basics.md'
            },
            {
              id: 'cnn',
              name: '卷积神经网络',
              path: '/notebooks/concepts/cnn.md'
            }
          ]
        },
        {
          key: 'transformers',
          name: 'Transformer架构',
          description: 'Transformer模型原理与应用',
          icon: '🔄',
          notebooks: [
            {
              id: 'transformer-basics',
              name: 'Transformer基础',
              path: '/notebooks/concepts/transformer-basics.md'
            },
            {
              id: 'attention',
              name: '注意力机制',
              path: '/notebooks/concepts/attention.md'
            }
          ]
        }
      ]
    },
    {
      id: 'nlp',
      name: '自然语言处理',
      categories: [
        {
          key: 'nlp-basics',
          name: 'NLP基础',
          description: '自然语言处理基本概念',
          icon: '💬',
          notebooks: [
            {
              id: 'tokenization',
              name: '分词技术',
              path: '/notebooks/concepts/tokenization.md'
            },
            {
              id: 'word-embedding',
              name: '词向量',
              path: '/notebooks/concepts/word-embedding.md'
            }
          ]
        }
      ]
    }
  ]
};
