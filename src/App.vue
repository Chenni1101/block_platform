<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  HomeOutlined,
  SafetyCertificateOutlined,
  CloudUploadOutlined,
  SearchOutlined,
  BarChartOutlined,
  BlockOutlined
} from '@ant-design/icons-vue'

const collapsed = ref(false)
const route = useRoute()
const router = useRouter()

const selectedKeys = computed(() => [route.name as string])

const menuItems = [
  {
    key: 'home',
    icon: HomeOutlined,
    label: '首页',
    title: '首页'
  },
  {
    key: 'evidence',
    icon: SafetyCertificateOutlined,
    label: '版权存证',
    title: '版权存证'
  },
  {
    key: 'asset',
    icon: CloudUploadOutlined,
    label: '资产管理',
    title: '资产管理'
  },
  {
    key: 'query',
    icon: SearchOutlined,
    label: '存证查询',
    title: '存证查询'
  },
  {
    key: 'performance',
    icon: BarChartOutlined,
    label: '性能展示',
    title: '性能展示'
  }
]

const handleMenuClick = ({ key }: { key: string }) => {
  router.push({ name: key })
}
</script>

<template>
  <a-layout class="app-layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible class="app-sider">
      <div class="logo">
        <BlockOutlined class="logo-icon" />
        <span v-show="!collapsed" class="logo-text">区块链存证平台</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        @click="handleMenuClick"
      >
        <a-menu-item v-for="item in menuItems" :key="item.key">
          <component :is="item.icon" />
          <span>{{ item.label }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="app-header">
        <div class="header-left">
          <a-button type="text" @click="collapsed = !collapsed">
            <template #icon>
              <menu-unfold-outlined v-if="collapsed" />
              <menu-fold-outlined v-else />
            </template>
          </a-button>
          <span class="header-title">基于百度超级链的文旅数字资产版权存证系统</span>
        </div>
        <div class="header-right">
          <a-tag color="green">测试网络已连接</a-tag>
        </div>
      </a-layout-header>
      <a-layout-content class="app-content">
        <RouterView />
      </a-layout-content>
      <a-layout-footer class="app-footer">
        文旅数字资产版权存证平台 ©2026 | 基于百度超级链(XuperOS)技术支持
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
export default {
  components: { MenuUnfoldOutlined, MenuFoldOutlined }
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.app-sider {
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  margin: 16px;
  border-radius: 8px;
}

.logo-icon {
  font-size: 24px;
  color: #1890ff;
}

.logo-text {
  margin-left: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.app-header {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  margin-left: 200px;
  transition: margin-left 0.2s;
}

.app-layout :deep(.ant-layout-sider-collapsed) + .ant-layout .app-header {
  margin-left: 80px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #001529;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.app-content {
  margin: 24px;
  margin-left: 224px;
  padding: 24px;
  background: #fff;
  min-height: calc(100vh - 64px - 70px - 48px);
  border-radius: 8px;
  transition: margin-left 0.2s;
}

.app-layout :deep(.ant-layout-sider-collapsed) + .ant-layout .app-content {
  margin-left: 104px;
}

.app-footer {
  text-align: center;
  margin-left: 200px;
  transition: margin-left 0.2s;
  color: rgba(0, 0, 0, 0.45);
}

.app-layout :deep(.ant-layout-sider-collapsed) + .ant-layout .app-footer {
  margin-left: 80px;
}
</style>
