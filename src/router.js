import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './views/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/jobs',
    name: 'Jobs',
    component: () => import('./views/JobBoard.vue')
  },
  {
    path: '/talents',
    name: 'Talents',
    component: () => import('./views/TalentDiscovery.vue')
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('./views/Messages.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/Profile.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
