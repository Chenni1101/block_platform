<template>
  <div class="asset-page">
    <div class="asset-hero">
      <div class="asset-hero-copy">
        <h1>让展品被看见，也被记住</h1>
        <p>
          从静态数据到场景化叙事，展品图像、链上存证、收藏行为与交易流统一呈现，
          让每一件藏品既有证据，也有温度。
        </p>
        <a-space>
          <a-button type="primary" size="large" @click="$router.push('/evidence')">
            <template #icon><PlusOutlined /></template>
            新增存证
          </a-button>
          <a-button size="large" @click="scrollToTransactions">查看交易图像</a-button>
        </a-space>
      </div>
      <div class="asset-hero-visual">
        <img :src="heroImage" alt="展品场景" />
      </div>
    </div>

    <a-row :gutter="16" class="mb-4">
      <a-col :xs="12" :sm="12" :lg="6">
        <a-card class="metric-card">
          <a-statistic title="总资产数" :value="assets.length" suffix="件">
            <template #prefix><FolderOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="12" :lg="6">
        <a-card class="metric-card">
          <a-statistic title="已存证" :value="certifiedCount" suffix="件" :value-style="{ color: '#389e0d' }">
            <template #prefix><CheckCircleOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="12" :lg="6">
        <a-card class="metric-card">
          <a-statistic title="收藏人数" :value="totalLoves" suffix="人次" :value-style="{ color: '#cf1322' }">
            <template #prefix><FireOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="12" :lg="6">
        <a-card class="metric-card">
          <a-statistic title="近7日交易" :value="recentTransactions.length" suffix="笔">
            <template #prefix><RiseOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <div class="scene-grid mb-4">
      <div class="scene-card" v-for="item in sceneCards" :key="item.title">
        <img :src="item.image" :alt="item.title" />
        <div class="scene-mask">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </div>

    <a-card class="mb-4" title="筛选资产">
      <a-row :gutter="16">
        <a-col :xs="24" :sm="12" :lg="7">
          <a-input-search v-model:value="searchText" placeholder="搜索资产名称" @search="handleSearch" />
        </a-col>
        <a-col :xs="12" :sm="8" :lg="4">
          <a-select v-model:value="filterType" placeholder="资产类型" style="width: 100%" allow-clear>
            <a-select-option value="image">图片</a-select-option>
            <a-select-option value="video">视频</a-select-option>
            <a-select-option value="3d">3D模型</a-select-option>
            <a-select-option value="document">文档</a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="12" :sm="8" :lg="4">
          <a-select v-model:value="filterStatus" placeholder="存证状态" style="width: 100%" allow-clear>
            <a-select-option value="certified">已存证</a-select-option>
            <a-select-option value="pending">待存证</a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </a-card>

    <a-row :gutter="16" class="mb-4">
      <a-col :xs="24" :lg="16">
        <a-card title="资产列表（含图像）">
          <a-table
            :columns="columns"
            :data-source="filteredAssets"
            :pagination="{ pageSize: 6 }"
            :scroll="{ x: 980 }"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'thumbnail'">
                <img class="thumb" :src="record.image" :alt="record.name" />
              </template>
              <template v-if="column.key === 'name'">
                <a-space>
                  <FileImageOutlined v-if="record.type === 'image'" style="color: #1677ff;" />
                  <VideoCameraOutlined v-else-if="record.type === 'video'" style="color: #13a8a8;" />
                  <FileTextOutlined v-else style="color: #389e0d;" />
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
              <template v-if="column.key === 'likes'">
                <span class="likes-cell">
                  <HeartFilled style="color: #ff4d4f" /> {{ record.likes }}
                </span>
              </template>
              <template v-if="column.key === 'hash'">
                <a-typography-text v-if="record.hash" code copyable style="font-size: 12px;">
                  {{ record.hash.slice(0, 14) }}...
                </a-typography-text>
                <span v-else class="text-muted">-</span>
              </template>
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" size="small" @click="viewDetail(record)">详情</a-button>
                  <a-button type="link" size="small" @click="toggleCollect(record)">
                    <HeartFilled v-if="record.collected" style="color: #ff4d4f" />
                    <HeartOutlined v-else />
                  </a-button>
                  <a-button v-if="record.status !== 'certified'" type="link" size="small" @click="certifyAsset(record)">
                    存证
                  </a-button>
                  <a-button type="link" size="small" danger @click="deleteAsset(record)">删除</a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="8">
        <a-card title="我的收藏" class="favorite-card">
          <div v-if="collectedAssets.length" class="favorite-list">
            <div class="favorite-item" v-for="item in collectedAssets" :key="item.id">
              <img :src="item.image" :alt="item.name" />
              <div>
                <h4>{{ item.name }}</h4>
                <p>{{ item.scene }}</p>
              </div>
            </div>
          </div>
          <a-empty v-else description="还没有收藏展品" />
        </a-card>
      </a-col>
    </a-row>

    <a-card id="tx-visual" title="最近交易图像流" class="mb-4">
      <div class="tx-flow">
        <div class="tx-item" v-for="tx in recentTransactions" :key="tx.id" @click="openTxDrawer(tx)">
          <img :src="tx.image" :alt="tx.name" />
          <div class="tx-content">
            <h4>{{ tx.name }}</h4>
            <p>{{ tx.note }}</p>
            <div class="tx-bottom">
              <span>{{ tx.time }}</span>
              <a-tag color="green">交易上链完成</a-tag>
              <a-tag color="blue">点击查看详情</a-tag>
            </div>
          </div>
        </div>
      </div>
    </a-card>

    <a-drawer
      v-model:open="showTxDrawer"
      title="交易详情"
      placement="right"
      width="460"
    >
      <template v-if="currentTx">
        <div class="tx-drawer-cover">
          <img :src="currentTx.image" :alt="currentTx.name" />
        </div>
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="交易展品">{{ currentTx.name }}</a-descriptions-item>
          <a-descriptions-item label="链上哈希">
            <a-typography-text code copyable>{{ currentTx.hash }}</a-typography-text>
          </a-descriptions-item>
          <a-descriptions-item label="交易ID">
            <a-typography-text code copyable>{{ currentTx.txId }}</a-typography-text>
          </a-descriptions-item>
          <a-descriptions-item label="授权方">{{ currentTx.licensor }}</a-descriptions-item>
          <a-descriptions-item label="受让方">{{ currentTx.assignee }}</a-descriptions-item>
          <a-descriptions-item label="交易时间">{{ currentTx.time }}</a-descriptions-item>
          <a-descriptions-item label="交易说明">{{ currentTx.note }}</a-descriptions-item>
        </a-descriptions>
      </template>
    </a-drawer>

    <a-modal v-model:open="showDetailModal" title="资产详情" width="900px" :footer="null">
      <template v-if="currentAsset">
        <div class="detail-cover">
          <img :src="currentAsset.image" :alt="currentAsset.name" />
        </div>
        <a-descriptions :column="{ xs: 1, sm: 2 }" bordered>
          <a-descriptions-item label="资产名称" :span="2">{{ currentAsset.name }}</a-descriptions-item>
          <a-descriptions-item label="资产类型">{{ typeMap[currentAsset.type] }}</a-descriptions-item>
          <a-descriptions-item label="存证状态">
            <a-tag :color="currentAsset.status === 'certified' ? 'green' : 'orange'">
              {{ currentAsset.status === 'certified' ? '已存证' : '待存证' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="展陈场景" :span="2">{{ currentAsset.scene }}</a-descriptions-item>
          <a-descriptions-item label="创建时间">{{ currentAsset.createTime }}</a-descriptions-item>
          <a-descriptions-item label="创作者">{{ currentAsset.creator }}</a-descriptions-item>
          <a-descriptions-item label="哈希值" :span="2" v-if="currentAsset.hash">
            <a-typography-text code copyable>{{ currentAsset.hash }}</a-typography-text>
          </a-descriptions-item>
          <a-descriptions-item label="交易ID" :span="2" v-if="currentAsset.txId">
            <a-typography-text code copyable>{{ currentAsset.txId }}</a-typography-text>
          </a-descriptions-item>
          <a-descriptions-item label="描述" :span="2">{{ currentAsset.description }}</a-descriptions-item>
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
  RiseOutlined,
  FireOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  HeartOutlined,
  HeartFilled
} from '@ant-design/icons-vue'

const heroImage = '/exhibits/44c6dedd234af2dade7c7bf2fc3b1383.jpg'

const searchText = ref('')
const filterType = ref(undefined)
const filterStatus = ref(undefined)
const showDetailModal = ref(false)
const currentAsset = ref(null)
const showTxDrawer = ref(false)
const currentTx = ref(null)

const typeMap = {
  image: '图片',
  video: '视频',
  '3d': '3D模型',
  document: '文档'
}

const columns = [
  { title: '图像', dataIndex: 'image', key: 'thumbnail', width: 84 },
  { title: '资产名称', dataIndex: 'name', key: 'name', width: 200 },
  { title: '类型', dataIndex: 'type', key: 'type', width: 90 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '热度', dataIndex: 'likes', key: 'likes', width: 90 },
  { title: '哈希值', dataIndex: 'hash', key: 'hash', width: 180 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: '操作', key: 'action', width: 180 }
]

const assets = ref([
  {
    id: 1,
    name: '新艺术葡萄少女花瓶',
    type: 'image',
    status: 'certified',
    likes: 96,
    collected: true,
    image: '/exhibits/6b84b365fdb2bfb285d529708f797a8b.jpg',
    scene: '文旅馆A厅 - 光影沉浸展柜',
    hash: 'sha256:9a24fe5d1ac6b7efb0f4',
    createTime: '2026-03-21 10:30',
    creator: '博物馆数字化团队',
    txId: 'tx_8273612091',
    description: '新艺术时期瓷艺代表作，适用于展陈故事化传播与文创衍生。'
  },
  {
    id: 2,
    name: '韦奇伍德蓝陶双耳瓶',
    type: '3d',
    status: 'certified',
    likes: 132,
    collected: true,
    image: '/exhibits/a8402b3d96aae48cf0889878e3545781.jpg',
    scene: '数字孪生馆 - 360交互陈列',
    hash: 'sha256:5be90c82df3c7ca0f89b',
    createTime: '2026-03-19 14:20',
    creator: '3D建模团队',
    txId: 'tx_9283746510',
    description: '浮雕与釉色细节保存完整，适合高精度数字资产交易。'
  },
  {
    id: 3,
    name: '彩绘巴洛克执壶',
    type: 'video',
    status: 'pending',
    likes: 64,
    collected: false,
    image: '/exhibits/3bff7f176da38618331cbf101c3c6e78.jpg',
    scene: '流动展演车 - 城市巡展',
    hash: '',
    createTime: '2026-03-18 09:15',
    creator: '修复部门',
    description: '修复前后对比影像已完成，待发起链上存证。'
  },
  {
    id: 4,
    name: '绿地粉彩中国风茶具',
    type: 'document',
    status: 'certified',
    likes: 78,
    collected: false,
    image: '/exhibits/ce099df5b991e285684b5b5021a178d4.jpg',
    scene: '东方器物展 - 茶文化章节',
    hash: 'sha256:ef310be4c8d7793512f8',
    createTime: '2026-03-16 16:45',
    creator: '鉴定专家组',
    txId: 'tx_3344556677',
    description: '包含图录、鉴定报告与外销瓷背景说明。'
  },
  {
    id: 5,
    name: '白瓷北极熊雕塑',
    type: 'image',
    status: 'pending',
    likes: 42,
    collected: false,
    image: '/exhibits/68746e32f68eda77bae91e0b7c24828a.jpg',
    scene: '北欧工艺专题厅 - 冬季限定',
    hash: '',
    createTime: '2026-03-15 11:00',
    creator: '摄影团队',
    description: '高清主图已上传，等待版权确权流程完成。'
  },
  {
    id: 6,
    name: '粉彩花卉茶壶套组',
    type: 'video',
    status: 'certified',
    likes: 110,
    collected: false,
    image: '/exhibits/f580ff0de4447ac727a07cc87c80baf2.jpg',
    scene: '古典生活美学馆 - 沉浸茶席',
    hash: 'sha256:89bc7f22d9ef1c4306a1',
    createTime: '2026-03-14 13:30',
    creator: '展览部',
    txId: 'tx_1122334455',
    description: '器物故事短片已上链，适合导览视频和交易预览。'
  }
])

const sceneCards = [
  {
    title: '沉浸展柜场景',
    desc: '借助图像叠层与光影脚本，还原器物在真实展厅中的观看体验。',
    image: '/exhibits/0490e91125a9137ef2d705a7ae746eb5.jpg'
  },
  {
    title: '文创交易场景',
    desc: '展品从授权到交易全链路可视化，观众可直观看到成交图像。',
    image: '/exhibits/d860fed8f6fcf709ba4a4d542e7bea26.jpg'
  },
  {
    title: '修复对比场景',
    desc: '通过同件展品前后图像比对，提升内容叙事和教育价值。',
    image: '/exhibits/5ac89737dfed5148068dc92928cd0f13.jpg'
  }
]

const recentTransactions = ref([
  {
    id: 1,
    name: '彩绘神话双耳瓶',
    image: '/exhibits/8962040077ff00fd335806a0f3b4f65a.jpg',
    time: '12分钟前',
    note: '完成二次授权交易，链上确认耗时 1.3s。',
    hash: 'sha256:177f7fd49944aa2192f113caf4e5e8a3d9278e',
    txId: 'tx_5639017288',
    licensor: '上海对外经贸大学博物馆',
    assignee: '城际数字文创联盟'
  },
  {
    id: 2,
    name: '洛可可风瓷钢琴音乐盒',
    image: '/exhibits/148271cf7d8fa34e60f8201bfb01dfac.jpg',
    time: '38分钟前',
    note: '交易凭证已生成，可用于异地联合展。',
    hash: 'sha256:4dcf2be74a93c06bb87ef11d3bf27ac5fbe8cc',
    txId: 'tx_7102458893',
    licensor: '数字展陈版权中心',
    assignee: '临港文旅集团'
  },
  {
    id: 3,
    name: '青金釉葫芦瓶',
    image: '/exhibits/6fe46f53cce0cb23d0aa90936c8f3bb4.jpg',
    time: '1小时前',
    note: '完成权益切分交易，更新收藏人可见。',
    hash: 'sha256:9fe5e2ab8c2b6129ef4d3128a94bde77f16c1a',
    txId: 'tx_2998173401',
    licensor: '馆藏数字化工作室',
    assignee: '浦东公共文化云'
  }
])

const certifiedCount = computed(() => assets.value.filter((item) => item.status === 'certified').length)
const totalLoves = computed(() => assets.value.reduce((sum, item) => sum + item.likes, 0))
const collectedAssets = computed(() => assets.value.filter((item) => item.collected))

const filteredAssets = computed(() => {
  let result = assets.value
  if (searchText.value) {
    result = result.filter((item) => item.name.includes(searchText.value))
  }
  if (filterType.value) {
    result = result.filter((item) => item.type === filterType.value)
  }
  if (filterStatus.value) {
    result = result.filter((item) => item.status === filterStatus.value)
  }
  return result
})

const handleSearch = () => {
  // 搜索通过计算属性自动生效
}

const viewDetail = (record) => {
  currentAsset.value = record
  showDetailModal.value = true
}

const scrollToTransactions = () => {
  const element = document.getElementById('tx-visual')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const openTxDrawer = (tx) => {
  currentTx.value = tx
  showTxDrawer.value = true
}

const toggleCollect = (record) => {
  record.collected = !record.collected
  record.likes += record.collected ? 1 : -1
  if (record.collected) {
    message.success(`已收藏「${record.name}」`)
    return
  }
  message.info(`已取消收藏「${record.name}」`)
}

const certifyAsset = (record) => {
  message.info(`即将为「${record.name}」进行存证`)
}

const deleteAsset = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除资产「${record.name}」吗？`,
    okText: '确认',
    cancelText: '取消',
    onOk() {
      const index = assets.value.findIndex((item) => item.id === record.id)
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

.asset-hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
  padding: 28px;
  border-radius: 18px;
  margin-bottom: 16px;
  background: linear-gradient(125deg, #102a43 0%, #0b4f6c 55%, #1f7a8c 100%);
  color: #fff;
}

.asset-hero-copy h1 {
  margin: 0 0 12px;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.asset-hero-copy p {
  margin: 0 0 20px;
  max-width: 560px;
  line-height: 1.8;
  opacity: 0.9;
}

.asset-hero-visual {
  border-radius: 14px;
  overflow: hidden;
  min-height: 240px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.26);
}

.asset-hero-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mb-4 {
  margin-bottom: 16px;
}

.metric-card {
  border-radius: 14px;
}

.scene-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.scene-card {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  min-height: 200px;
}

.scene-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scene-mask {
  position: absolute;
  inset: auto 0 0 0;
  padding: 14px;
  color: #fff;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.75) 100%);
}

.scene-mask h3 {
  margin: 0 0 6px;
  font-size: 18px;
}

.scene-mask p {
  margin: 0;
  font-size: 12px;
  opacity: 0.92;
}

.thumb {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
  display: block;
}

.likes-cell {
  color: #ff4d4f;
  font-weight: 600;
}

.favorite-card {
  height: 100%;
}

.favorite-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.favorite-item {
  display: flex;
  gap: 10px;
  align-items: center;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 8px;
}

.favorite-item img {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
}

.favorite-item h4 {
  margin: 0 0 4px;
  font-size: 14px;
}

.favorite-item p {
  margin: 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.tx-flow {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tx-item {
  display: flex;
  gap: 14px;
  align-items: center;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tx-item:hover {
  border-color: #91caff;
  box-shadow: 0 8px 20px rgba(5, 145, 255, 0.12);
}

.tx-item img {
  width: 88px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
}

.tx-content {
  flex: 1;
}

.tx-content h4 {
  margin: 0 0 6px;
}

.tx-content p {
  margin: 0 0 8px;
  color: rgba(0, 0, 0, 0.65);
}

.tx-bottom {
  display: flex;
  gap: 12px;
  align-items: center;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

.tx-drawer-cover {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
}

.tx-drawer-cover img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.detail-cover {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.detail-cover img {
  width: 100%;
  max-height: 340px;
  object-fit: cover;
}

.text-muted {
  color: rgba(0, 0, 0, 0.45);
}

@media (max-width: 991px) {
  .asset-hero {
    grid-template-columns: 1fr;
  }

  .scene-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .asset-hero {
    padding: 18px;
  }

  .asset-hero-copy h1 {
    font-size: 24px;
  }

  .tx-item {
    align-items: flex-start;
  }
}
</style>
