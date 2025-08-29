import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'

import { 
  faMicrophone,    
  faUpLong,
} from '@fortawesome/free-solid-svg-icons'

// 导入 Vue 组件
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 将图标添加到库中
library.add(faMicrophone,faUpLong)

const app = createApp(App)

// 全局注册 FontAwesomeIcon 组件
app.component('FontAwesomeIcon', FontAwesomeIcon)

app.use(router)
app.mount('#app')