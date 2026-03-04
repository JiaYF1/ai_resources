<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Delete, Clock, ChatDotRound } from '@element-plus/icons-vue'
import type { ChatSession } from '@/types/model-comparison'

const router = useRouter()

// Mock history data - in real app, this would come from localStorage or API
const sessions = ref<ChatSession[]>([
  {
    id: '1',
    title: 'GPT vs Claude 对比测试',
    panelCount: 2,
    panels: [],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: '2',
    title: '多模型代码生成测试',
    panelCount: 4,
    panels: [],
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 86400000,
  },
])

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const openSession = (session: ChatSession) => {
  router.push(`/ai-resources/model-comparison/c/${session.id}`)
}

const deleteSession = (sessionId: string) => {
  sessions.value = sessions.value.filter((s) => s.id !== sessionId)
}
</script>

<template>
  <div class="history-view">
    <div class="header">
      <h2>
        <el-icon><Clock /></el-icon>
        历史会话
      </h2>
      <p class="subtitle">查看和继续之前的对话</p>
    </div>

    <div class="sessions-list" v-if="sessions.length">
      <div
        v-for="session in sessions"
        :key="session.id"
        class="session-card"
        @click="openSession(session)"
      >
        <div class="session-icon">
          <el-icon :size="24"><ChatDotRound /></el-icon>
        </div>
        <div class="session-info">
          <div class="session-title">{{ session.title }}</div>
          <div class="session-meta">
            <span>{{ session.panelCount }} 个模型</span>
            <span class="divider">·</span>
            <span>{{ formatDate(session.updatedAt) }}</span>
          </div>
        </div>
        <el-button
          class="delete-btn"
          text
          type="danger"
          :icon="Delete"
          @click.stop="deleteSession(session.id)"
        />
      </div>
    </div>

    <el-empty v-else description="暂无历史会话" />
  </div>
</template>

<style scoped>
.history-view {
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

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.session-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e4e7ed;
  cursor: pointer;
  transition: all 0.2s;
}

.session-card:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.session-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  border-radius: 10px;
  color: #409eff;
}

.session-info {
  flex: 1;
}

.session-title {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.session-meta {
  font-size: 13px;
  color: #909399;
}

.divider {
  margin: 0 6px;
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.15s;
}

.session-card:hover .delete-btn {
  opacity: 1;
}
</style>
