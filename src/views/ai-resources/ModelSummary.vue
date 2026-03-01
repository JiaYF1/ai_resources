<script setup lang="ts">
interface ModelItem {
  name: string
  provider: string
  description: string
  url: string
  tags: string[]
}

interface ModelCategory {
  id: string
  title: string
  description: string
  models: ModelItem[]
}

const categories: ModelCategory[] = [
  {
    id: 'general',
    title: '通用大模型',
    description: '支持对话、写作、编程、分析等多种通用任务的大语言模型',
    models: [
      {
        name: 'ChatGPT',
        provider: 'OpenAI',
        description: '功能强大的通用对话 AI，支持文本生成、代码编写、翻译等多种任务',
        url: 'https://chat.openai.com',
        tags: ['对话', '代码', '写作'],
      },
      {
        name: 'Claude',
        provider: 'Anthropic',
        description: '注重安全和有用性的 AI 助手，擅长长文本分析和编程',
        url: 'https://claude.ai',
        tags: ['对话', '分析', '代码'],
      },
      {
        name: 'Gemini',
        provider: 'Google',
        description: 'Google 推出的多模态 AI 模型，支持文本、图像、音频理解',
        url: 'https://gemini.google.com',
        tags: ['多模态', '对话', '搜索'],
      },
      {
        name: 'DeepSeek',
        provider: 'DeepSeek',
        description: '深度求索推出的开源大模型，在代码和数学领域表现优异',
        url: 'https://chat.deepseek.com',
        tags: ['开源', '代码', '数学'],
      },
      {
        name: '文心一言',
        provider: '百度',
        description: '百度推出的知识增强大语言模型，擅长中文理解与生成',
        url: 'https://yiyan.baidu.com',
        tags: ['中文', '对话', '知识'],
      },
      {
        name: '通义千问',
        provider: '阿里巴巴',
        description: '阿里巴巴达摩院研发的大语言模型，支持多语言多任务',
        url: 'https://tongyi.aliyun.com',
        tags: ['中文', '对话', '多模态'],
      },
      {
        name: 'Grok',
        provider: 'xAI',
        description: 'xAI 推出的大语言模型，具备实时信息访问能力',
        url: 'https://grok.com',
        tags: ['对话', '实时', '推理'],
      },
      {
        name: '豆包',
        provider: '字节跳动',
        description: '字节跳动推出的智能 AI 助手，集成多种实用功能',
        url: 'https://www.doubao.com',
        tags: ['中文', '对话', '多模态'],
      },
      {
        name: 'Kimi',
        provider: 'Moonshot AI',
        description: '月之暗面推出的长上下文 AI 助手，擅长长文档处理',
        url: 'https://kimi.moonshot.cn',
        tags: ['长文本', '对话', '搜索'],
      },
    ],
  },
  {
    id: 'video',
    title: '视频生成模型',
    description: '通过文本或图片生成高质量视频内容的 AI 模型',
    models: [
      {
        name: 'Sora',
        provider: 'OpenAI',
        description: '文本生成高质量视频，支持长达一分钟的连贯视频创作',
        url: 'https://sora.com',
        tags: ['文生视频', '高质量', '长视频'],
      },
      {
        name: 'Runway Gen-3',
        provider: 'Runway',
        description: '专业级 AI 视频生成与编辑工具，广泛应用于影视创作',
        url: 'https://runwayml.com',
        tags: ['文生视频', '视频编辑', '专业'],
      },
      {
        name: 'Pika',
        provider: 'Pika Labs',
        description: '简单易用的 AI 视频生成平台，支持文生视频和图生视频',
        url: 'https://pika.art',
        tags: ['文生视频', '图生视频', '易用'],
      },
      {
        name: '可灵',
        provider: '快手',
        description: '快手推出的视频生成大模型，支持高质量中文视频创作',
        url: 'https://kling.kuaishou.com',
        tags: ['文生视频', '中文', '高质量'],
      },
      {
        name: '即梦',
        provider: '字节跳动',
        description: '字节跳动推出的 AI 视频创作平台，支持多种风格生成',
        url: 'https://jimeng.jianying.com',
        tags: ['文生视频', '图生视频', '多风格'],
      },
      {
        name: 'Veo',
        provider: 'Google',
        description: 'Google DeepMind 推出的视频生成模型，支持高分辨率输出',
        url: 'https://deepmind.google/technologies/veo',
        tags: ['文生视频', '高分辨率', '多模态'],
      },
    ],
  },
  {
    id: 'agent',
    title: 'AI Agent',
    description: '具备自主规划和执行能力的智能代理工具',
    models: [
      {
        name: 'Claude Code',
        provider: 'Anthropic',
        description: '命令行编程代理，可自主完成代码编写、调试和项目管理等任务',
        url: 'https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview',
        tags: ['编程', '命令行', '自主执行'],
      },
      {
        name: 'Cursor',
        provider: 'Anysphere',
        description: 'AI 驱动的代码编辑器，集成智能代码补全、重构和对话式编程',
        url: 'https://cursor.com',
        tags: ['编程', 'IDE', '代码补全'],
      },
      {
        name: 'Manus',
        provider: 'Manus AI',
        description: '通用 AI Agent，能够自主完成网页浏览、数据分析等复杂任务',
        url: 'https://manus.im',
        tags: ['通用', '自主执行', '多任务'],
      },
      {
        name: 'Devin',
        provider: 'Cognition',
        description: '全球首个 AI 软件工程师，可自主完成完整的开发任务',
        url: 'https://devin.ai',
        tags: ['编程', '全栈', '自主开发'],
      },
      {
        name: 'AutoGPT',
        provider: '开源社区',
        description: '开源自主 AI Agent 框架，可链式执行复杂任务',
        url: 'https://github.com/Significant-Gravitas/AutoGPT',
        tags: ['开源', '自主执行', '框架'],
      },
      {
        name: 'Coze',
        provider: '字节跳动',
        description: 'AI Bot 开发平台，支持无代码搭建自定义 AI Agent',
        url: 'https://www.coze.com',
        tags: ['平台', '无代码', '自定义'],
      },
    ],
  },
]
</script>

