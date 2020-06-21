import Vue from 'vue'
import App from './index.vue'

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
function createApp () {
  return new Vue({
    // 根实例简单的渲染应用程序组件。
    render: h => h(App)
  })
}

// 这里假定 App.vue 模板中根元素具有 `id="app"`
if (typeof window !== 'undefined') {
  // 客户端特定引导逻辑……
  const app = createApp()
  app.$mount('#app')
}

export default createApp
