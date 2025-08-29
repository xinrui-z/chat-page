<template>
  <div class="card" @click="handleCardClick">
    <div class="card-header">
      <div class="card-icon" :style="{ backgroundColor: item.color }">
        <i class="card-icon-inner" :class="item.icon"></i>
      </div>
      <p class="card-title">{{ item.title }}</p>
    </div>
    <p class="card-desc">{{ item.desc }}</p>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  methods: {
    handleCardClick() {
      this.$emit('select', this.item);
    }
  }
};
</script>

<style scoped>
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

@media (max-width: 1024px) {
  .card {
    width: calc(33.333% - 16px);
  }
}

@media (max-width: 768px) {
  .card {
    width: calc(50% - 16px);
  }
}

@media (max-width: 480px) {
  .card {
    width: 100%;
  }
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
</style>
