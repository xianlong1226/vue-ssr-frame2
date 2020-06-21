import Vue from 'vue'
import Router from 'vue-router'
import router1 from 'components/router1.vue'
import router2 from 'components/router2.vue'

Vue.use(Router)

export function createRouter () {
  return new Router({
    routes: [
      // { path: '/router1', component: () => import('components/router1.vue') },
      // { path: '/router2', component: () => import('components/router2.vue') }
      { path: '/router1', component: router1 },
      { path: '/router2', component: router2 }
    ]
  })
}