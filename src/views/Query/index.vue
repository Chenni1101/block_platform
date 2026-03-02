<template>
  <div class="query-page">
    <a-page-header class="page-header" title="存证查询" sub-title="验证数字资产的版权存证信息" />

    <!-- 查询方式选择 -->
    <a-card class="mb-4">
      <a-tabs v-model:activeKey="queryType">
        <a-tab-pane key="hash" tab="按哈希值查询">
          <a-space direction="vertical" style="width: 100%;">
            <a-input-search
              v-model:value="hashQuery"
              placeholder="请输入资产哈希值或交易ID"
              size="large"
              enter-button="查询"
              :loading="searching"
              @search="handleHashQuery"
            />
            <p class="query-hint">示例：sha256:a1b2c3d4e5f6... 或 tx_1234567890</p>
          </a-space>
        </a-tab-pane>
        <a-tab-pane key="file" tab="按文件查询">
          <a-upload-dragger
            v-model:fileList="queryFileList"
            name="file"
            :multiple="false"
            :before-upload="() => false"
            @change="handleFileQuery"
          >
            <p class="ant-upload-drag-icon">
              <inbox-outlined />
            </p>
            <p class="ant-upload-text">上传文件进行验证</p>
            <p class="ant-upload-hint">系统将计算文件哈希并在链上查询存证记录</p>
          </a-upload-dragger>
        </a-tab-pane>
        <a-tab-pane key="advanced" tab="高级查询">
          <a-form layout="inline" class="advanced-form">
            <a-form-item label="创作者">
              <a-input v-model:value="advancedQuery.creator" placeholder="创作者名称" />
            </a-form-item>
            <a-form-item label="机构">
              <a-input v-model:value="advancedQuery.organization" placeholder="所属机构" />
            </a-form-item>
            <a-form-item label="时间范围">
              <a-range-picker v-model:value="advancedQuery.dateRange" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" :loading="searching" @click="handleAdvancedQuery">查询</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 查询结果 -->
    <a-card title="查询结果" v-if="queryResult">
      <a-result
        v-if="queryResult.found"
        status="success"
        title="存证验证通过"
        sub-title="该资产已在区块链上完成版权存证"
      >
        <template #extra>
          <a-descriptions :column="2" bordered class="result-desc">
            <a-descriptions-item label="资产名称" :span="2">
              {{ queryResult.data.assetName }}
            </a-descriptions-item>
            <a-descriptions-item label="资产哈希">
              <a-typography-text code copyable style="font-size: 12px;">
                {{ queryResult.data.hash }}
              </a-typography-text>
            </a-descriptions-item>
            <a-descriptions-item label="唯一标识">
              <a-typography-text code>{{ queryResult.data.uniqueId }}</a-typography-text>
            </a-descriptions-item>
            <a-descriptions-item label="创作者">{{ queryResult.data.creator }}</a-descriptions-item>
            <a-descriptions-item label="所属机构">{{ queryResult.data.organization }}</a-descriptions-item>
            <a-descriptions-item label="存证时间">{{ queryResult.data.certifyTime }}</a-descriptions-item>
            <a-descriptions-item label="区块高度">{{ queryResult.data.blockHeight }}</a-descriptions-item>
            <a-descriptions-item label="交易ID" :span="2">
              <a-typography-text code copyable>{{ queryResult.data.txId }}</a-typography-text>
            </a-descriptions-item>
            <a-descriptions-item label="区块链网络" :span="2">
              <a-tag color="blue">百度超级链开放测试网络</a-tag>
              <a-tag color="green">eleccert合约</a-tag>
            </a-descriptions-item>
          </a-descriptions>
          
          <div class="result-actions">
            <a-button type="primary" @click="downloadCertificate">
              <template #icon><DownloadOutlined /></template>
              下载存证证书
            </a-button>
            <a-button @click="viewOnChain">
              <template #icon><LinkOutlined /></template>
              区块链浏览器查看
            </a-button>
          </div>
        </template>
      </a-result>

      <a-result
        v-else
        status="warning"
        title="未找到存证记录"
        sub-title="该资产尚未在区块链上进行版权存证"
      >
        <template #extra>
          <a-button type="primary" @click="$router.push('/evidence')">立即存证</a-button>
          <a-button @click="clearResult">重新查询</a-button>
        </template>
      </a-result>
    </a-card>

    <!-- 最近查询记录 -->
    <a-card title="最近查询记录" class="mt-4" v-if="!queryResult">
      <a-table
        :columns="historyColumns"
        :data-source="queryHistory"
        :pagination="false"
        :scroll="{ x: 720 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.found ? 'green' : 'orange'">
              {{ record.found ? '已存证' : '未存证' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'query'">
            <a-typography-text code style="font-size: 12px;">
              {{ record.query.length > 30 ? record.query.slice(0, 30) + '...' : record.query }}
            </a-typography-text>
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="link" size="small" @click="requery(record)">重新查询</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { InboxOutlined, DownloadOutlined, LinkOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const queryType = ref('hash')
const hashQuery = ref('')
const queryFileList = ref([])
const searching = ref(false)
const queryResult = ref(null)

const advancedQuery = reactive({
  creator: '',
  organization: '',
  dateRange: null
})

const historyColumns = [
  { title: '查询内容', dataIndex: 'query', key: 'query' },
  { title: '查询时间', dataIndex: 'time', key: 'time', width: 180 },
  { title: '状态', dataIndex: 'found', key: 'status', width: 100 },
  { title: '操作', key: 'action', width: 100 }
]

const queryHistory = ref([
  { id: 1, query: 'sha256:a1b2c3d4e5f6a1b2c3d4e5f6', time: '2026-02-22 18:30', found: true },
  { id: 2, query: 'tx_1234567890', time: '2026-02-22 17:45', found: true },
  { id: 3, query: 'sha256:unknown123456', time: '2026-02-22 16:20', found: false }
])

const handleHashQuery = async () => {
  if (!hashQuery.value.trim()) {
    message.warning('请输入查询内容')
    return
  }
  
  searching.value = true
  
  // 模拟查询
  setTimeout(() => {
    const mockFound = hashQuery.value.includes('sha256:a1b2') || hashQuery.value.includes('tx_')
    
    if (mockFound) {
      queryResult.value = {
        found: true,
        data: {
          assetName: '青铜器高清图像',
          hash: 'sha256:a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
          uniqueId: 'H_a1b2c3d4e5f6a1b2',
          creator: '上海对外经贸大学博物馆',
          organization: '博物馆数字化中心',
          certifyTime: '2026-02-20 10:30:45',
          blockHeight: 5234567,
          txId: 'tx_1708412345678_abc123def456'
        }
      }
    } else {
      queryResult.value = { found: false }
    }
    
    searching.value = false
    
    // 添加到历史记录
    queryHistory.value.unshift({
      id: Date.now(),
      query: hashQuery.value,
      time: new Date().toLocaleString(),
      found: mockFound
    })
  }, 1500)
}

const handleFileQuery = (info) => {
  if (info.fileList.length > 0) {
    searching.value = true
    // 模拟文件哈希计算和查询
    setTimeout(() => {
      queryResult.value = {
        found: true,
        data: {
          assetName: info.fileList[0].name,
          hash: 'sha256:' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          uniqueId: 'H_' + Math.random().toString(36).slice(2, 18),
          creator: '文件上传验证',
          organization: '系统自动识别',
          certifyTime: new Date().toLocaleString(),
          blockHeight: Math.floor(Math.random() * 1000000) + 5000000,
          txId: 'tx_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10)
        }
      }
      searching.value = false
    }, 2000)
  }
}

const handleAdvancedQuery = () => {
  if (!advancedQuery.creator && !advancedQuery.organization) {
    message.warning('请至少填写一个查询条件')
    return
  }
  searching.value = true
  setTimeout(() => {
    queryResult.value = {
      found: true,
      data: {
        assetName: '陶瓷花瓶3D模型',
        hash: 'sha256:b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
        uniqueId: 'H_b2c3d4e5f6a1b2c3',
        creator: advancedQuery.creator || '3D建模团队',
        organization: advancedQuery.organization || '博物馆数字化中心',
        certifyTime: '2026-02-19 14:20:30',
        blockHeight: 5234123,
        txId: 'tx_1708312345678_def456abc789'
      }
    }
    searching.value = false
  }, 1500)
}

const clearResult = () => {
  queryResult.value = null
  hashQuery.value = ''
  queryFileList.value = []
}

const requery = (record) => {
  hashQuery.value = record.query
  queryType.value = 'hash'
  handleHashQuery()
}

const downloadCertificate = () => {
  message.success('存证证书下载中...')
}

const viewOnChain = () => {
  message.info('正在跳转到区块链浏览器...')
}
</script>

<style scoped>
.query-page {
  padding: 0;
}

.page-header {
  margin-bottom: 12px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-4 {
  margin-top: 16px;
}

.query-hint {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  margin: 0;
}

.result-desc {
  text-align: left;
  margin-bottom: 24px;
}

.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
  flex-wrap: wrap;
}

@media (max-width: 767px) {
  .advanced-form :deep(.ant-form-item) {
    width: 100%;
    margin-right: 0;
  }

  .advanced-form :deep(.ant-form-item-control) {
    width: 100%;
  }

  .result-actions :deep(.ant-btn) {
    width: 100%;
  }
}
</style>
