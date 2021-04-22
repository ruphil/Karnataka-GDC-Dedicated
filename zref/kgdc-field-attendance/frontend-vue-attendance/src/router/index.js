import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/android/LoginScreen.vue')
  },
  {
    path: '/mainscreen',
    component: () => import('../views/android/MainScreen.vue')
  },
  {
    path: '/register',
    component: () => import('../views/android/RegisterScreen.vue')
  },
  {
    path: '/admin',
    component: () => import('../views/admin/Login.vue')
  },
  {
    path: '/users',
    component: () => import('../views/admin/Users.vue')
  },
  {
    path: '/attendanceregister',
    component: () => import('../views/admin/AttendanceRegister.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
