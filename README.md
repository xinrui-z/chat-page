## 项目介绍

本项目包含一个核心组件 WritingAssistant（路径：`src/components/WritingAssistant.vue`），实现了类似豆包"帮我写作"的功能模块，主要特点包括：

- 多样化写作场景模板（文章、总结、文案、小说等 24 种类型）
- 智能样例填充与变量高亮（`[ ]` 包裹的可修改内容）
- 分类筛选系统（工作 / 商业 / 学习 / 社媒等多维度分类）
- 响应式设计，适配电脑、平板和手机设备
- 直观的交互体验（卡片 hover 预览、一键填充、即时编辑）

## 核心功能

- **模板快速填充**：点击对应场景卡片，自动将样例模板填入编辑区
- **变量高亮提示**：可修改内容以黄色背景高亮显示，清晰区分编辑区域
- **分类筛选**：通过顶部标签快速筛选不同类别的写作场景
- **样例预览**：鼠标悬停卡片时显示完整样例，无需点击即可查看详情
- **一键提交**：编辑完成后点击发送按钮提交创作需求

## 技术依赖

- Vue 3 + Vite
- TypeScript
- Font Awesome 图标库


## 项目设置

```sh
# 安装依赖
pnpm install

# 安装额外依赖（图标库）
pnpm install @fortawesome/vue-fontawesome @fortawesome/free-solid-svg-icons
pnpm install element-ui
```

## 开发环境编译与热重载

```sh
npm run dev
```