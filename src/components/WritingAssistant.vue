<template>
  <div class="write-page-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <span class="sidebar-title">MagiQ</span>
      </div>
      <div class="sidebar-menu">
        <button class="menu-item" :class="{ active: currentTab === 'newChat' }" @click="currentTab = 'newChat'">+
          新对话</button>
        <button class="menu-item" :class="{ active: currentTab === 'aiSearch' }" @click="currentTab = 'aiSearch'">AI
          搜索</button>
        <button class="menu-item" :class="{ active: currentTab === 'write' }"
          @click="currentTab = 'write'">帮我写作</button>
        <button class="menu-item" :class="{ active: currentTab === 'code' }" @click="currentTab = 'code'">AI 编程</button>
        <button class="menu-item" :class="{ active: currentTab === 'image' }"
          @click="currentTab = 'image'">图像生成</button>
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

    <!-- 右侧主要内容区域 -->
    <div class="main-content" v-show="currentTab === 'write'">
      <div class="content-wrapper">
        <div class="write-header">
          <h1>帮我写作</h1>
          <p>多种体裁，润色校对，一键成文</p>
        </div>

        <div class="input-area">
          <div ref="writeInput" class="write-input contenteditable" contenteditable="true"
            :data-placeholder="inputText.trim() === '' ? '输入主题和写作要求' : ''" @input="handleInput" @keydown="handleKeydown"
            @click="updateCursor"></div>
          <div class="function-btns">
            <div class="left-group">
              <button class="func-btn">深度思考:自动</button>
              <button class="func-btn">搜索资料</button>
              <button class="func-btn">文档编辑器</button>
            </div>
            <div class="right-group">
              <button class="voice-btn">
                <FontAwesomeIcon icon="microphone" />
              </button>
              <button class="send-btn" :class="{ 'has-content': inputText.trim() !== '' }">
                <FontAwesomeIcon icon="up-long" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="showVariableHint" class="variable-hint">
          <span class="hint-text">提示：点击高亮的变量进行编辑，按Tab键跳转到下一个变量</span>
        </div>

        <div class="category-tabs">
          <button class="tab-item" :class="{ active: currentCategory === 'all' }"
            @click="currentCategory = 'all'">全部</button>
          <button class="tab-item" :class="{ active: currentCategory === 'work' }"
            @click="currentCategory = 'work'">工作</button>
          <button class="tab-item" :class="{ active: currentCategory === 'business' }"
            @click="currentCategory = 'business'">商业营销</button>
          <button class="tab-item" :class="{ active: currentCategory === 'study' }"
            @click="currentCategory = 'study'">学习/教育</button>
          <button class="tab-item" :class="{ active: currentCategory === 'social' }"
            @click="currentCategory = 'social'">社媒文章</button>
          <button class="tab-item" :class="{ active: currentCategory === 'literature' }"
            @click="currentCategory = 'literature'">文学艺术</button>
          <button class="tab-item" :class="{ active: currentCategory === 'reply' }"
            @click="currentCategory = 'reply'">回复和改写</button>
        </div>

        <div class="card-list">
          <div class="card" v-for="(item, index) in filteredCardData" :key="index" @click="fillTemplate(item.template)">
            <div class="card-header">
              <div class="card-icon" :style="{ backgroundColor: item.color }">
                <i class="card-icon-inner" :class="item.icon"></i>
              </div>
              <p class="card-title">{{ item.title }}</p>
            </div>
            <p class="card-desc">{{ item.desc }}</p>
          </div>
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
export default {
  data() {
    return {
      currentTab: 'write',
      showMore: false,
      currentCategory: 'all',
      inputText: '',
      rawInputText: '',
      showVariableHint: false,
      variables: [],
      currentVariableIndex: -1,
      cardData: [
        { title: '长文写作', desc: '分步整生成大纲和文档', color: '#d9f5d6', icon: 'el-icon-document', template: '请帮我写一篇关于[主题]的长文，要求包含[字数]字，主要面向[目标读者]，文章风格要[文风要求]。', category: 'work' },
        { title: '文章', desc: '撰写各主流平台文章', color: '#d6eaf8', icon: 'el-icon-s-data', template: '请为我写一篇[平台类型]平台的文章，主题是[文章主题]，目标是[发布目的]，字数控制在[字数要求]以内。', category: 'work' },
        { title: '总结汇报', desc: '凝练你的工作成效', color: '#fce4d6', icon: 'el-icon-notebook-2', template: '请帮我写一份[时间周期]的[汇报类型]，主要汇报[工作内容]的成果，重点突出[核心亮点]。', category: 'work' },
        { title: '论文', desc: '撰写专业详实的论文', color: '#e6dcf3', icon: 'el-icon-edit-outline', template: '请帮我写一篇[学科领域]的学术论文，研究主题是[研究题目]，论文类型为[论文类型]，字数要求[字数范围]。', category: 'study' },
        { title: '作文', desc: '专为学生打造满分作文', color: '#d9f5d6', icon: 'el-icon-edit', template: '请帮我写一篇[作文类型]作文，题目是「[作文题目]」，要求[字数]字，适合[年级水平]学生水平。', category: 'study' },
        { title: '宣传文案', desc: '撰写各平台的推广文案', color: '#d6eaf8', icon: 'el-icon-promotion', template: '请为[产品/服务名称]写一份[推广平台]的宣传文案，目标客户是[目标用户群体]，突出[核心卖点]。', category: 'business' },
        { title: '社媒笔记', desc: '打造吸睛的笔记内容', color: '#fce4d6', icon: 'el-icon-message', template: '请帮我写一篇[平台名称]的种草笔记，主题是[笔记主题]，风格要[内容风格]，目标是[发布目的]。', category: 'social' },
        { title: '润色', desc: '让文字表达更出彩', color: '#e6dcf3', icon: 'el-icon-color-setting', template: '请帮我润色以下[文本类型]，要求[润色方向]，保持[语言风格]：\n\n[原文内容]', category: 'reply' },
        { title: '小说', desc: '创作引人入胜的小说', color: '#d9f5d6', icon: 'el-icon-menu-book', template: '请帮我写一篇[题材类型]小说，主角是[主角设定]，故事背景在[时空背景]，主要情节围绕[核心冲突]展开。', category: 'literature' },
        { title: '话术', desc: '满足不同场景表达需求', color: '#d6eaf8', icon: 'el-icon-chat-dot-round', template: '请为我准备[应用场景]的话术，对象是[沟通对象]，目标是[沟通目的]，语气要[语言风格]。', category: 'work' },
        { title: '研究报告', desc: '深度研究，精准分析', color: '#fce4d6', icon: 'el-icon-files', template: '请帮我写一份关于[研究主题]的研究报告，重点分析[分析维度]，面向[目标读者]，报告长度约[字数要求]。', category: 'work' },
        { title: '心得体会', desc: '助你提炼归纳所感所悟', color: '#e6dcf3', icon: 'el-icon-star-on', template: '请帮我写一篇关于[体验主题]的心得体会，重点分享[核心收获]，适合[分享场合]的语言风格。', category: 'work' },
        { title: '思想汇报', desc: '进行反思梳理深入总结', color: '#d9f5d6', icon: 'el-icon-notebook-1', template: '请帮我写一份[时间周期]的思想汇报，主要围绕[汇报主题]，体现[思想变化]，字数控制在[字数要求]。', category: 'work' },
        { title: '诗歌', desc: '创作动人心弦的诗篇', color: '#d6eaf8', icon: 'el-icon-paperclip', template: '请创作一首[诗歌体裁]，主题是[诗歌主题]，表达[情感基调]，风格偏向[诗歌风格]。', category: 'literature' },
        { title: '朋友圈', desc: '精心设计的朋友圈文案', color: '#fce4d6', icon: 'el-icon-share', template: '请帮我写一条朋友圈文案，分享[分享内容]，风格要[文案风格]，希望获得[期望反应]。', category: 'social' },
        { title: '微博', desc: '撰写吸引眼球的微博', color: '#e6dcf3', icon: 'el-icon-s-promotion', template: '请帮我写一条微博，内容关于[微博主题]，加上[相关话题]话题标签，风格要[内容风格]。', category: 'social' },
        { title: '故事', desc: '编织触动心灵的故事', color: '#d9f5d6', icon: 'el-icon-user', template: '请创作一个[故事类型]故事，主人公是[角色设定]，故事发生在[时空设定]，想要传达[故事寓意]。', category: 'literature' },
        { title: '方案策划', desc: '量身定制各种方案', color: '#d6eaf8', icon: 'el-icon-s-order', template: '请帮我制定一个[方案类型]方案，项目是[项目名称]，目标是[预期目标]，时间节点为[时间安排]。', category: 'business' },
        { title: '市场调研报告', desc: '精准分析市场洞察', color: '#fce4d6', icon: 'el-icon-location-information', template: '请帮我写一份[行业/产品]的市场调研报告，重点分析[调研重点]，目标市场是[目标市场]，报告用途为[使用目的]。', category: 'business' },
        { title: '广告创意文案', desc: '创作吸引眼球的广告词', color: '#e6dcf3', icon: 'el-icon-ad', template: '请为[产品/服务]创作[广告形式]广告文案，目标人群是[目标受众]，核心诉求是[核心卖点]，投放渠道为[投放平台]。', category: 'business' },
        { title: '推广策略', desc: '制定高效的营销推广方案', color: '#d9f5d6', icon: 'el-icon-s-marketing', template: '请为[产品/品牌]制定[推广周期]的营销推广策略，目标用户是[用户画像]，预算范围[预算区间]，主要推广渠道包括[渠道列表]。', category: 'business' },
        { title: '评语', desc: '精准撰写个性化评语', color: '#d6eaf8', icon: 'el-icon-comment', template: '请为[评价对象]写一份[评语类型]评语，重点评价[评价维度]，语气要[评价风格]，字数控制在[字数要求]以内。', category: 'study' },
        { title: '教案', desc: '打造多样化的教学方案', color: '#fce4d6', icon: 'el-icon-s-data', template: '请帮我设计一节[学科]课的教案，课题是[课题名称]，面向[年级]学生，课时为[课时长度]，重点培养[教学目标]。', category: 'study' },
        { title: '计划', desc: '量身定制工作生活计划', color: '#e6dcf3', icon: 'el-icon-s-order', template: '请帮我制定一个[计划类型]计划，时间周期为[计划周期]，主要目标是[核心目标]，重点关注[关键领域]。', category: 'work' }
      ]
    };
  },
  computed: {
    filteredCardData() {
      if (this.currentCategory === 'all') {
        return this.cardData;
      }
      return this.cardData.filter(item => item.category === this.currentCategory);
    },
    formattedText() {
      if (this.rawInputText === '') return '';

      let formatted = this.rawInputText;
      const variableRegex = /\[([^\]]+)\]/g;

      formatted = formatted.replace(variableRegex, (match, variable) => {
        return `<span class="variable-placeholder" data-variable="${variable}">${match}</span>`;
      });

      return formatted;
    }
  },
  methods: {
    fillTemplate(template) {
      if (!template) return;

      this.rawInputText = template;
      this.inputText = template;
      this.extractVariables();
      this.showVariableHint = this.variables.length > 0;

      // 强制更新DOM以显示高亮
      this.$nextTick(() => {
        const input = this.$refs.writeInput;
        if (input) {
          input.innerHTML = this.formattedText;
          this.focusInput();
          this.selectFirstVariable();
        }
      });
    },

    extractVariables() {
      const variableRegex = /\[([^\]]+)\]/g;
      this.variables = [];
      let match;

      while ((match = variableRegex.exec(this.rawInputText)) !== null) {
        this.variables.push({
          name: match[1],
          start: match.index,
          end: match.index + match[0].length,
          placeholder: match[0]
        });
      }
    },

    focusInput() {
      if (this.$refs.writeInput) {
        this.$refs.writeInput.focus();
      }
    },

    selectFirstVariable() {
      if (this.variables.length > 0) {
        this.currentVariableIndex = 0;
        this.selectVariable(0);
      }
    },

    selectVariable(index) {
      if (index < 0 || index >= this.variables.length) return;

      const input = this.$refs.writeInput;
      if (!input) return;

      const variableElements = input.querySelectorAll('.variable-placeholder');
      if (variableElements[index]) {
        const range = document.createRange();
        const selection = window.getSelection();

        // 选中变量内容以便用户替换
        range.selectNodeContents(variableElements[index]);
        selection.removeAllRanges();
        selection.addRange(range);

        this.currentVariableIndex = index;
      }
    },

    handleInput(event) {
      const content = event.target.innerText || '';
      this.inputText = content;
      this.rawInputText = content;

      // 只有在内容为空时才重置变量状态
      if (content.trim() === '') {
        this.showVariableHint = false;
        this.variables = [];
        this.currentVariableIndex = -1;
      }

      // 避免在普通输入时重新渲染HTML，防止光标跳转
      // 只在模板填充时才进行变量高亮
    },

    handleKeydown(event) {
      if (event.key === 'Tab') {
        event.preventDefault();
        this.selectNextVariable();
      }

      // 如果在变量上按下非特殊键，准备替换变量内容
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;

        if (element && element.classList && element.classList.contains('variable-placeholder')) {
          // 在变量上打字时，让用户直接替换内容
          if (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete') {
            // 不阻止默认事件，让编辑正常进行
          }
        }
      }
    },

    selectNextVariable() {
      if (this.variables.length === 0) return;

      // 重新扫描当前 DOM 中的变量
      const input = this.$refs.writeInput;
      if (!input) return;

      const variableElements = input.querySelectorAll('.variable-placeholder');
      if (variableElements.length === 0) {
        this.showVariableHint = false;
        return;
      }

      this.currentVariableIndex = (this.currentVariableIndex + 1) % variableElements.length;

      const range = document.createRange();
      const selection = window.getSelection();

      range.selectNodeContents(variableElements[this.currentVariableIndex]);
      selection.removeAllRanges();
      selection.addRange(range);
    },

    updateCursor() {
      // 保存当前光标位置，用于变量选择等操作
    },

    updateSendButtonColor() {
      // 保持原有逻辑
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

/* 侧边栏 */
.sidebar {
  width: 220px;
  background-color: #f8f9fa;
  padding: 10px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
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

/* 主内容区域 */
.main-content {
  flex: 1;
  padding: 20px 0;
  /* 只保留上下内边距 */
  margin-left: 220px;
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

.input-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 10px;
  padding: 5px 0;
  border: #f3f3f3 0.5px solid;
  border-radius: 20px;
}

.write-input {
  padding: 15px 20px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.2s;
  min-height: 20px;
  line-height: 1.5;
  outline: none;
}

.write-input.contenteditable {
  min-height: 50px;
  max-height: 200px;
  overflow-y: auto;
  word-wrap: break-word;
}

.write-input.contenteditable:empty:before {
  content: attr(data-placeholder);
  color: #999;
  pointer-events: none;
}

.write-input:focus {
  outline: none;
  border-color: #409eff;
}

/* 变量高亮样式 */
.variable-placeholder {
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  margin: 0 1px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-block;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(64, 158, 255, 0.3);
}

.variable-placeholder:hover {
  background: linear-gradient(135deg, #67c23a 0%, #409eff 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.4);
}

/* 变量提示样式 */
.variable-hint {
  padding: 8px 12px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  margin-top: 8px;
  margin-bottom: 15px;
  font-size: 13px;
  color: #0369a1;
  display: flex;
  align-items: center;
  gap: 6px;
}

.variable-hint::before {
  content: '💡';
  font-size: 14px;
}

.hint-text {
  flex: 1;
}

.function-btns {
  display: flex;
  align-items: center;
  padding: 20px 15px 10px 15px;
  justify-content: space-between;
}

.left-group {
  display: flex;
  gap: 5px;
}

.right-group {
  display: flex;
  gap: 5px;
}

.func-btn {
  padding: 8px 12px;
  margin-right: 10px;
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.func-btn:hover {
  background-color: #f5f5f5;
}

.voice-btn,
.send-btn {
  padding: 12px 12px;
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 100%;
  cursor: pointer;
  transition: all 0.2s;
}


.send-btn {
  background-color: #ccc;
  color: white;
  border-color: #ccc;
  margin-left: 5px;
}


.send-btn.has-content {
  background-color: #409eff;
  border-color: #409eff;
}

.category-tabs {
  display: flex;
  margin-bottom: 15px;
  overflow-x: auto;
  scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.tab-item {
  padding: 8px 16px;
  margin-right: 10px;
  background-color: #fff;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.tab-item.active {
  color: #333;
  font-weight: bold;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.tab-item:hover:not(.active) {
  background-color: #f5f5f5;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  width: calc(25% - 16px);
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 18px 15px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fff;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
  border-color: #e0e0e0;
}

.card:active {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.card-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.card-icon-inner {
  color: #fff;
  font-size: 22px;
}

.card-title {
  font-weight: 500;
  color: #333;
  font-size: 15px;
  margin: 0;
}

.card-desc {
  color: #666;
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
  text-align: left;
}

.other-tab {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  margin-left: 220px;
  height: 100vh;
  display: none;
}
</style>