<template>
  <div class="market-section">
    <div class="section-header">
      <h2>AI 市场分析</h2>
      <p>融合被查询与被引用数据，生成针对性改进建议</p>
    </div>
    <div class="market-grid">
      <a-card class="market-card market-control" :bordered="false">
        <div class="market-header">
          <div class="market-title">
            <RobotOutlined />
            <div>
              <h3>藏品市场画像</h3>
              <p>查看场景与调用次数分布</p>
            </div>
          </div>
          <a-tag :color="aiReady ? 'green' : 'gold'">
            {{ aiReady ? 'AI接口已连接' : '使用本地分析' }}
          </a-tag>
        </div>

        <div class="market-field">
          <span>选择藏品</span>
          <a-select v-model:value="selectedAssetName" placeholder="请选择藏品" style="width: 100%">
            <a-select-option
              v-for="item in analysisTargets"
              :key="item.id || item.name"
              :value="item.name"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </div>

        <div class="market-metrics">
          <div class="market-metric">
            <span>总调用</span>
            <strong>{{ usageBreakdown.total }}</strong>
          </div>
          <div class="market-metric">
            <span>查询次数</span>
            <strong>{{ usageBreakdown.queryCount }}</strong>
          </div>
          <div class="market-metric">
            <span>引用次数</span>
            <strong>{{ usageBreakdown.referenceCount }}</strong>
          </div>
        </div>

        <div class="market-scenes">
          <div class="market-scene" v-for="scene in selectedUsageScenes" :key="scene.name">
            <span>{{ scene.name }}</span>
            <strong>{{ scene.count }}</strong>
          </div>
          <a-empty v-if="!selectedUsageScenes.length" description="暂无调用记录" />
        </div>

        <a-button type="primary" block :loading="analysisLoading" @click="runMarketAnalysis">
          <template #icon><LineChartOutlined /></template>
          生成市场分析
        </a-button>
      </a-card>

      <a-card class="market-card market-output" :bordered="false">
        <div class="analysis-header">
          <div class="analysis-title">
            <BulbOutlined />
            <div>
              <h3>分析结果</h3>
              <p>基于数据与场景生成的建议</p>
            </div>
          </div>
          <a-tag v-if="analysisResult" :color="analysisResult.source === 'api' ? 'blue' : 'gold'">
            {{ analysisResult.source === 'api' ? 'AI接口输出' : '本地策略' }}
          </a-tag>
        </div>

        <a-alert v-if="analysisError" type="error" show-icon :message="analysisError" class="analysis-alert" />

        <a-skeleton v-if="analysisLoading" active :paragraph="{ rows: 6 }" />
        <div v-else-if="analysisResult" class="analysis-body">
          <p class="analysis-summary">{{ analysisResult.summary }}</p>
          <div class="analysis-block" v-if="analysisResult.insights?.length">
            <h4>洞察</h4>
            <ul>
              <li v-for="(item, index) in analysisResult.insights" :key="`insight-${index}`">
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="analysis-block" v-if="analysisResult.suggestions?.length">
            <h4>改进建议</h4>
            <ul>
              <li v-for="(item, index) in analysisResult.suggestions" :key="`suggestion-${index}`">
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="analysis-meta">
            生成时间：{{ analysisResult.generatedAt }}
          </div>
        </div>
        <a-empty v-else description="选择藏品后生成分析" />
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import { RobotOutlined, BulbOutlined, LineChartOutlined } from '@ant-design/icons-vue'
import { getUsageForAsset, formatUsageScenes } from '../services/assetUsage'
import { requestMarketAnalysis } from '../services/aiAnalysis'

const props = defineProps({
  assets: {
    type: Array,
    default: () => []
  }
})

const fallbackAssets = [
  { id: 1, name: '新艺术葡萄少女花瓶', certified: true },
  { id: 2, name: '韦奇伍德蓝陶双耳瓶', certified: true },
  { id: 3, name: '彩绘巴洛克执壶', certified: true },
  { id: 4, name: '绿地粉彩中国风茶具', certified: true },
  { id: 5, name: '白瓷北极熊雕塑', certified: true },
  { id: 6, name: '粉彩花卉茶壶套组', certified: true }
]

