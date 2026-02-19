<script setup>
import { ref } from 'vue'
import { Search, PlusCircle, Bell, User, LogOut, Sun, Moon } from 'lucide-vue-next'

const showProfileMenu = ref(false)
const isDark = ref(document.documentElement.classList.contains('dark'))

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}
</script>

<template>
  <header class="h-16 bg-surface border-b border-border flex items-center justify-between px-8 sticky top-0 z-30 transition-colors duration-300">
    <div class="flex-1 max-w-xl">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" :size="18" />
        <input 
          type="text" 
          placeholder="Rechercher des projets, développeurs ou compétences..." 
          class="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text placeholder:text-text-muted transition-colors"
        />
      </div>
    </div>

    <div class="flex items-center gap-4">
      <!-- Theme Toggle -->
      <button 
        @click="toggleTheme"
        class="p-2 text-text-muted hover:bg-primary/5 rounded-full transition-colors"
        aria-label="Toggle theme"
      >
        <Sun v-if="isDark" :size="20" />
        <Moon v-else :size="20" />
      </button>

      <router-link to="/publish" class="hidden sm:flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-md shadow-primary/10">
        <PlusCircle :size="18" />
        Publier
      </router-link>

      <button class="p-2 text-text-muted hover:bg-primary/5 rounded-full relative transition-colors">
        <Bell :size="20" />
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-border"></span>
      </button>

      <div class="w-px h-6 bg-border mx-2"></div>

      <div class="relative">
        <button 
          @click="showProfileMenu = !showProfileMenu"
          class="flex items-center gap-3 p-1 rounded-full hover:bg-primary/5 transition-colors"
        >
          <div class="text-right hidden sm:block">
            <p class="text-xs font-bold text-text leading-tight">Marcus Thorne</p>
            <p class="text-[10px] text-text-muted font-medium">Développeur Senior</p>
          </div>
          <img src="https://picsum.photos/seed/marcus/100/100" class="w-9 h-9 rounded-full border-2 border-primary/20" alt="Avatar" />
        </button>
        
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div v-if="showProfileMenu" class="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-xl border border-border p-2 z-50">
            <router-link to="/profile" class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text hover:bg-primary/5 transition-colors">
              <User :size="16" /> Mon Profil
            </router-link>
            <button class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/5 transition-colors">
              <LogOut :size="16" /> Déconnexion
            </button>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>
