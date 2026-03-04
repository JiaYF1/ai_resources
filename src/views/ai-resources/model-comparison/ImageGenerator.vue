<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture, Download, Refresh, Setting } from '@element-plus/icons-vue'

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  model: string
  createdAt: number
}

const prompt = ref('')
const loading = ref(false)
const settingsVisible = ref(false)
const selectedModel = ref('dall-e-3')
const imageSize = ref('1024x1024')
const generatedImages = ref<GeneratedImage[]>([])

const apiKey = ref('')

// Load API key
const loadApiKey = () => {
  try {
    const stored = localStorage.getItem('ai-chat-api-keys')
    if (stored) {
      const keys = JSON.parse(stored)
      apiKey.value = keys.openai || ''
    }
  } catch {}
}

const saveApiKey = () => {
  try {
    const stored = localStorage.getItem('ai-chat-api-keys')
    const keys = stored ? JSON.parse(stored) : {}
    keys.openai = apiKey.value
    localStorage.setItem('ai-chat-api-keys', JSON.stringify(keys))
    settingsVisible.value = false
    ElMessage.success('API Key 已保存')
  } catch {}
}

loadApiKey()

const models = [
  { id: 'dall-e-3', name: 'DALL-E 3', provider: 'OpenAI' },
  { id: 'dall-e-2', name: 'DALL-E 2', provider: 'OpenAI' },
]

const sizes = [
  { id: '1024x1024', name: '1024 × 1024' },
  { id: '1792x1024', name: '1792 × 1024 (横向)' },
  { id: '1024x1792', name: '1024 × 1792 (纵向)' },
]

const generateImage = async () => {
  if (!prompt.value.trim()) {
    ElMessage.warning('请输入图像描述')
    return
  }

  if (!apiKey.value) {
    ElMessage.warning('请先配置 OpenAI API Key')
    settingsVisible.value = true
    return
  }

  loading.value = true

  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.value}`,
      },
      body: JSON.stringify({
        model: selectedModel.value,
        prompt: prompt.value,
        n: 1,
        size: imageSize.value,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error?.message ?? `请求失败 (${res.status})`)
    }

    const data = await res.json()
    const imageUrl = data.data[0].url

    generatedImages.value.unshift({
      id: `img-${Date.now()}`,
      url: imageUrl,
      prompt: prompt.value,
      model: selectedModel.value,
      createdAt: Date.now(),
    })

    prompt.value = ''
    ElMessage.success('图像生成成功')
  } catch (err) {
    const msg = err instanceof Error ? err.message : '未知错误'
    ElMessage.error(`生成失败: ${msg}`)
  } finally {
    loading.value = false
  }
}

const downloadImage = async (image: GeneratedImage) => {
  try {
    const res = await fetch(image.url)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `generated-${image.id}.png`
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    ElMessage.error('下载失败')
  }
}
</script>

<template>
  <div class="image-generator">
    <div class="header">
      <h2>
        <el-icon><Picture /></el-icon>
        图像生成器
      </h2>
      <p class="subtitle">使用 AI 模型根据文字描述生成图像</p>
    </div>

    <!-- Input Section -->
    <div class="input-section">
      <div class="model-selector">
        <el-select v-model="selectedModel" placeholder="选择模型" style="width: 160px">
          <el-option v-for="m in models" :key="m.id" :label="m.name" :value="m.id" />
        </el-select>
        <el-select v-model="imageSize" placeholder="图像尺寸" style="width: 180px">
          <el-option v-for="s in sizes" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
        <el-button :icon="Setting" @click="settingsVisible = true">API 设置</el-button>
      </div>

      <div class="prompt-input">
        <el-input
          v-model="prompt"
          type="textarea"
          :rows="4"
          placeholder="描述你想生成的图像，例如：一只戴着太阳镜的橘猫在海滩上冲浪，赛博朋克风格"
          resize="none"
        />
        <el-button
          type="primary"
          :icon="Picture"
          :loading="loading"
          :disabled="!prompt.trim()"
          size="large"
          @click="generateImage"
        >
          生成图像
        </el-button>
      </div>
    </div>

    <!-- Generated Images -->
    <div class="images-section" v-if="generatedImages.length">
      <h3>生成的图像</h3>
      <div class="images-grid">
        <div v-for="image in generatedImages" :key="image.id" class="image-card">
          <img :src="image.url" :alt="image.prompt" />
          <div class="image-overlay">
            <p class="image-prompt">{{ image.prompt }}</p>
            <el-button :icon="Download" circle @click="downloadImage(image)" />
          </div>
        </div>
      </div>
    </div>

    <el-empty v-else description="还没有生成的图像" class="empty-state">
      <template #image>
        <el-icon :size="64" color="#c0c4cc"><Picture /></el-icon>
      </template>
    </el-empty>

    <!-- Settings Dialog -->
    <el-dialog v-model="settingsVisible" title="API Key 设置" width="400px">
      <el-alert type="info" :closable="false" style="margin-bottom: 16px">
        需要 OpenAI API Key 来使用 DALL-E 图像生成功能
      </el-alert>
      <el-form label-width="120px">
        <el-form-item label="OpenAI API Key">
          <el-input
            v-model="apiKey"
            type="password"
            show-password
            placeholder="请输入 OpenAI API Key"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="settingsVisible = false">取消</el-button>
        <el-button type="primary" @click="saveApiKey">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.image-generator {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
}

.header {
  margin-bottom: 24px;
}

.header h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.subtitle {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

/* Input Section */
.input-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #e4e7ed;
}

.model-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.prompt-input {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.prompt-input .el-input {
  flex: 1;
}

/* Images Section */
.images-section h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.image-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 1;
  background: #f5f7fa;
}

.image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(transparent 50%, rgba(0, 0, 0, 0.8));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  opacity: 0;
  transition: opacity 0.2s;
}

.image-card:hover .image-overlay {
  opacity: 1;
}

.image-prompt {
  color: #fff;
  font-size: 13px;
  line-height: 1.5;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty-state {
  margin-top: 60px;
}
</style>
