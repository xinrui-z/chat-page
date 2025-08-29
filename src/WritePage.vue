<template>
  <div class="write-page-container">
    <!-- 左侧导航栏组件 -->
    <Sidebar :currentTab="currentTab" @tab-change="handleTabChange" />

    <!-- 右侧主要内容区域 -->
    <div class="main-content" v-show="currentTab === 'write'">
      <div class="content-wrapper">
        <div class="write-header">
          <h1>帮我写作</h1>
          <p>多种体裁，润色校对，一键成文</p>
        </div>

        <div class="write-area">
          <!-- 编辑器组件 -->
          <Editor :template-content="selectedTemplateContent" @send="handleSendContent" />

          <!-- 模板列表组件 -->
          <TemplateList @template-selected="handleTemplateSelected" />
        </div>
      </div>
    </div>

    <!-- 其他 tab 内容 -->
    <div class="other-tab" v-show="currentTab === 'newChat'">新对话页面内容</div>
    <div class="other-tab" v-show="currentTab === 'aiSearch'">AI 搜索页面内容</div>
    <div class="other-tab" v-show="currentTab === 'code'">AI 编程页面内容</div>
    <div class="other-tab" v-show="currentTab === 'image'">图像生成页面内容</div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue';
import Editor from './components/Editor.vue';
import TemplateList from './components/TemplateList.vue';

export default {
  components: {
    Sidebar,
    Editor,
    TemplateList
  },
  data() {
    return {
      currentTab: 'write',
      selectedTemplateContent: ''
    };
  },
  methods: {
    handleTabChange(tab) {
      this.currentTab = tab;
    },
    handleTemplateSelected(template) {
      this.selectedTemplateContent = template.content;
    },
    handleSendContent(fullText) {
      // 处理发送的完整文本
      console.log('发送内容:', fullText);
      // 这里可以添加调用API等逻辑
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  overflow: hidden;
}

.write-page-container {
  display: flex;
  height: 100vh;
  font-family: sans-serif;
  position: relative;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
  height: 100vh;
}

.content-wrapper {
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.write-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px 0;
}

.write-header h1 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #333;
}

.write-header p {
  color: #666;
  font-size: 16px;
}

.write-area {
  width: 100%;
}

/* 其他模块样式 */
.other-tab {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  margin-left: 220px;
  height: 100vh;
  display: none;
}

/* 响应式适配 */
@media (max-width: 768px) {

  .main-content,
  .other-tab {
    margin-left: 0;
    padding-top: 60px;
    /* 为移动端导航留出空间 */
  }

  .sidebar {
    position: fixed;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.active {
    transform: translateX(0);
  }
}
</style>
