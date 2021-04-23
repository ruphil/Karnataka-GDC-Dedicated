import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../views/LoginScreen.vue')
  },
  {
    path: '/mainscreen',
    component: () => import('../views/MainScreen.vue')
  },
  {
    path: '/register',
    component: () => import('../views/RegisterScreen.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