<template>
  <div class="model-summary">
    <!-- <h2>模型汇总</h2> -->
    <!-- <p class="page-desc">收录主流 AI 模型与工具，按类型分类整理，点击即可跳转至官方网站</p> -->

    <div v-for="category in categories" :key="category.id" class="category-section">
      <div class="category-header">
        <h3>{{ category.title }}</h3>
        <span class="category-desc">{{ category.description }}</span>
      </div>
      <div class="model-grid">
        <el-card v-for="model in category.models" :key="model.name" shadow="hover" class="model-card">
          <template #header>
            <div class="card-header">
              <span class="model-name">{{ model.name }}</span>
              <el-tag size="small" type="info">{{ model.provider }}</el-tag>
            </div>
          </template>
          <p class="model-desc">{{ model.description }}</p>
          <div class="card-footer">
            <div class="tags">
              <el-tag v-for="tag in model.tags" :key="tag" size="small" class="tag">
                {{ tag }}
              </el-tag>
            </div>
            <el-link :href="model.url" target="_blank" type="primary">
              访问官网
            </el-link>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.model-summary {
  padding: 24px;
}

h2 {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.page-desc {
  color: #909399;
  font-size: 14px;
  margin-bottom: 32px;
}

.category-section {
  margin-bottom: 36px;
}

.category-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.category-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.category-desc {
  font-size: 13px;
  color: #909399;
}

.model-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.model-card {
  transition: transform 0.2s;
}

.model-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.model-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.model-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 16px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tags {
  display: flex;
  gap: 6px;
}

.tag {
  border-radius: 4px;
}
</style>
