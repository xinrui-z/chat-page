<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <span class="sidebar-title">MagiQ</span>
    </div>
    <div class="sidebar-menu">
      <button class="menu-item" :class="{ active: currentTab === 'newChat' }" @click="handleTabChange('newChat')">+ 新对话</button>
      <button class="menu-item" :class="{ active: currentTab === 'aiSearch' }" @click="handleTabChange('aiSearch')">AI 搜索</button>
      <button class="menu-item" :class="{ active: currentTab === 'write' }" @click="handleTabChange('write')">帮我写作</button>
      <button class="menu-item" :class="{ active: currentTab === 'code' }" @click="handleTabChange('code')">AI 编程</button>
      <button class="menu-item" :class="{ active: currentTab === 'image' }" @click="handleTabChange('image')">图像生成</button>
      <button class="menu-item more" @click="showMore = !showMore">
        更多
        <i class="arrow" :class="{ 'up': showMore, 'down': !showMore }"></i>
      </button>
      <div class="sub-menu" v-show="showMore">
        <button class="sub-menu-item">待扩展功能1</button>
        <button class="sub-menu-item">待扩展功能2</button>
      </div>
    </div>
    <div class="recent-chat">
      <h3>最近对话</h3>
      <p>你新建的对话记录将会出现在这里</p>
    </div>
    <div class="about">
      <button class="about-btn">关于MagiQ</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentTab: {
      type: String,
      default: 'write'
    }
  },
  data() {
    return {
      showMore: false
    };
  },
  methods: {
    handleTabChange(tab) {
      this.$emit('tab-change', tab);
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 220px;
  background-color: #f8f9fa;
  padding: 10px;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.sidebar-title {
  font-size: 16px;
  font-weight: bold;
}

.sidebar-menu .menu-item {
  width: 100%;
  text-align: left;
  padding: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.sidebar-menu .menu-item:hover {
  background-color: #e9ecef;
}

.sidebar-menu .menu-item.active {
  background-color: #e9ecef;
  font-weight: 500;
}

.more {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sub-menu {
  margin-top: 5px;
  padding-left: 10px;
}

.sub-menu .sub-menu-item {
  width: 100%;
  text-align: left;
  padding: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.sub-menu .sub-menu-item:hover {
  background-color: #e9ecef;
}

.recent-chat {
  margin-top: 20px;
  padding: 10px;
  color: #666;
  font-size: 14px;
}

.recent-chat h3 {
  margin-bottom: 8px;
  font-size: 15px;
  color: #333;
}

.about {
  padding: 10px;
  margin-top: auto;
}

.about-btn {
  width: 100%;
  text-align: left;
  padding: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.about-btn:hover {
  background-color: #e9ecef;
}
</style>
