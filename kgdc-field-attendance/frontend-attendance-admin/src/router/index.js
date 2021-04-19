import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/users',
    component: () => import('../views/Users.vue')
  },
  {
    path: '/register',
    component: () => import('../views/AttendanceRegister.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
