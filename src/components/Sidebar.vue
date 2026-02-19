<script setup>
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  MessageSquare, 
  User,
  Settings,
  HelpCircle,
  FolderOpen
} from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const route = useRoute()

const navLinks = [
  { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/jobs', icon: Briefcase, label: "Offres d'emploi" },
  { to: '/talents', icon: Users, label: 'Trouver des talents' },
  { to: '/messages', icon: MessageSquare, label: 'Messagerie' },
  { to: '/profile', icon: User, label: 'Mon Profil' },
]

const helpLinks = [
  { to: '/settings', icon: Settings, label: 'Paramètres' },
  { to: '/support', icon: HelpCircle, label: 'Support' },
]
</script>

<template>
  <aside class="w-64 bg-surface border-r border-border hidden lg:flex flex-col fixed h-full z-40 transition-colors duration-300">
    <div class="p-6">
      <router-link to="/" class="flex items-center gap-2 text-primary">
        <div class="bg-primary text-white p-1.5 rounded-lg">
          <FolderOpen :size="24" :stroke-width="3" />
        </div>
        <span class="text-xl font-black tracking-tight text-text">DevConnect</span>
      </router-link>
    </div>

    <nav class="flex-1 px-4 py-4 space-y-1">
      <router-link 
        v-for="link in navLinks" 
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group"
        :class="route.path === link.to ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-primary/5 hover:text-primary'"
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
