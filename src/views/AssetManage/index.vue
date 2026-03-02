<template>
  <div class="asset-page">
    <a-page-header class="page-header" title="资产管理" sub-title="管理您的数字资产，查看存证状态">
      <template #extra>
        <a-button type="primary" @click="$router.push('/evidence')">
          <template #icon><PlusOutlined /></template>
          新增存证
        </a-button>
      </template>
    </a-page-header>

    <!-- 统计卡片 -->
    <a-row :gutter="16" class="mb-4">
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card>
          <a-statistic title="总资产数" :value="assets.length" suffix="件">
            <template #prefix><FolderOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card>
          <a-statistic title="已存证" :value="certifiedCount" suffix="件" :value-style="{ color: '#52c41a' }">
            <template #prefix><CheckCircleOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card>
          <a-statistic title="待存证" :value="pendingCount" suffix="件" :value-style="{ color: '#faad14' }">
            <template #prefix><ClockCircleOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card>
          <a-statistic title="本月新增" :value="5" suffix="件">
            <template #prefix><RiseOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- 筛选区 -->
    <a-card class="mb-4">
      <a-row :gutter="16">
        <a-col :xs="24" :sm="12" :lg="6">
          <a-input-search v-model:value="searchText" placeholder="搜索资产名称" @search="handleSearch" />
        </a-col>
        <a-col :xs="24" :sm="12" :lg="4">
          <a-select v-model:value="filterType" placeholder="资产类型" style="width: 100%" allow-clear>
            <a-select-option value="image">图片</a-select-option>
            <a-select-option value="video">视频</a-select-option>
            <a-select-option value="3d">3D模型</a-select-option>
            <a-select-option value="document">文档</a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="12" :lg="4">
          <a-select v-model:value="filterStatus" placeholder="存证状态" style="width: 100%" allow-clear>
            <a-select-option value="certified">已存证</a-select-option>
            <a-select-option value="pending">待存证</a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="12" :lg="4">
          <a-range-picker style="width: 100%" />
        </a-col>
      </a-row>
    </a-card>

    <!-- 资产列表 -->
    <a-card title="资产列表">
      <a-table
        :columns="columns"
        :data-source="filteredAssets"
        :pagination="{ pageSize: 10 }"
        :scroll="{ x: 900 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a-space>
              <FileImageOutlined v-if="record.type === 'image'" style="color: #1890ff;" />
              <VideoCameraOutlined v-else-if="record.type === 'video'" style="color: #722ed1;" />
              <FileTextOutlined v-else style="color: #52c41a;" />
              <span>{{ record.name }}</span>
            </a-space>
          </template>
          <template v-if="column.key === 'type'">
            <a-tag>{{ typeMap[record.type] }}</a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 'certified' ? 'green' : 'orange'">
              {{ record.status === 'certified' ? '已存证' : '待存证' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'hash'">
            <a-typography-text v-if="record.hash" code copyable style="font-size: 12px;">
              {{ record.hash.slice(0, 16) }}...
            </a-typography-text>
            <span v-else class="text-muted">-</span>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="viewDetail(record)">详情</a-button>
              <a-button v-if="record.status !== 'certified'" type="link" size="small" @click="certifyAsset(record)">
                存证
              </a-button>
              <a-button type="link" size="small" danger @click="deleteAsset(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 详情弹窗 -->
    <a-modal v-model:open="showDetailModal" title="资产详情" width="92%" :footer="null">
      <template v-if="currentAsset">
        <a-descriptions :column="{ xs: 1, sm: 2 }" bordered>
          <a-descriptions-item label="资产名称" :span="2">{{ currentAsset.name }}</a-descriptions-item>
          <a-descriptions-item label="资产类型">{{ typeMap[currentAsset.type] }}</a-descriptions-item>
          <a-descriptions-item label="存证状态">
            <a-tag :color="currentAsset.status === 'certified' ? 'green' : 'orange'">
              {{ currentAsset.status === 'certified' ? '已存证' : '待存证' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="创建时间">{{ currentAsset.createTime }}</a-descriptions-item>
          <a-descriptions-item label="创作者">{{ currentAsset.creator }}</a-descriptions-item>
          <a-descriptions-item label="哈希值" :span="2" v-if="currentAsset.hash">
            <a-typography-text code copyable>{{ currentAsset.hash }}</a-typography-text>
          </a-descriptions-item>
          <a-descriptions-item label="交易ID" :span="2" v-if="currentAsset.txId">
            <a-typography-text code copyable>{{ currentAsset.txId }}</a-typography-text>
          </a-descriptions-item>
          <a-descriptions-item label="描述" :span="2">{{ currentAsset.description || '暂无描述' }}</a-descriptions-item>
        </a-descriptions>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import {
  PlusOutlined,
  FolderOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  FileTextOutlined
} from '@ant-design/icons-vue'

const searchText = ref('')
const filterType = ref(undefined)
const filterStatus = ref(undefined)
const showDetailModal = ref(false)
const currentAsset = ref(null)

const typeMap = {
  image: '图片',
  video: '视频',
  '3d': '3D模型',
  document: '文档'
}

const columns = [
  { title: '资产名称', dataIndex: 'name', key: 'name' },
  { title: '类型', dataIndex: 'type', key: 'type', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '哈希值', dataIndex: 'hash', key: 'hash', width: 180 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: '操作', key: 'action', width: 180 }
]

// 模拟数据
const assets = ref([
  { id: 1, name: '青铜器高清图像', type: 'image', status: 'certified', hash: 'sha256:a1b2c3d4e5f6...', createTime: '2026-02-20 10:30', creator: '博物馆数字化团队', txId: 'tx_1234567890' },
  { id: 2, name: '陶瓷花瓶3D模型', type: '3d', status: 'certified', hash: 'sha256:b2c3d4e5f6a1...', createTime: '2026-02-19 14:20', creator: '3D建模团队', txId: 'tx_2345678901' },
  { id: 3, name: '古画修复视频', type: 'video', status: 'pending', hash: '', createTime: '2026-02-18 09:15', creator: '修复部门' },
  { id: 4, name: '文物鉴定报告', type: 'document', status: 'certified', hash: 'sha256:c3d4e5f6a1b2...', createTime: '2026-02-17 16:45', creator: '鉴定专家组', txId: 'tx_3456789012' },
  { id: 5, name: '玉器收藏图录', type: 'image', status: 'pending', hash: '', createTime: '2026-02-16 11:00', creator: '摄影团队' },
  { id: 6, name: '书画展览记录', type: 'video', status: 'certified', hash: 'sha256:d4e5f6a1b2c3...', createTime: '2026-02-15 13:30', creator: '展览部', txId: 'tx_4567890123' },
])

const certifiedCount = computed(() => assets.value.filter(a => a.status === 'certified').length)
const pendingCount = computed(() => assets.value.filter(a => a.status === 'pending').length)

const filteredAssets = computed(() => {
  let result = assets.value
  if (searchText.value) {
    result = result.filter(a => a.name.includes(searchText.value))
  }
  if (filterType.value) {
    result = result.filter(a => a.type === filterType.value)
  }
  if (filterStatus.value) {
    result = result.filter(a => a.status === filterStatus.value)
  }
  return result
})

const handleSearch = () => {
  // 搜索已通过 computed 实现
}

const viewDetail = (record) => {
  currentAsset.value = record
  showDetailModal.value = true
}

const certifyAsset = (record) => {
  message.info(`即将为 "${record.name}" 进行存证`)
}

const deleteAsset = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除资产 "${record.name}" 吗？`,
    okText: '确认',
    cancelText: '取消',
    onOk() {
      const index = assets.value.findIndex(a => a.id === record.id)
      if (index > -1) {
        assets.value.splice(index, 1)
        message.success('删除成功')
      }
    }
  })
}
</script>

<style scoped>
.asset-page {
  padding: 0;
}

.page-header {
  margin-bottom: 12px;
}

.mb-4 {
  margin-bottom: 16px;
}

.text-muted {
  color: rgba(0, 0, 0, 0.45);
}

@media (max-width: 767px) {
  .page-header :deep(.ant-page-header-heading) {
    flex-wrap: wrap;
    row-gap: 8px;
  }

  .page-header :deep(.ant-page-header-heading-extra) {
    width: 100%;
  }

  .page-header :deep(.ant-page-header-heading-extra .ant-btn) {
    width: 100%;
  }
}
</style>
