import { createRouter, createWebHistory } from 'vue-router'
// 导入WritePage组件
import WritePage from '../WritePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'write',
      component: WritePage,
      meta: {
        title: 'MagiQ - 帮我写作'
      }
    },
    // 可以添加其他路由配置
    {
      path: '/new-chat',
      name: 'newChat',
      component: WritePage,
      meta: {
        title: 'MagiQ - 新对话'
      }
    },
    {
      path: '/ai-search',
      name: 'aiSearch',
      component: WritePage,
      meta: {
        title: 'MagiQ - AI搜索'
      }
    },
    {
      path: '/ai-code',
      name: 'aiCode',
      component: WritePage,
      meta: {
        title: 'MagiQ - AI编程'
      }
    },
    {
      path: '/image-generate',
      name: 'imageGenerate',
      component: WritePage,
      meta: {
        title: 'MagiQ - 图像生成'
      }
    },
    // 404页面路由
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

// 路由守卫：设置页面标题
router.beforeEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
})

export default router
    