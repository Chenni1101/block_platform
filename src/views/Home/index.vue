<template>
  <div class="home-page">
    <!-- 顶部横幅 - 场景化展示 -->
    <div class="hero-section">
      <a-row :gutter="24" align="middle">
        <a-col :xs="24" :md="12">
          <h1 class="hero-title">守护文化遗产</h1>
          <h2 class="hero-subtitle">区块链赋能数字版权保护</h2>
          <p class="hero-desc">
            每一件文物都承载着历史的温度，每一份版权都值得被永久守护。
            我们运用区块链技术，为文旅数字资产提供不可篡改的版权存证服务。
          </p>
          <a-space size="middle" class="hero-actions">
            <a-button type="primary" size="large" @click="$router.push('/evidence')">
              <template #icon><SafetyCertificateOutlined /></template>
              立即存证
            </a-button>
            <a-button size="large" ghost @click="$router.push('/query')">
              <template #icon><SearchOutlined /></template>
              验证真伪
            </a-button>
          </a-space>
        </a-col>
        <a-col :xs="24" :md="12">
          <div class="hero-showcase">
            <div class="showcase-main">
              <img :src="featuredExhibit.image" :alt="featuredExhibit.name" class="showcase-image" />
              <div class="showcase-overlay">
                <span class="showcase-badge">
                  <SafetyCertificateOutlined /> 已存证
                </span>
              </div>
            </div>
            <div class="showcase-info">
              <h3>{{ featuredExhibit.name }}</h3>
              <p>{{ featuredExhibit.description }}</p>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- 数据展示 - 更有温度 -->
    <div class="stats-section">
      <div class="section-header">
        <h2>平台数据</h2>
        <p>每一个数字背后，都是对文化的珍视与守护</p>
      </div>
      <a-row :gutter="24">
        <a-col :xs="12" :sm="12" :lg="6">
          <div class="stat-card stat-primary">
            <div class="stat-icon">
              <DatabaseOutlined />
            </div>
            <div class="stat-content">
              <div class="stat-value">200<span class="stat-unit">件</span></div>
              <div class="stat-label">守护的文物</div>
              <div class="stat-desc">来自上海对外经贸大学博物馆</div>
            </div>
          </div>
        </a-col>
        <a-col :xs="12" :sm="12" :lg="6">
          <div class="stat-card stat-success">
            <div class="stat-icon">
              <CheckCircleOutlined />
            </div>
            <div class="stat-content">
              <div class="stat-value">100<span class="stat-unit">%</span></div>
              <div class="stat-label">存证成功率</div>
              <div class="stat-desc">区块链不可篡改保障</div>
            </div>
          </div>
        </a-col>
        <a-col :xs="12" :sm="12" :lg="6">
          <div class="stat-card stat-warning">
            <div class="stat-icon">
              <ThunderboltOutlined />
            </div>
            <div class="stat-content">
              <div class="stat-value">42<span class="stat-unit">ms</span></div>
              <div class="stat-label">平均响应</div>
              <div class="stat-desc">双桶索引极速检索</div>
            </div>
          </div>
        </a-col>
        <a-col :xs="12" :sm="12" :lg="6">
          <div class="stat-card stat-info">
            <div class="stat-icon">
              <PayCircleOutlined />
            </div>
            <div class="stat-content">
              <div class="stat-value">0.01<span class="stat-unit">元</span></div>
              <div class="stat-label">单次存证成本</div>
              <div class="stat-desc">远低于传统公证费用</div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- 精品馆藏展示 -->
    <div class="exhibits-section">
      <div class="section-header">
        <h2>精品馆藏</h2>
        <p>每一件藏品都是历史的见证，文明的传承</p>
      </div>
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :lg="6" v-for="exhibit in exhibits" :key="exhibit.id">
          <div class="exhibit-card" @click="viewExhibit(exhibit)">
            <div class="exhibit-image-wrapper">
              <img :src="exhibit.image" :alt="exhibit.name" class="exhibit-image" />
              <div class="exhibit-status">
                <a-tag :color="exhibit.certified ? 'green' : 'orange'">
                  {{ exhibit.certified ? '已存证' : '待存证' }}
                </a-tag>
              </div>
              <div class="exhibit-actions">
                <a-button
                  type="text"
                  :class="{ 'collected': exhibit.collected }"
                  @click.stop="toggleCollect(exhibit)"
                >
                  <HeartFilled v-if="exhibit.collected" />
                  <HeartOutlined v-else />
                </a-button>
              </div>
            </div>
            <div class="exhibit-info">
              <h4>{{ exhibit.name }}</h4>
              <p class="exhibit-origin">{{ exhibit.origin }}</p>
              <p class="exhibit-desc">{{ exhibit.description }}</p>
            </div>
          </div>
        </a-col>
      </a-row>
      <div class="section-more">
        <a-button type="link" size="large" @click="$router.push('/asset')">
          查看全部藏品 <RightOutlined />
        </a-button>
      </div>
    </div>

    <!-- 我的收藏 -->
    <div class="collection-section" v-if="collectedExhibits.length > 0">
      <div class="section-header">
        <h2><HeartFilled style="color: #ff4d4f;" /> 我的收藏</h2>
        <p>您收藏的珍贵藏品</p>
      </div>
      <div class="collection-scroll">
        <div class="collection-item" v-for="item in collectedExhibits" :key="item.id">
          <img :src="item.image" :alt="item.name" />
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>

    <!-- 最近存证交易 -->
    <div class="transactions-section">
      <div class="section-header">
        <h2>最近存证</h2>
        <p>实时记录每一次版权确认</p>
      </div>
      <a-row :gutter="24">
        <a-col :xs="24" :lg="16">
          <a-card class="transaction-list">
            <div class="transaction-item" v-for="tx in recentTransactions" :key="tx.id">
              <div class="tx-image">
                <img :src="tx.image" :alt="tx.name" />
              </div>
              <div class="tx-info">
                <h4>{{ tx.name }}</h4>
                <p class="tx-hash">
                  <a-typography-text code copyable :content="tx.hash" style="font-size: 11px;">
                    {{ tx.hash.slice(0, 20) }}...
                  </a-typography-text>
                </p>
              </div>
              <div class="tx-meta">
                <span class="tx-time">{{ tx.time }}</span>
                <a-tag color="green">存证成功</a-tag>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col :xs="24" :lg="8">
          <a-card title="区块链信息" class="chain-info-card">
            <a-descriptions :column="1" size="small">
              <a-descriptions-item label="区块链网络">
                <a-tag color="blue">百度超级链</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="智能合约">
                <a-tag color="green">eleccert</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="共识机制">XPoS</a-descriptions-item>
              <a-descriptions-item label="当前区块">
                <span class="block-height">5,234,567</span>
              </a-descriptions-item>
              <a-descriptions-item label="网络状态">
                <a-badge status="success" text="运行中" />
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 核心功能 -->
    <div class="feature-section">
      <div class="section-header">
        <h2>核心功能</h2>
        <p>一站式数字资产版权保护解决方案</p>
      </div>
      <a-row :gutter="24">
        <a-col :xs="24" :md="8">
          <div class="feature-card" @click="$router.push('/evidence')">
            <div class="feature-icon-wrapper feature-primary">
              <SafetyCertificateOutlined />
            </div>
            <h3>版权存证</h3>
            <p>基于区块链的不可篡改存证，生成唯一哈希标识，确保数字资产版权可追溯、可验证</p>
            <a-button type="link">开始存证 <RightOutlined /></a-button>
          </div>
        </a-col>
        <a-col :xs="24" :md="8">
          <div class="feature-card" @click="$router.push('/asset')">
            <div class="feature-icon-wrapper feature-success">
              <CloudUploadOutlined />
            </div>
            <h3>资产管理</h3>
            <p>支持多种格式数字资产上传、分类管理，链上链下协同存储，高效安全</p>
            <a-button type="link">管理资产 <RightOutlined /></a-button>
          </div>
        </a-col>
        <a-col :xs="24" :md="8">
          <div class="feature-card" @click="$router.push('/query')">
            <div class="feature-icon-wrapper feature-warning">
              <SearchOutlined />
            </div>
            <h3>存证查询</h3>
            <p>双索引结构支持O(1)复杂度检索，快速验证资产真实性和版权归属</p>
            <a-button type="link">立即查询 <RightOutlined /></a-button>
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- 技术架构 -->
    <div class="arch-section">
      <div class="section-header">
        <h2>技术架构</h2>
        <p>四层架构设计，确保系统稳定高效</p>
      </div>
      <div class="arch-diagram">
        <div class="arch-layer" v-for="(layer, index) in archLayers" :key="index" :class="`layer-${index + 1}`">
          <div class="layer-icon">
            <component :is="layer.icon" />
          </div>
          <div class="layer-content">
            <h4>{{ layer.name }}</h4>
            <p>{{ layer.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 展品详情弹窗 -->
    <a-modal
      v-model:open="showExhibitModal"
      :title="currentExhibit?.name"
      width="800px"
      :footer="null"
    >
      <div class="exhibit-detail" v-if="currentExhibit">
        <div class="detail-image">
          <img :src="currentExhibit.image" :alt="currentExhibit.name" />
        </div>
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="藏品名称" :span="2">{{ currentExhibit.name }}</a-descriptions-item>
          <a-descriptions-item label="时代/来源">{{ currentExhibit.origin }}</a-descriptions-item>
          <a-descriptions-item label="存证状态">
            <a-tag :color="currentExhibit.certified ? 'green' : 'orange'">
              {{ currentExhibit.certified ? '已存证' : '待存证' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="简介" :span="2">{{ currentExhibit.description }}</a-descriptions-item>
          <a-descriptions-item label="哈希值" :span="2" v-if="currentExhibit.hash">
            <a-typography-text code copyable>{{ currentExhibit.hash }}</a-typography-text>
          </a-descriptions-item>
        </a-descriptions>
        <div class="detail-actions">
          <a-button
            :type="currentExhibit.collected ? 'default' : 'primary'"
            @click="toggleCollect(currentExhibit)"
          >
            <HeartFilled v-if="currentExhibit.collected" style="color: #ff4d4f;" />
            <HeartOutlined v-else />
            {{ currentExhibit.collected ? '已收藏' : '收藏' }}
          </a-button>
          <a-button v-if="!currentExhibit.certified" type="primary" @click="$router.push('/evidence')">
            立即存证
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import {
  SafetyCertificateOutlined,
  SearchOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  PayCircleOutlined,
  ThunderboltOutlined,
  CloudUploadOutlined,
  HeartOutlined,
  HeartFilled,
  RightOutlined,
  AppstoreOutlined,
  ApiOutlined,
  BlockOutlined,
  HddOutlined
} from '@ant-design/icons-vue'

const showExhibitModal = ref(false)
const currentExhibit = ref(null)

// 特色展品
const featuredExhibit = ref({
  name: '彩绘神话双耳瓶',
  image: '/exhibits/8962040077ff00fd335806a0f3b4f65a.jpg',
  description: '巴洛克风格彩瓷杰作，展现了精湛的手工艺术与神话叙事'
})

// 精品馆藏
const exhibits = ref([
  {
    id: 1,
    name: '新艺术葡萄少女花瓶',
    image: '/exhibits/6b84b365fdb2bfb285d529708f797a8b.jpg',
    origin: '19世纪末 欧洲',
    description: '新艺术运动风格，以自然元素为灵感，展现女性优雅之美',
    certified: true,
    collected: false,
    hash: 'sha256:a1b2c3d4e5f6a1b2c3d4'
  },
  {
    id: 2,
    name: '韦奇伍德蓝陶双耳瓶',
    image: '/exhibits/a8402b3d96aae48cf0889878e3545781.jpg',
    origin: '18世纪 英国',
    description: '经典碧玉浮雕工艺，蓝白配色高雅精致',
    certified: true,
    collected: false,
    hash: 'sha256:b2c3d4e5f6a1b2c3d4e5'
  },
  {
    id: 3,
    name: '彩绘巴洛克执壶',
    image: '/exhibits/3bff7f176da38618331cbf101c3c6e78.jpg',
    origin: '17世纪 意大利',
    description: '华丽的巴洛克风格，以神话人物装饰，色彩斑斓',
    certified: true,
    collected: false,
    hash: 'sha256:c3d4e5f6a1b2c3d4e5f6'
  },
  {
    id: 4,
    name: '洛可可风瓷钢琴音乐盒',
    image: '/exhibits/148271cf7d8fa34e60f8201bfb01dfac.jpg',
    origin: '18世纪 法国',
    description: '精美的微缩钢琴造型，展现洛可可时期的奢华美学',
    certified: false,
    collected: false
  },
  {
    id: 5,
    name: '绿地粉彩中国风茶具',
    image: '/exhibits/ce099df5b991e285684b5b5021a178d4.jpg',
    origin: '18世纪 中国外销瓷',
    description: '中西合璧的外销瓷精品，展现东方韵味',
    certified: true,
    collected: false,
    hash: 'sha256:d4e5f6a1b2c3d4e5f6a1'
  },
  {
    id: 6,
    name: '白瓷北极熊雕塑',
    image: '/exhibits/68746e32f68eda77bae91e0b7c24828a.jpg',
    origin: '20世纪 欧洲',
    description: '写实主义风格的动物雕塑，生动传神',
    certified: true,
    collected: false,
    hash: 'sha256:e5f6a1b2c3d4e5f6a1b2'
  },
  {
    id: 7,
    name: '彩绘神话双耳瓶',
    image: '/exhibits/8962040077ff00fd335806a0f3b4f65a.jpg',
    origin: '18世纪 意大利',
    description: '巴洛克风格彩瓷，以酒神狂欢为主题',
    certified: true,
    collected: false,
    hash: 'sha256:f6a1b2c3d4e5f6a1b2c3'
  },
  {
    id: 8,
    name: '粉彩花卉茶壶套组',
    image: '/exhibits/f580ff0de4447ac727a07cc87c80baf2.jpg',
    origin: '清代 中国',
    description: '精美的中国传统茶具，色彩柔和典雅',
    certified: false,
    collected: false
  }
])

// 已收藏展品
const collectedExhibits = computed(() => exhibits.value.filter(e => e.collected))

// 最近交易记录
const recentTransactions = ref([
  {
    id: 1,
    name: '新艺术葡萄少女花瓶',
    image: '/exhibits/6b84b365fdb2bfb285d529708f797a8b.jpg',
    hash: 'sha256:a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6',
    time: '10分钟前'
  },
  {
    id: 2,
    name: '韦奇伍德蓝陶双耳瓶',
    image: '/exhibits/a8402b3d96aae48cf0889878e3545781.jpg',
    hash: 'sha256:b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6',
    time: '25分钟前'
  },
  {
    id: 3,
    name: '彩绘巴洛克执壶',
    image: '/exhibits/3bff7f176da38618331cbf101c3c6e78.jpg',
    hash: 'sha256:c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1',
    time: '1小时前'
  },
  {
    id: 4,
    name: '绿地粉彩中国风茶具',
    image: '/exhibits/ce099df5b991e285684b5b5021a178d4.jpg',
    hash: 'sha256:d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
    time: '2小时前'
  }
])

// 技术架构
const archLayers = [
  { name: '应用层', desc: '用户界面、资产管理、权限控制', icon: AppstoreOutlined },
  { name: '合约层', desc: '存证合约、验证合约、管理合约', icon: ApiOutlined },
  { name: '区块链层', desc: '百度超级链 XuperOS + XPoS共识', icon: BlockOutlined },
  { name: '存储层', desc: '链上元数据 + 链下IPFS存储', icon: HddOutlined }
]

const viewExhibit = (exhibit) => {
  currentExhibit.value = exhibit
  showExhibitModal.value = true
}

const toggleCollect = (exhibit) => {
  exhibit.collected = !exhibit.collected
  if (exhibit.collected) {
    message.success(`已收藏「${exhibit.name}」`)
  } else {
    message.info(`已取消收藏`)
  }
}
</script>

<style scoped>
.home-page {
  padding: 0;
  background: linear-gradient(180deg, #f4f8fb 0%, #ffffff 32%, #f7fbfd 100%);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(125deg, #102a43 0%, #0b4f6c 55%, #1f7a8c 100%);
  padding: 60px 40px;
  border-radius: 18px;
  margin-bottom: 40px;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 54%;
  height: 100%;
  background: radial-gradient(circle at 60% 45%, rgba(94, 234, 212, 0.2) 0%, transparent 56%);
}

.hero-title {
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #ffffff 0%, #c6f6ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.9);
}

.hero-desc {
  font-size: 16px;
  line-height: 1.8;
  opacity: 0.85;
  margin-bottom: 28px;
  max-width: 480px;
}

.hero-actions :deep(.ant-btn-default) {
  border-color: rgba(255, 255, 255, 0.65);
  color: #fff;
}

.hero-showcase {
  position: relative;
}

.showcase-main {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.28);
}

.showcase-image {
  width: 100%;
  height: 320px;
  object-fit: cover;
}

.showcase-overlay {
  position: absolute;
  top: 16px;
  right: 16px;
}

.showcase-badge {
  background: rgba(22, 163, 74, 0.9);
  color: #fff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
}

.showcase-info {
  padding: 16px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  margin-top: -40px;
  margin-left: 20px;
  margin-right: 20px;
  position: relative;
  backdrop-filter: blur(10px);
}

.showcase-info h3 {
  color: #fff;
  margin: 0 0 8px 0;
  font-size: 18px;
}

.showcase-info p {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 14px;
}

/* Stats Section */
.stats-section {
  margin-bottom: 48px;
}

.section-header {
  text-align: center;
  margin-bottom: 32px;
}

.section-header h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #102a43;
}

.section-header p {
  color: rgba(16, 42, 67, 0.66);
  font-size: 15px;
}

.stat-card {
  background: #fff;
  border: 1px solid #e6f4ff;
  border-radius: 14px;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  box-shadow: 0 8px 22px rgba(16, 42, 67, 0.08);
  transition: all 0.3s ease;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 34px rgba(16, 42, 67, 0.15);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.stat-primary .stat-icon { background: #e6f4ff; color: #1677ff; }
.stat-success .stat-icon { background: #e6fffb; color: #13a8a8; }
.stat-warning .stat-icon { background: #fff7e6; color: #d48806; }
.stat-info .stat-icon { background: #f6ffed; color: #389e0d; }

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-unit {
  font-size: 16px;
  font-weight: 400;
  margin-left: 2px;
}

.stat-label {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 4px;
}

.stat-desc {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

/* Exhibits Section */
.exhibits-section {
  margin-bottom: 48px;
}

.exhibit-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e6f4ff;
  overflow: hidden;
  box-shadow: 0 8px 22px rgba(16, 42, 67, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
}

.exhibit-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 36px rgba(16, 42, 67, 0.16);
}

.exhibit-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.exhibit-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.exhibit-card:hover .exhibit-image {
  transform: scale(1.05);
}

.exhibit-status {
  position: absolute;
  top: 12px;
  left: 12px;
}

.exhibit-actions {
  position: absolute;
  top: 12px;
  right: 12px;
}

.exhibit-actions .ant-btn {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  transition: all 0.3s;
}

.exhibit-actions .ant-btn:hover,
.exhibit-actions .ant-btn.collected {
  color: #ff4d4f;
  background: #fff;
}

.exhibit-info {
  padding: 16px;
}

.exhibit-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
}

.exhibit-origin {
  font-size: 12px;
  color: #0b4f6c;
  margin: 0 0 8px 0;
}

.exhibit-desc {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.section-more {
  text-align: center;
  margin-top: 24px;
}

/* Collection Section */
.collection-section {
  margin-bottom: 48px;
  background: linear-gradient(135deg, #eef8ff 0%, #ffffff 100%);
  border: 1px solid #d6ecff;
  padding: 32px;
  border-radius: 16px;
}

.collection-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 8px 0;
}

.collection-item {
  flex-shrink: 0;
  text-align: center;
}

.collection-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  border: 3px solid #36cfc9;
  box-shadow: 0 8px 16px rgba(19, 168, 168, 0.2);
}

.collection-item span {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Transactions Section */
.transactions-section {
  margin-bottom: 48px;
}

.transaction-list {
  padding: 0;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-item:hover {
  background: #f3fbff;
}

.tx-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.tx-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tx-info {
  flex: 1;
  min-width: 0;
}

.tx-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
}

.tx-hash {
  margin: 0;
}

.tx-meta {
  text-align: right;
}

.tx-time {
  display: block;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 4px;
}

.chain-info-card .block-height {
  font-family: 'Monaco', monospace;
  color: #0b4f6c;
}

/* Feature Section */
.feature-section {
  margin-bottom: 48px;
}

.feature-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e6f4ff;
  padding: 32px;
  text-align: center;
  box-shadow: 0 8px 22px rgba(16, 42, 67, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 34px rgba(16, 42, 67, 0.16);
}

.feature-icon-wrapper {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto 20px;
}

.feature-primary { background: linear-gradient(135deg, #1677ff 0%, #69b1ff 100%); color: #fff; }
.feature-success { background: linear-gradient(135deg, #13a8a8 0%, #5cdbd3 100%); color: #fff; }
.feature-warning { background: linear-gradient(135deg, #389e0d 0%, #73d13d 100%); color: #fff; }

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #102a43;
}

.feature-card p {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.7;
  margin-bottom: 16px;
}

/* Architecture Section */
.arch-section {
  margin-bottom: 48px;
}

.arch-diagram {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.arch-layer {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 24px;
  border-radius: 12px;
  color: #fff;
}

.layer-1 { background: linear-gradient(90deg, #1677ff 0%, #69b1ff 100%); }
.layer-2 { background: linear-gradient(90deg, #13a8a8 0%, #5cdbd3 100%); }
.layer-3 { background: linear-gradient(90deg, #0b4f6c 0%, #1f7a8c 100%); }
.layer-4 { background: linear-gradient(90deg, #389e0d 0%, #73d13d 100%); }

.layer-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.layer-content h4 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.layer-content p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

/* Exhibit Detail Modal */
.exhibit-detail .detail-image {
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
}

.exhibit-detail .detail-image img {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  background: #f5f5f5;
}

.detail-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* Responsive */
@media (max-width: 767px) {
  .hero-section {
    padding: 32px 20px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 18px;
  }

  .hero-desc {
    font-size: 14px;
  }

  .hero-showcase {
    margin-top: 24px;
  }

  .showcase-image {
    height: 200px;
  }

  .section-header h2 {
    font-size: 22px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .stat-value {
    font-size: 24px;
  }

  .exhibit-image-wrapper {
    height: 160px;
  }

  .feature-card {
    padding: 24px;
  }

  .arch-layer {
    padding: 16px;
  }

  .transaction-item {
    flex-wrap: wrap;
  }

  .tx-meta {
    width: 100%;
    text-align: left;
    margin-top: 8px;
  }
}
</style>
