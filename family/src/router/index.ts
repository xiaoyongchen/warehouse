import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const VUE_APP_MODE = process.env.VUE_APP_MODE
const VUE_APP_PUBLIC_PATH = process.env.VUE_APP_PUBLIC_PATH

const ROUTE_MODES = {
  HISTORY: 'history',
  HASH: 'hash'
}

const routes = [
  /**
   * 默认
   */
  {
    path: '/',
    component: () => import('@/views/index.vue')
  },
]

const router = createRouter({
  history: VUE_APP_MODE === ROUTE_MODES.HISTORY ? createWebHistory(VUE_APP_PUBLIC_PATH) : createWebHashHistory(),
  routes: routes
})

export default router
