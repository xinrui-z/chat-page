<template>
  <div class="editor-container">
    <div class="editor" @click="handleEditorClick" contenteditable="true" @beforeinput="handleBeforeInput"
      @input="handleEditorInput" @keydown="handleEditorKeydown" ref="editor">
      <!-- 动态渲染文本片段和占位符 -->
      <template v-if="contentSegments.length > 0">
        <template v-for="(segment, index) in contentSegments" :key="index">
          <!-- 普通文本片段 -->
          <span v-if="segment.type === 'text'" class="text-segment" :data-index="index" contenteditable="true">{{
            segment.content }}</span>

          <!-- 占位符片段 -->
          <span v-if="segment.type === 'placeholder'" class="placeholder-segment"
            :class="{ active: activePlaceholderIndex === index, 'placeholder-hint-mode': segment.isHint }"
            :data-index="index" @click.stop="selectPlaceholder(index)" contenteditable="true"
            @input="handlePlaceholderInput(index, $event)" @keydown="handlePlaceholderKeydown(index, $event)"
            @cut.prevent="handlePlaceholderCut(index, $event)">{{ segment.content }}
          </span>
        </template>
      </template>
      <template v-else>
        <span class="placeholder-hint" v-if="!hasContent">输入主题和写作要求</span>
      </template>

      <!-- 用于光标定位的隐形元素 -->
      <span ref="cursorAnchor" class="cursor-anchor"></span>
    </div>

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
        <button class="send-btn" :class="{ 'has-content': hasContent }" @click="handleSend">
          <FontAwesomeIcon icon="up-long" />
        </button>
      </div>
    </div>

    <div v-if="showVariableHint" class="variable-hint">
      <span class="hint-text">提示：点击高亮的变量进行编辑，按Tab键跳转到下一个变量</span>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// 正则匹配缓存 
const PLACEHOLDER_REGEX = /\[([^\]]+)\]/g;

const BUILTIN_PLACEHOLDER_HINTS = {
  '教师': '请输入职业',
  '姓名': '请输入姓名',
  '字数': '请输入字数',
  '字数要求': '请输入字数',
  '目标读者': '请输入目标读者',
  '文风要求': '请输入文风',
  '平台类型': '请输入平台类型',
  '文章主题': '请输入文章主题',
  '发布目的': '请输入发布目的',
  '产品/服务名称': '请输入产品或服务名称',
  '目标用户群体': '请输入目标用户群体',
  '时间周期': '请输入时间周期',
  '汇报类型': '请输入汇报类型',
  '工作内容': '请输入工作内容',
  '核心亮点': '请输入核心亮点',
  '研究题目': '请输入研究题目',
  '论文类型': '请输入论文类型',
  '年级水平': '请输入年级',
  '原文内容': '请粘贴原文内容'
};

