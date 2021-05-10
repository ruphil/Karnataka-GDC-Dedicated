import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../controllerviews/BlankHome.vue')
  },
  {
    path: '/markedvillages',
    component: () => import('../controllerviews/MarkedVillages.vue')
  },
  {
    path: '/missionplan',
    component: () => import('../controllerviews/MissionPlanner.vue')
  },
  {
    path: '/flights',
    component: () => import('../controllerviews/FlightsManager.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
