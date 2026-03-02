<template>
  <div class="home-page">
    <!-- 顶部横幅 -->
    <div class="hero-section">
      <a-row :gutter="24" align="middle">
        <a-col :span="14">
          <h1 class="hero-title">基于百度超级链的文旅数字资产版权存证模型</h1>
          <p class="hero-desc">
            本系统旨在解决数字文旅产业中资产易篡改、版权确权困难、收益分配不透明等问题，
            通过区块链技术构建透明、可信的版权保护体系。
          </p>
          <a-space size="middle">
            <a-button type="primary" size="large" @click="$router.push('/evidence')">
              <template #icon><SafetyCertificateOutlined /></template>
              开始存证
            </a-button>
            <a-button size="large" @click="$router.push('/query')">
              <template #icon><SearchOutlined /></template>
              查询存证
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="10">
          <div class="hero-image">
            <BlockOutlined style="font-size: 180px; color: #1890ff; opacity: 0.8;" />
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- 核心数据展示 -->
    <a-row :gutter="24" class="stats-section">
      <a-col :span="6">
        <a-card class="stat-card">
          <a-statistic title="存证文物数量" :value="200" suffix="件">
            <template #prefix><DatabaseOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card">
          <a-statistic title="存证成功率" :value="100" suffix="%">
            <template #prefix><CheckCircleOutlined style="color: #52c41a;" /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card">
          <a-statistic title="单次存证成本" :value="0.01" prefix="¥">
            <template #prefix><PayCircleOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card">
          <a-statistic title="平均响应时间" :value="42" suffix="ms">
            <template #prefix><ThunderboltOutlined style="color: #faad14;" /></template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- 核心功能介绍 -->
    <div class="section-title">
      <h2>核心功能</h2>
      <p>一站式数字资产版权保护解决方案</p>
    </div>
    <a-row :gutter="24" class="feature-section">
      <a-col :span="8">
        <a-card hoverable class="feature-card">
          <template #cover>
            <div class="feature-icon">
              <SafetyCertificateOutlined />
            </div>
          </template>
          <a-card-meta title="版权存证" description="基于区块链的不可篡改存证，生成唯一哈希标识，确保数字资产版权可追溯、可验证。" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card hoverable class="feature-card">
          <template #cover>
            <div class="feature-icon">
              <CloudUploadOutlined />
            </div>
          </template>
          <a-card-meta title="资产管理" description="支持多种格式数字资产上传、分类管理，链上链下协同存储，高效安全。" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card hoverable class="feature-card">
          <template #cover>
            <div class="feature-icon">
              <SearchOutlined />
            </div>
          </template>
          <a-card-meta title="存证查询" description="双索引结构支持O(1)复杂度检索，快速验证资产真实性和版权归属。" />
        </a-card>
      </a-col>
    </a-row>

    <!-- 技术架构 -->
    <div class="section-title">
      <h2>技术架构</h2>
      <p>四层架构设计，确保系统稳定高效</p>
    </div>
    <a-row :gutter="24" class="arch-section">
      <a-col :span="6">
        <a-card class="arch-card">
          <div class="arch-layer layer-1">应用层</div>
          <p>用户界面、资产管理、权限控制</p>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="arch-card">
          <div class="arch-layer layer-2">合约层</div>
          <p>存证合约、验证合约、管理合约</p>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="arch-card">
          <div class="arch-layer layer-3">区块链层</div>
          <p>百度超级链 XuperOS + XPoS共识</p>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="arch-card">
          <div class="arch-layer layer-4">存储层</div>
          <p>链上元数据 + 链下IPFS存储</p>
        </a-card>
      </a-col>
    </a-row>

    <!-- 项目信息 -->
    <a-row :gutter="24" class="info-section">
      <a-col :span="12">
        <a-card title="项目团队" :bordered="false">
          <a-descriptions :column="1">
            <a-descriptions-item label="学生成员">
              <a-tag color="blue">宋昕烨 - 信息管理</a-tag>
              <a-tag color="blue">徐浩程 - 物流管理</a-tag>
              <a-tag color="blue">王晨 - 信息管理</a-tag>
              <a-tag color="blue">杨紫涵 - 信息管理</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="指导教师">
              <a-tag color="green">罗玉宏 - 统计与数据学院</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="合作单位">
              上海对外经贸大学博物馆
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="技术特色" :bordered="false">
          <a-list :data-source="features" size="small">
            <template #renderItem="{ item }">
              <a-list-item>
                <CheckCircleOutlined style="color: #52c41a; margin-right: 8px;" />
                {{ item }}
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import {
  SafetyCertificateOutlined,
  SearchOutlined,
  BlockOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  PayCircleOutlined,
  ThunderboltOutlined,
  CloudUploadOutlined
} from '@ant-design/icons-vue'

const features = [
  '创新性双桶索引优化查询效率，支持O(1)复杂度检索',
  '与博物馆合作测试200件文物，存证成功率100%',
  '存证成本仅0.01元/次，远低于传统公证',
  '预留NFT、智能分润与AI辅助创作扩展接口',
  '链上链下协同存储，平衡性能与成本'
]
</script>

<style scoped>
.home-page {
  padding: 0;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 40px;
  border-radius: 12px;
  margin-bottom: 24px;
  color: #fff;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #fff;
}

.hero-desc {
  font-size: 16px;
  line-height: 1.8;
  opacity: 0.9;
  margin-bottom: 24px;
}

.hero-image {
  text-align: center;
}

.stats-section {
  margin-bottom: 40px;
}

.stat-card {
  text-align: center;
  border-radius: 8px;
}

.section-title {
  text-align: center;
  margin-bottom: 24px;
}

.section-title h2 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.section-title p {
  color: rgba(0, 0, 0, 0.45);
}

.feature-section {
  margin-bottom: 40px;
}

.feature-card {
  text-align: center;
  border-radius: 12px;
}

.feature-icon {
  padding: 40px;
  font-size: 64px;
  color: #1890ff;
  background: linear-gradient(180deg, #e6f7ff 0%, #fff 100%);
}

.arch-section {
  margin-bottom: 40px;
}

.arch-card {
  text-align: center;
  border-radius: 8px;
}

.arch-card p {
  color: rgba(0, 0, 0, 0.65);
  margin-top: 12px;
}

.arch-layer {
  padding: 16px;
  border-radius: 8px;
  font-weight: 600;
  color: #fff;
}

.layer-1 { background: #1890ff; }
.layer-2 { background: #52c41a; }
.layer-3 { background: #faad14; }
.layer-4 { background: #722ed1; }

.info-section {
  margin-top: 24px;
}
</style>
