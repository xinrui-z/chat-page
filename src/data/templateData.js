export default [
  {
    title: '长文写作', desc: '分步整生成大纲和文档', color: '#d9f5d6', icon: 'el-icon-document',
    content: '请帮我写一篇关于[主题]的长文，要求包含[字数]字，主要面向[目标读者]，文章风格要[文风要求]。',
    placeholderHints: { '主题': '请输入主题', '字数': '请输入字数', '目标读者': '请输入目标读者', '文风要求': '请输入文风' },
    category: 'work'
  },
  {
    title: '文章', desc: '撰写各主流平台文章', color: '#d6eaf8', icon: 'el-icon-s-data',
    content: '请为我写一篇[平台类型]平台的文章，主题是[文章主题]，目标是[发布目的]，字数控制在[字数要求]以内。',
    placeholderHints: { '平台类型': '请输入平台', '文章主题': '请输入主题', '发布目的': '请输入目的', '字数要求': '请输入字数' },
    category: 'work'
  },
  { title: '总结汇报', desc: '凝练你的工作成效', color: '#fce4d6', icon: 'el-icon-notebook-2', content: '请帮我写一份[时间周期]的[汇报类型]，主要汇报[工作内容]的成果，重点突出[核心亮点]。', category: 'work' },
  { title: '论文', desc: '撰写专业详实的论文', color: '#e6dcf3', icon: 'el-icon-edit-outline', content: '请帮我写一篇[学科领域]的学术论文，研究主题是[研究题目]，论文类型为[论文类型]，字数要求[字数范围]。', category: 'study' },
  { title: '作文', desc: '专为学生打造满分作文', color: '#d9f5d6', icon: 'el-icon-edit', content: '请帮我写一篇[作文类型]作文，题目是「[作文题目]」，要求[字数]字，适合[年级水平]学生水平。', category: 'study' },
  { title: '宣传文案', desc: '撰写各平台的推广文案', color: '#d6eaf8', icon: 'el-icon-promotion', content: '请为[产品/服务名称]写一份[推广平台]的宣传文案，目标客户是[目标用户群体]，突出[核心卖点]。', category: 'business' },
  { title: '社媒笔记', desc: '打造吸睛的笔记内容', color: '#fce4d6', icon: 'el-icon-message', content: '请帮我写一篇[平台名称]的种草笔记，主题是[笔记主题]，风格要[内容风格]，目标是[发布目的]。', category: 'social' },
  { title: '润色', desc: '让文字表达更出彩', color: '#e6dcf3', icon: 'el-icon-color-setting', content: '请帮我润色以下[文本类型]，要求[润色方向]，保持[语言风格]：\n\n[原文内容]', category: 'reply' },
  { title: '小说', desc: '创作引人入胜的小说', color: '#d9f5d6', icon: 'el-icon-menu-book', content: '请帮我写一篇[题材类型]小说，主角是[主角设定]，故事背景在[时空背景]，主要情节围绕[核心冲突]展开。', category: 'literature' },
  { title: '话术', desc: '满足不同场景表达需求', color: '#d6eaf8', icon: 'el-icon-chat-dot-round', content: '请为我准备[应用场景]的话术，对象是[沟通对象]，目标是[沟通目的]，语气要[语言风格]。', category: 'work' },
  { title: '研究报告', desc: '深度研究，精准分析', color: '#fce4d6', icon: 'el-icon-files', content: '请帮我写一份关于[研究主题]的研究报告，重点分析[分析维度]，面向[目标读者]，报告长度约[字数要求]。', category: 'work' },
  { title: '心得体会', desc: '助你提炼归纳所感所悟', color: '#e6dcf3', icon: 'el-icon-star-on', content: '请帮我写一篇关于[体验主题]的心得体会，重点分享[核心收获]，适合[分享场合]的语言风格。', category: 'work' },
  { title: '思想汇报', desc: '进行反思梳理深入总结', color: '#d9f5d6', icon: 'el-icon-notebook-1', content: '请帮我写一份[时间周期]的思想汇报，主要围绕[汇报主题]，体现[思想变化]，字数控制在[字数要求]。', category: 'work' },
  { title: '诗歌', desc: '创作动人心弦的诗篇', color: '#d6eaf8', icon: 'el-icon-paperclip', content: '请创作一首[诗歌体裁]，主题是[诗歌主题]，表达[情感基调]，风格偏向[诗歌风格]。', category: 'literature' },
  { title: '朋友圈', desc: '精心设计的朋友圈文案', color: '#fce4d6', icon: 'el-icon-share', content: '请帮我写一条朋友圈文案，分享[分享内容]，风格要[文案风格]，希望获得[期望反应]。', category: 'social' },
  { title: '微博', desc: '撰写吸引眼球的微博', color: '#e6dcf3', icon: 'el-icon-s-promotion', content: '请帮我写一条微博，内容关于[微博主题]，加上[相关话题]话题标签，风格要[内容风格]。', category: 'social' },
  { title: '故事', desc: '编织触动心灵的故事', color: '#d9f5d6', icon: 'el-icon-user', content: '请创作一个[故事类型]故事，主人公是[角色设定]，故事发生在[时空设定]，想要传达[故事寓意]。', category: 'literature' },
  { title: '方案策划', desc: '量身定制各种方案', color: '#d6eaf8', icon: 'el-icon-s-order', content: '请帮我制定一个[方案类型]方案，项目是[项目名称]，目标是[预期目标]，时间节点为[时间安排]。', category: 'business' }
];