const assetList = computed(() => (props.assets.length ? props.assets : fallbackAssets))
const analysisTargets = computed(() => {
  const certified = assetList.value.filter((item) => item.certified)
  return certified.length ? certified : assetList.value
})

const selectedAssetName = ref('')
const analysisLoading = ref(false)
const analysisResult = ref(null)
const analysisError = ref('')
const aiReady = Boolean(import.meta.env.VITE_AI_API_URL)

const selectedUsage = computed(() => {
  if (!selectedAssetName.value) return { total: 0, scenes: {} }
  return getUsageForAsset(selectedAssetName.value)
})

const selectedUsageScenes = computed(() => formatUsageScenes(selectedUsage.value.scenes).slice(0, 6))

const usageBreakdown = computed(() => {
  const scenes = selectedUsage.value.scenes || {}
  let queryCount = 0
  let referenceCount = 0
  Object.entries(scenes).forEach(([name, count]) => {
    if (/查询|检索|验证|校验/.test(name)) {
      queryCount += count
    } else {
      referenceCount += count
    }
  })
  const total = selectedUsage.value.total || queryCount + referenceCount
  return { total, queryCount, referenceCount }
})

watch(
  analysisTargets,
  (list) => {
    if (!list.length) {
      selectedAssetName.value = ''
      return
    }
    if (!list.some((item) => item.name === selectedAssetName.value)) {
      selectedAssetName.value = list[0].name
    }
  },
  { immediate: true }
)

watch(selectedAssetName, () => {
  analysisResult.value = null
  analysisError.value = ''
})

const runMarketAnalysis = async () => {
  if (!selectedAssetName.value) {
    message.warning('请选择要分析的藏品')
    return
  }

  analysisLoading.value = true
  analysisError.value = ''

  try {
    const result = await requestMarketAnalysis({
      assetName: selectedAssetName.value,
      usage: selectedUsage.value
    })
    analysisResult.value = {
      ...result,
      generatedAt: new Date().toLocaleString()
    }
  } catch (error) {
    analysisError.value = 'AI分析失败，请稍后再试'
  } finally {
    analysisLoading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&family=Playfair+Display:wght@600;700&display=swap');

.market-section {
  margin-bottom: 48px;
  padding: 32px;
  border-radius: 22px;
  border: 1px solid #dbeafe;
  background:
    radial-gradient(circle at 8% 18%, rgba(14, 165, 233, 0.22), transparent 55%),
    radial-gradient(circle at 90% 12%, rgba(34, 197, 94, 0.2), transparent 50%),
    linear-gradient(135deg, #f7fbff 0%, #fff6ec 100%);
  font-family: 'Manrope', sans-serif;
}

.market-section .section-header h2 {
  font-family: 'Playfair Display', serif;
}

.market-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.market-card {
  border-radius: 18px;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.market-control {
  background: rgba(255, 255, 255, 0.92);
}

.market-output {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.market-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.market-title {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #0f172a;
}

.market-title h3,
.analysis-title h3 {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 700;
}

.market-title p,
.analysis-title p {
  margin: 0;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.6);
}

.market-title :deep(svg) {
  font-size: 24px;
  color: #0ea5e9;
}

.market-field {
  display: grid;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.6);
}

.market-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.market-metric {
  background: #f1f5f9;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
}

.market-metric span {
  display: block;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.55);
}

.market-metric strong {
  font-size: 20px;
  color: #0f172a;
}

.market-scenes {
  display: grid;
  gap: 10px;
  margin-bottom: 16px;
}

.market-scene {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
}

.market-scene strong {
  color: #0ea5e9;
}

.analysis-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.analysis-title {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #0f172a;
}

.analysis-title :deep(svg) {
  font-size: 22px;
  color: #22c55e;
}

.analysis-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.analysis-summary {
  background: #0f172a;
  color: #f8fafc;
  padding: 14px;
  border-radius: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

.analysis-block h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #0f172a;
}

.analysis-block ul {
  margin: 0;
  padding-left: 18px;
  color: rgba(15, 23, 42, 0.78);
}

.analysis-meta {
  font-size: 12px;
  color: rgba(15, 23, 42, 0.5);
  text-align: right;
}

.analysis-alert {
  margin-bottom: 8px;
}

@media (max-width: 991px) {
  .market-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .market-section {
    padding: 20px;
  }

  .market-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
