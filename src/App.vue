<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
const isMobile = ref(false)
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

const mainOffset = computed(() => {
  if (isMobile.value) return 0
  return collapsed.value ? 80 : 200
})

const updateIsMobile = () => {
  const mobile = window.innerWidth < 768
  isMobile.value = mobile
  if (mobile) {
    collapsed.value = true
  }
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})

const handleMenuClick = ({ key }: { key: string }) => {
  router.push({ name: key })
  if (isMobile.value) {
    collapsed.value = true
  }
}
</script>

<template>
  <a-layout class="app-layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      :collapsed-width="isMobile ? 0 : 80"
      :width="200"
      class="app-sider"
      :class="{ 'app-sider-mobile': isMobile }"
    >
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

    <div v-if="isMobile && !collapsed" class="sider-mask" @click="collapsed = true"></div>

    <a-layout class="main-layout" :style="{ marginLeft: `${mainOffset}px` }">
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
        <div v-if="!isMobile" class="header-right">
          <a-tag color="green">测试网络已连接</a-tag>
        </div>
      </a-layout-header>
      <a-layout-content class="app-content" :class="{ 'app-content-mobile': isMobile }">
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

.main-layout {
  transition: margin-left 0.2s;
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

.app-sider-mobile {
  z-index: 20;
}

.sider-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 15;
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
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #001529;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.app-content {
  margin: 24px;
  padding: 24px;
  background: #fff;
  min-height: calc(100vh - 64px - 70px - 48px - 48px);
  border-radius: 8px;
}

.app-content-mobile {
  margin: 12px;
  padding: 12px;
  border-radius: 6px;
}

.app-footer {
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
}

@media (max-width: 767px) {
  .app-header {
    padding: 0 12px;
  }

  .header-left {
    gap: 8px;
  }

  .header-title {
    font-size: 14px;
  }

  .app-footer {
    padding: 12px;
    font-size: 12px;
    line-height: 1.5;
  }
}
</style>
