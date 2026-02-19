<script setup>
import { TrendingUp, Users, Briefcase, Calendar } from 'lucide-vue-next'

const stats = [
  { label: 'Vues de Profil', value: '1,284', change: '+12%', icon: Users },
  { label: 'Offres Appliquées', value: '42', change: '+5', icon: Briefcase },
  { label: 'Projets Publiés', value: '8', change: '0', icon: TrendingUp },
  { label: 'Entretiens', value: '3', change: '+1', icon: Calendar },
]

const recentProjects = [
  { id: 1, name: 'AI Dashboard', author: 'Sophie Laurent', tags: ['React', 'Tailwind'], img: 'https://picsum.photos/seed/p1/400/250' },
  { id: 2, name: 'Crypto Wallet', author: 'Alex Rivière', tags: ['Vue', 'D3.js'], img: 'https://picsum.photos/seed/p2/400/250' },
  { id: 3, name: 'Social App UI', author: 'Thomas Bernard', tags: ['Flutter', 'Firebase'], img: 'https://picsum.photos/seed/p3/400/250' },
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-2xl font-black text-text tracking-tight mb-1">Bienvenue, Marcus ! 👋</h2>
      <p class="text-text-muted font-medium">Voici ce qui se passe sur votre profil aujourd'hui.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div 
        v-for="stat in stats" 
        :key="stat.label"
        class="bg-surface p-6 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all group"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
            <component :is="stat.icon" :size="24" />
          </div>
          <span class="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
            {{ stat.change }}
          </span>
        </div>
        <p class="text-2xl font-black text-text">{{ stat.value }}</p>
        <p class="text-xs font-bold text-text-muted uppercase tracking-wider">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Projects -->
      <div class="lg:col-span-2 space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-text">Projets Récents</h3>
          <button class="text-sm font-bold text-primary hover:underline">Voir tout</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="project in recentProjects" 
            :key="project.id"
            class="bg-surface rounded-2xl border border-primary/10 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all group"
          >
            <div class="relative h-48 overflow-hidden">
              <img :src="project.img" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Project" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <button class="bg-white text-black text-xs font-bold px-4 py-2 rounded-lg">Voir le projet</button>
              </div>
            </div>
            <div class="p-4">
              <h4 class="font-bold text-text mb-1">{{ project.name }}</h4>
              <p class="text-xs text-text-muted mb-3">Par {{ project.author }}</p>
              <div class="flex gap-2">
                <span v-for="tag in project.tags" :key="tag" class="text-[10px] font-bold px-2 py-1 rounded-md bg-primary/10 text-primary">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Content (Activity, etc.) -->
      <div class="space-y-6">
        <h3 class="text-xl font-bold text-text">Activité Récente</h3>
        <div class="bg-surface rounded-2xl border border-primary/10 p-6 space-y-6">
          <div v-for="i in 3" :key="i" class="flex gap-4">
            <div class="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
              <Users :size="18" class="text-primary" />
            </div>
            <div>
              <p class="text-sm font-bold text-text">Nouveau talent !</p>
              <p class="text-xs text-text-muted">Sophie Laurent a publié un nouveau projet.</p>
              <p class="text-[10px] text-text-muted mt-1 uppercase">Il y a 2h</p>
            </div>
          </div>
          <button class="w-full py-3 bg-primary/10 text-primary font-bold rounded-xl text-sm hover:bg-primary hover:text-white transition-all">
            Tout marquer comme lu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