export default {
  components: {
    FontAwesomeIcon
  },
  props: {
    templateContent: {
      type: String,
      default: ''
    },
    placeholderHints: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      contentSegments: [],
      activePlaceholderIndex: -1,
      cursorPosition: { segmentIndex: 0, offset: 0 },
      showVariableHint: false
    };
  },
  computed: {
    hasContent() {
      if (this.contentSegments.length === 0) return false;
      return this.contentSegments.some(segment => {
        if (segment.type === 'text') return segment.content.trim() !== '';
        if (segment.type === 'placeholder') return !segment.isHint && segment.content.trim() !== '';
        return false;
      });
    },
    fullText() {
      return this.contentSegments.map(segment => {
        if (segment.type === 'text') return segment.content;
        if (segment.type === 'placeholder') return segment.isHint ? '' : segment.content;
        return '';
      }).join('');
    }
  },
  watch: {
    templateContent(newVal) {
      if (newVal) {
        this.contentSegments = this.parseContentIntoSegments(newVal);
        this.$nextTick(() => {
          const firstPlaceholder = this.contentSegments.findIndex(seg => seg.type === 'placeholder');
          if (firstPlaceholder !== -1) {
            this.selectPlaceholder(firstPlaceholder);
            this.showVariableHint = true;
          }
        });
      } else {
        this.contentSegments = [];
      }
    }
  },
  methods: {
    getDefaultHintForKey(key) {
      if (this.placeholderHints && this.placeholderHints[key]) return this.placeholderHints[key];
      if (BUILTIN_PLACEHOLDER_HINTS[key]) return BUILTIN_PLACEHOLDER_HINTS[key];
      if (key.includes('/')) return '请输入' + key.replace('/', '或');
      return `请输入${key}`;
    },

    parseContentIntoSegments(content) {
      const segments = [];
      let lastIndex = 0;
      let match;

      while ((match = PLACEHOLDER_REGEX.exec(content)) !== null) {
        if (match.index > lastIndex) {
          segments.push({ type: 'text', content: content.substring(lastIndex, match.index) });
        }

        const key = match[1];
        segments.push({
          type: 'placeholder',
          original: key,
          content: key,
          defaultHint: this.getDefaultHintForKey(key),
          isHint: false
        });

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < content.length) {
        segments.push({ type: 'text', content: content.substring(lastIndex) });
      }

      return segments;
    },

    // ===== 新增：在 DOM 真正修改之前拦截危险的删除行为 =====
    handleBeforeInput(event) {
      const inputType = event.inputType || '';
      // 只关注删除类操作（包括 deleteContentBackward / deleteContentForward / deleteByCut / deleteByDrag 等）
      if (!inputType.startsWith('delete')) return;

      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      const range = sel.getRangeAt(0);

      // 检查 selection 是否与任何 placeholder 元素相交
      let preventedAny = false;
      for (let i = 0; i < this.contentSegments.length; i++) {
        const seg = this.contentSegments[i];
        if (seg.type !== 'placeholder') continue;
        const el = this.$el.querySelector(`.placeholder-segment[data-index="${i}"]`);
        if (!el) continue;
        try {

          if (range.intersectsNode && range.intersectsNode(el)) {
            // 阻止删除导致 DOM 移除
            event.preventDefault();
            preventedAny = true;

            // 将该占位符置为提示状态（浅色提示）
            seg.content = seg.defaultHint;
            seg.isHint = true;

            // 同步 DOM（并保留选区在该占位符）
            this.$nextTick(() => {
              this.syncPlaceholderDom(i);
              const el2 = this.$el.querySelector(`.placeholder-segment[data-index="${i}"]`);
              if (el2) {
                const newRange = document.createRange();
                newRange.selectNodeContents(el2);
                const s = window.getSelection();
                s.removeAllRanges();
                s.addRange(newRange);
              }
            });
          }
        } catch (e) {
          // 若某些环境不支持 intersectsNode，忽略，后续 input 会修复
        }
      }

      // 如果没有拦截到任何 placeholder，但可能跨节点删除（复杂情况）
      if (preventedAny) {
        return;
      }
    },

    handleEditorKeydown(event) {
      if (event.key === 'Tab') {
        event.preventDefault();
        if (this.activePlaceholderIndex === -1) {
          const firstIndex = this.contentSegments.findIndex(seg => seg.type === 'placeholder');
          if (firstIndex !== -1) this.selectPlaceholder(firstIndex);
        } else {
          this.navigatePlaceholders(event.shiftKey ? -1 : 1);
        }
      }
    },

    selectPlaceholder(index) {
      this.activePlaceholderIndex = index;
      this.$nextTick(() => {
        const placeholder = this.$el.querySelector(`.placeholder-segment[data-index="${index}"]`);
        if (placeholder) {
          placeholder.focus();
          const range = document.createRange();
          const selection = window.getSelection();
          range.selectNodeContents(placeholder);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      });
    },

    handlePlaceholderInput(index, event) {
      const rawText = (event.target.textContent || '');
      const segment = this.contentSegments[index];

      if (rawText.trim() === '') {
        segment.content = segment.defaultHint;
        segment.isHint = true;
        this.$nextTick(() => this.syncPlaceholderDom(index));
      } else {
        segment.content = rawText;
        segment.isHint = false;
        this.$nextTick(() => this.syncPlaceholderDom(index));
      }
    },

    handlePlaceholderCut(index, event) {
      // 拦截剪切，改为提示状态（防止 span 被移除）
      const segment = this.contentSegments[index];
      segment.content = segment.defaultHint;
      segment.isHint = true;
      this.$nextTick(() => {
        this.syncPlaceholderDom(index);
        const el = this.$el.querySelector(`.placeholder-segment[data-index="${index}"]`);
        if (el) {
          const range = document.createRange();
          range.selectNodeContents(el);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      });
    },

    handlePlaceholderKeydown(index, event) {
      // Tab 切换
      if (event.key === 'Tab') {
        event.preventDefault();
        this.navigatePlaceholders(event.shiftKey ? -1 : 1);
        return;
      }
      // 禁止 Enter 在占位符内换行
      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      // 拦截 Backspace/Delete 的部分情况（作为备用保护）
      if (event.key === 'Backspace' || event.key === 'Delete') {
        const target = event.target;
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0);
        const selectedText = range.toString();
        const nodeText = (target.textContent || '');

        // 如果选中等于或超过整个占位符内容 -> 变为提示并阻止默认删除
        if (selectedText.length >= nodeText.length && nodeText.trim() !== '') {
          event.preventDefault();
          const seg = this.contentSegments[index];
          seg.content = seg.defaultHint;
          seg.isHint = true;
          this.$nextTick(() => {
            this.syncPlaceholderDom(index);
            const el = this.$el.querySelector(`.placeholder-segment[data-index="${index}"]`);
            if (el) {
              const newRange = document.createRange();
              newRange.selectNodeContents(el);
              const s = window.getSelection();
              s.removeAllRanges();
              s.addRange(newRange);
            }
          });
        } else if (selectedText.length === 0 && nodeText.length <= 1) {
          // 光标在占位符中删除最后一字符 -> 转为提示
          event.preventDefault();
          const seg = this.contentSegments[index];
          seg.content = seg.defaultHint;
          seg.isHint = true;
          this.$nextTick(() => this.syncPlaceholderDom(index));
        }
      }
    },

    syncPlaceholderDom(index) {
      const seg = this.contentSegments[index];
      const el = this.$el.querySelector(`.placeholder-segment[data-index="${index}"]`);
      if (el) {
        el.textContent = seg.content;
        if (seg.isHint) el.classList.add('placeholder-hint-mode');
        else el.classList.remove('placeholder-hint-mode');
      } else {
        // 如果 DOM 消失了，强制 re-render（恢复为提示）
        seg.content = seg.defaultHint;
        seg.isHint = true;
        this.contentSegments = this.contentSegments.slice();
      }
    },

    navigatePlaceholders(direction) {
      if (this.contentSegments.length === 0) return;
      const placeholderIndices = this.contentSegments
        .map((seg, i) => seg.type === 'placeholder' ? i : -1)
        .filter(i => i !== -1);
      if (placeholderIndices.length === 0) return;
      let currentPos = placeholderIndices.indexOf(this.activePlaceholderIndex);
      if (currentPos === -1) currentPos = 0;
      let newPos;
      if (direction === 1) {
        newPos = (currentPos + 1) % placeholderIndices.length;
      } else {
        newPos = (currentPos - 1 + placeholderIndices.length) % placeholderIndices.length;
      }
      this.selectPlaceholder(placeholderIndices[newPos]);
    },

    handleEditorClick(event) {
      if (event.target.classList.contains('text-segment') || event.target === this.$refs.editor) {
        this.activePlaceholderIndex = -1;
      } else {
        const idx = event.target.getAttribute && event.target.getAttribute('data-index');
        if (idx !== null && idx !== undefined) {
          this.activePlaceholderIndex = Number(idx);
        }
      }
    },

    handleEditorInput() {
      // contentSegments 为空时，把纯文本写入
      if (this.contentSegments.length === 0) {
        const text = this.$refs.editor.innerText;
        if (text.trim() !== '') {
          this.contentSegments = [{ type: 'text', content: text }];
        }
      } else {
        // 检测占位符 DOM 是否被浏览器意外移除，若是则恢复为提示并 re-render
        let needRerender = false;
        for (let i = 0; i < this.contentSegments.length; i++) {
          const seg = this.contentSegments[i];
          if (seg.type === 'placeholder') {
            const dom = this.$el.querySelector(`.placeholder-segment[data-index="${i}"]`);
            if (!dom) {
              seg.content = seg.defaultHint;
              seg.isHint = true;
              needRerender = true;
            }
          }
        }
        if (needRerender) {
          this.contentSegments = this.contentSegments.slice();
        }
      }
    },

    handleSend() {
      this.$emit('send', this.fullText);
    }
  }
};
</script>

