/**
 * 模板数据服务
 */

/**
 * 模板类别定义
 */
export const TEMPLATE_CATEGORIES = {
  ALL: 'all',
  WORK: 'work',
  BUSINESS: 'business',
  STUDY: 'study',
  SOCIAL: 'social',
  LITERATURE: 'literature',
  REPLY: 'reply'
};

/**
 * 模板数据结构标准化
 */
export const templates = [
  {
    id: 'long-article',
    title: '长文写作',
    desc: '分步整生成大纲和文档',
    color: '#d9f5d6',
    icon: 'el-icon-document',
    content: '请帮我写一篇关于[主题]的长文，要求包含[字数]字，主要面向[目标读者]，文章风格要[文风要求]。',
    category: TEMPLATE_CATEGORIES.WORK,
    variables: ['主题', '字数', '目标读者', '文风要求']
  },
  {
    id: 'article',
    title: '文章',
    desc: '撰写各主流平台文章',
    color: '#d6eaf8',
    icon: 'el-icon-s-data',
    content: '请为我写一篇[平台类型]平台的文章，主题是[文章主题]，目标是[发布目的]，字数控制在[字数要求]以内。',
    category: TEMPLATE_CATEGORIES.WORK,
    variables: ['平台类型', '文章主题', '发布目的', '字数要求']
  },
  {
    id: 'summary-report',
    title: '总结汇报',
    desc: '凝练你的工作成效',
    color: '#fce4d6',
    icon: 'el-icon-notebook-2',
    content: '请帮我写一份[时间周期]的[汇报类型]，主要汇报[工作内容]的成果，重点突出[核心亮点]。',
    category: TEMPLATE_CATEGORIES.WORK,
    variables: ['时间周期', '汇报类型', '工作内容', '核心亮点']
  },
  {
    id: 'thesis',
    title: '论文',
    desc: '撰写专业详实的论文',
    color: '#e6dcf3',
    icon: 'el-icon-edit-outline',
    content: '请帮我写一篇[学科领域]的学术论文，研究主题是[研究题目]，论文类型为[论文类型]，字数要求[字数范围]。',
    category: TEMPLATE_CATEGORIES.STUDY,
    variables: ['学科领域', '研究题目', '论文类型', '字数范围']
  },
  {
    id: 'essay',
    title: '作文',
    desc: '专为学生打造满分作文',
    color: '#d9f5d6',
    icon: 'el-icon-edit',
    content: '请帮我写一篇[作文类型]作文，题目是「[作文题目]」，要求[字数]字，适合[年级水平]学生水平。',
    category: TEMPLATE_CATEGORIES.STUDY,
    variables: ['作文类型', '作文题目', '字数', '年级水平']
  },
  {
    id: 'promotion-copy',
    title: '宣传文案',
    desc: '撰写各平台的推广文案',
    color: '#d6eaf8',
    icon: 'el-icon-promotion',
    content: '请为[产品/服务名称]写一份[推广平台]的宣传文案，目标客户是[目标用户群体]，突出[核心卖点]。',
    category: TEMPLATE_CATEGORIES.BUSINESS,
    variables: ['产品/服务名称', '推广平台', '目标用户群体', '核心卖点']
  },
  {
    id: 'social-note',
    title: '社媒笔记',
    desc: '打造吸睛的笔记内容',
    color: '#fce4d6',
    icon: 'el-icon-message',
    content: '请帮我写一篇[平台名称]的种草笔记，主题是[笔记主题]，风格要[内容风格]，目标是[发布目的]。',
    category: TEMPLATE_CATEGORIES.SOCIAL,
    variables: ['平台名称', '笔记主题', '内容风格', '发布目的']
  },
  {
    id: 'polish',
    title: '润色',
    desc: '让文字表达更出彩',
    color: '#e6dcf3',
    icon: 'el-icon-color-setting',
    content: '请帮我润色以下[文本类型]，要求[润色方向]，保持[语言风格]：\n\n[原文内容]',
    category: TEMPLATE_CATEGORIES.REPLY,
    variables: ['文本类型', '润色方向', '语言风格', '原文内容']
  },
  {
    id: 'novel',
    title: '小说',
    desc: '创作引人入胜的小说',
    color: '#d9f5d6',
    icon: 'el-icon-menu-book',
    content: '请帮我写一篇[题材类型]小说，主角是[主角设定]，故事背景在[时空背景]，主要情节围绕[核心冲突]展开。',
    category: TEMPLATE_CATEGORIES.LITERATURE,
    variables: ['题材类型', '主角设定', '时空背景', '核心冲突']
  }
  // ... 其他模板省略，保持相同结构
];

/**
 * 模板服务类
 */
export class TemplateService {
  /**
   * 获取所有模板
   */
  static getAllTemplates() {
    return templates;
  }

  /**
   * 根据分类过滤模板
   */
  static getTemplatesByCategory(category) {
    if (category === TEMPLATE_CATEGORIES.ALL) {
      return templates;
    }
    return templates.filter(template => template.category === category);
  }

  /**
   * 根据ID获取模板
   */
  static getTemplateById(id) {
    return templates.find(template => template.id === id);
  }

  /**
   * 解析模板内容为片段
   */
  static parseTemplateContent(content) {
    const segments = [];
    const regex = /\[([^\]]+)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      // 添加占位符前的文本
      if (match.index > lastIndex) {
        segments.push({
          type: 'text',
          content: content.substring(lastIndex, match.index)
        });
      }

      // 添加占位符
      segments.push({
        type: 'placeholder',
        content: match[1]
      });

      lastIndex = match.index + match[0].length;
    }

    // 添加剩余文本
    if (lastIndex < content.length) {
      segments.push({
        type: 'text',
        content: content.substring(lastIndex)
      });
    }

    return segments;
  }

  /**
   * 提取模板中的变量
   */
  static extractVariablesFromContent(content) {
    const variables = [];
    const regex = /\[([^\]]+)\]/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      variables.push({
        name: match[1],
        placeholder: match[0],
        start: match.index,
        end: match.index + match[0].length
      });
    }

    return variables;
  }
}

export default TemplateService;