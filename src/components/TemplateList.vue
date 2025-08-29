<template>
  <div class="templates">
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
      <TemplateCard v-for="(item, index) in filteredtemplates" :key="index" :item="item"
        @select="handleTemplateSelect" />
    </div>
  </div>
</template>

<script>
import TemplateCard from './TemplateCard.vue';
import templateData from '../data/templateData';

export default {
  components: {
    TemplateCard
  },
  data() {
    return {
      currentCategory: 'all',
      templates: templateData
    };
  },
  computed: {
    filteredtemplates() {
      if (this.currentCategory === 'all') {
        return this.templates;
      }
      return this.templates.filter(item => item.category === this.currentCategory);
    }
  },
  methods: {
    handleTemplateSelect(template) {
      this.$emit('template-selected', template);
    }
  }
};
</script>

<style scoped>
.category-tabs {
  display: flex;
  margin-bottom: 15px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 5px;
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

.templates h3 {
  margin-bottom: 16px;
  font-size: 18px;
  color: #111827;
}
</style>
