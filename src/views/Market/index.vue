<template>
  <div class="market-page">
    <a-page-header title="市场分析" sub-title="AI 驱动的场景洞察与运营建议" />
    <div class="market-panel">
      <MarketAnalysisPanel :assets="marketAssets" />
    </div>
  </div>
</template>

<script setup>
import MarketAnalysisPanel from '../../components/MarketAnalysisPanel.vue'

const marketAssets = [
  { id: 1, name: '新艺术葡萄少女花瓶', certified: true },
  { id: 2, name: '韦奇伍德蓝陶双耳瓶', certified: true },
  { id: 3, name: '彩绘巴洛克执壶', certified: true },
  { id: 4, name: '绿地粉彩中国风茶具', certified: true },
  { id: 5, name: '白瓷北极熊雕塑', certified: true },
  { id: 6, name: '粉彩花卉茶壶套组', certified: true }
]
</script>

<style scoped>
.market-page {
  padding: 0;
}

.market-panel {
  margin-top: 12px;
}
</style>