<style scoped>
.editor-container {
  margin: 20px auto;
  padding: 0 20px;
  position: relative;
}

.editor {
  min-height: 180px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.6;
  outline: none;
  transition: border-color 0.2s;
  white-space: pre-wrap;
}

.editor:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.placeholder-hint {
  color: #9ca3af;
  pointer-events: none;
}

.text-segment {
  color: #111827;
  background: transparent;
  white-space: pre-wrap;
  outline: none;
}

.placeholder-segment {
  display: inline-block;
  min-width: 40px;
  padding: 2px 6px;
  margin: 0 2px;
  border-radius: 4px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #1e40af;
  border: 1px solid #bfdbfe;
  cursor: text;
  transition: all 0.2s ease;
  outline: none;
}

/* 占位符提示状态（变浅） */
.placeholder-segment.placeholder-hint-mode,
.placeholder-segment.placeholder-hint-mode:empty {
  background: #f9fafb;
  /* 更淡背景 */
  color: #9ca3af;
  /* 浅灰文字 */
  border-color: #e5e7eb;
  box-shadow: none;
}

/* 激活状态的占位符 */
.placeholder-segment.active {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

/* 光标锚点（不可见） */
.cursor-anchor {
  position: relative;
  display: inline-block;
  width: 0;
  height: 1em;
}

.function-btns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
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
</style>
