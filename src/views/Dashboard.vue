<script setup>
import { onMounted, ref } from 'vue'
import { TrendingUp, Users, Briefcase, Calendar } from 'lucide-vue-next'
import { useAuth } from '../store/auth'
import { fetchProjects } from '../api'

const auth = useAuth()
const recentProjects = ref([])

const stats = [
  { label: 'Vues de Profil', value: '0', change: '0%', icon: Users },
  { label: 'Offres Appliquées', value: '0', change: '0', icon: Briefcase },
  { label: 'Projets Publiés', value: '0', change: '0', icon: TrendingUp },
  { label: 'Entretiens', value: '0', change: '0', icon: Calendar },
]

onMounted(async () => {
  try {
    recentProjects.value = await fetchProjects()
    // Limit to 4 for dashboard
    recentProjects.value = recentProjects.value.slice(0, 4)
  } catch (error) {
    console.error('Erreur chargement projets:', error)
  }
})
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-2xl font-black text-text tracking-tight mb-1">Bienvenue, {{ auth.state.user?.name.split(' ')[0] || 'Développeur' }} ! 👋</h2>
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
        <div v-if="recentProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="project in recentProjects" 
            :key="project._id"
            class="bg-surface rounded-2xl border border-primary/10 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all group"
          >
            <div class="relative h-48 overflow-hidden">
              <img :src="project.image || 'https://ui-avatars.com/api/?name=D&background=ff6b6b&color=fff&size=200'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Project" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <router-link :to="`/projects/${project._id}`" class="bg-white text-black text-xs font-bold px-4 py-2 rounded-lg hover:scale-105 transition-transform">Voir le projet</router-link>
              </div>
            </div>
            <div class="p-4">
              <h4 class="font-bold text-text mb-1">{{ project.title }}</h4>
              <p class="text-xs text-text-muted mb-3">Par {{ project.author?.name || 'Inconnu' }}</p>
              <div class="flex gap-2">
                <span v-for="tag in project.tags" :key="tag" class="text-[10px] font-bold px-2 py-1 rounded-md bg-primary/10 text-primary">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="bg-surface rounded-3xl border-2 border-dashed border-border p-12 text-center">
          <div class="p-4 bg-primary/5 rounded-full w-fit mx-auto mb-4">
            <TrendingUp class="text-primary" :size="32" />
          </div>
          <h4 class="text-lg font-black text-text mb-2">Aucun projet publié</h4>
          <p class="text-sm text-text-muted mb-6">Commencez par partager votre premier projet avec la communauté.</p>
          <router-link to="/publish" class="inline-block bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all outline-none text-center">Publier un projet</router-link>
        </div>
      </div>

      <!-- Sidebar Content (Activity, etc.) -->
      <div class="space-y-6">
        <h3 class="text-xl font-bold text-text">Activité Récente</h3>
        <div class="bg-surface rounded-2xl border border-primary/10 p-6 space-y-6 text-center py-12">
          <p class="text-sm text-text-muted italic">Aucune activité récente pour le moment.</p>
        </div>
      </div>
    </div>
  </div>
</template>
