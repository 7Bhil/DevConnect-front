<script setup>
import { ref, computed } from 'vue'
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  User,
  Settings,
  HelpCircle,
  FolderOpen,
  ShieldAlert,
  Menu,
  X,
  ChevronLeft
} from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useAuth } from '../store/auth'

const route = useRoute()
const auth = useAuth()
const showMobileSidebar = ref(false)
const showDesktopSidebar = ref(true) // Toujours visible par défaut sur desktop

const navLinks = computed(() => {
  const baseLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/jobs', icon: Briefcase, label: "Offres d'emploi" },
    { to: '/talents', icon: Users, label: 'Trouver des talents' },
  ]
  
  if (auth.state.isAuthenticated) {
    baseLinks.push(
      { to: '/projects', icon: FolderOpen, label: 'Mes Projets' },
      { to: '/profile', icon: User, label: 'Mon Profil' }
    )
  }

  if (auth.state.user?.role === 'superadmin') {
    baseLinks.push({ to: '/admin', icon: ShieldAlert, label: 'Admin Dashboard' })
  }
  
  return baseLinks
})

const helpLinks = [
  { to: '/settings', icon: Settings, label: 'Paramètres' },
  { to: '/support', icon: HelpCircle, label: 'Support' },
]
</script>

<template>
  <!-- Mobile Menu Button -->
  <button 
    @click="showMobileSidebar = !showMobileSidebar"
    class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface border border-border rounded-xl shadow-lg"
  >
    <Menu :size="20" class="text-text" />
  </button>

  <!-- Desktop Sidebar Toggle Button -->
  <button 
    v-if="!showDesktopSidebar"
    @click="showDesktopSidebar = true"
    class="hidden lg:flex fixed top-4 left-4 z-50 p-2 bg-surface border border-border rounded-xl shadow-lg items-center gap-2"
    title="Afficher la sidebar"
  >
    <Menu :size="20" class="text-text" />
  </button>

  <!-- Mobile Sidebar Overlay -->
  <div 
    v-if="showMobileSidebar"
    @click="showMobileSidebar = false"
    class="fixed inset-0 bg-black/50 z-40 lg:hidden"
  ></div>

  <!-- Sidebar -->
  <aside class="w-64 bg-surface border-r border-border flex-col fixed h-full z-50 transition-colors duration-300"
        :class="[
          showMobileSidebar ? 'translate-x-0 flex' : '-translate-x-full hidden',
          showDesktopSidebar ? 'lg:translate-x-0 lg:flex' : 'lg:-translate-x-full lg:hidden'
        ]">
    <div class="p-6">
      <div class="flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2 text-primary" @click="showMobileSidebar = false">
          <div class="bg-primary text-white p-1.5 rounded-lg">
            <FolderOpen :size="24" :stroke-width="3" />
          </div>
          <span class="text-xl font-black tracking-tight text-text">DevConnect</span>
        </router-link>
        <div class="flex items-center gap-2">
          <!-- Bouton pour masquer/afficher sur desktop -->
          <button 
            @click="showDesktopSidebar = !showDesktopSidebar"
            class="hidden lg:flex p-1 rounded-lg hover:bg-primary/5 transition-colors"
            :title="showDesktopSidebar ? 'Masquer la sidebar' : 'Afficher la sidebar'"
          >
            <ChevronLeft :size="16" class="text-text-muted" />
          </button>
          <button 
            @click="showMobileSidebar = false"
            class="lg:hidden p-1 rounded-lg hover:bg-primary/5 transition-colors"
          >
            <X :size="20" class="text-text-muted" />
          </button>
        </div>
      </div>
    </div>

    <nav class="flex-1 px-4 py-4 space-y-1">
      <router-link 
        v-for="link in navLinks" 
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group"
        :class="route.path === link.to ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-primary/5 hover:text-primary'"
        @click="showMobileSidebar = false"
      >
        <component :is="link.icon" :size="20" />
        <span class="font-semibold text-sm">{{ link.label }}</span>
      </router-link>
    </nav>

    <div class="px-4 py-8 border-t border-border space-y-1">
      <div class="px-4 mb-4">
        <span class="text-[10px] font-bold text-text-muted uppercase tracking-widest">Paramètres & Aide</span>
      </div>
      
      <router-link 
        v-for="link in helpLinks" 
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-text-muted hover:bg-primary/5 hover:text-primary"
        @click="showMobileSidebar = false"
      >
        <component :is="link.icon" :size="20" />
        <span class="font-semibold text-sm">{{ link.label }}</span>
      </router-link>
      
      <div class="mt-8 p-4 bg-primary/5 rounded-2xl relative overflow-hidden group border border-border">
         <div class="relative z-10">
           <h4 class="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Passer en Pro</h4>
           <p class="text-[10px] text-text-muted mb-3 leading-relaxed">Accédez à des filtres avancés et des offres premium.</p>
           <button class="w-full bg-primary text-white py-2 rounded-lg text-xs font-bold hover:scale-105 transition-all">Commencer</button>
         </div>
         <div class="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/10 rounded-full group-hover:scale-125 transition-transform"></div>
      </div>
    </div>
  </aside>
</template>
