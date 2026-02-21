import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from './store/auth'
import Dashboard from './views/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./views/Register.vue'),
    meta: { guest: true }
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
    path: '/talent/:id',
    name: 'TalentProfile',
    component: () => import('./views/TalentProfile.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'SuperAdmin',
    component: () => import('./views/SuperAdmin.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/publish',
    name: 'Publish',
    component: () => import('./views/Publish.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: () => import('./views/ProjectDetail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuth()
  if (to.meta.requiresAuth && !auth.state.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAdmin && auth.state.user?.role !== 'superadmin') {
    next('/')
  } else if (to.meta.guest && auth.state.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
