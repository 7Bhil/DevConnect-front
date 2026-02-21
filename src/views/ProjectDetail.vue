<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Github, 
  ExternalLink, 
  Calendar, 
  User,
  Tag,
  Rocket
} from 'lucide-vue-next'
import { fetchProjectById } from '../api'

const route = useRoute()
const router = useRouter()
const project = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    project.value = await fetchProjectById(route.params.id)
  } catch (error) {
    console.error('Erreur chargement projet:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <button @click="router.back()" class="flex items-center gap-2 text-text-muted hover:text-primary transition-colors group">
      <ArrowLeft :size="20" class="group-hover:-translate-x-1 transition-transform" />
      <span class="font-bold text-sm uppercase tracking-widest">Retour</span>
    </button>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>

    <div v-else-if="project" class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-8">
        <div class="aspect-video w-full rounded-3xl overflow-hidden border border-border shadow-2xl relative group">
          <img :src="project.image || 'https://ui-avatars.com/api/?name=P&background=4ecdc4&color=fff&size=200'" class="w-full h-full object-cover" alt="" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <div class="space-y-6">
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in project.tags" :key="tag" class="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-wider">
              {{ tag }}
            </span>
          </div>

          <h1 class="text-4xl font-black text-text tracking-tight">{{ project.title }}</h1>
          
          <p class="text-lg text-text-muted leading-relaxed font-medium">
            {{ project.description }}
          </p>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-8">
        <div class="bg-surface rounded-3xl p-8 border border-border shadow-sm space-y-8">
          <div class="space-y-4">
            <p class="text-[10px] font-black text-text-muted uppercase tracking-widest">Publié par</p>
            <div class="flex items-center gap-4">
              <img :src="project.author?.avatar" class="w-12 h-12 rounded-2xl object-cover border-2 border-primary/10" alt="" />
              <div>
                <p class="font-bold text-text">{{ project.author?.name }}</p>
                <p class="text-xs text-text-muted font-bold capitalize">{{ project.author?.role }}</p>
              </div>
            </div>
          </div>

          <div class="space-y-4 pt-8 border-t border-border">
            <p class="text-[10px] font-black text-text-muted uppercase tracking-widest">Détails</p>
            <div class="space-y-4">
              <div class="flex items-center gap-3 text-text-muted">
                <Calendar :size="18" />
                <span class="text-sm font-bold">{{ new Date(project.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
              </div>
              <div v-if="project.githubUrl" class="flex items-center gap-3 text-text-muted">
                <Github :size="18" />
                <a :href="project.githubUrl" target="_blank" class="text-sm font-bold hover:text-primary transition-colors">GitHub Repository</a>
              </div>
              <div v-if="project.demoUrl" class="flex items-center gap-3 text-text-muted">
                <ExternalLink :size="18" />
                <a :href="project.demoUrl" target="_blank" class="text-sm font-bold hover:text-primary transition-colors">Live Demo</a>
              </div>
            </div>
          </div>

          <div class="pt-8 border-t border-border">
            <button class="w-full py-4 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20">
              <Rocket :size="20" /> Intéressé par ce projet ?
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <h2 class="text-2xl font-black text-text">Projet introuvable</h2>
      <p class="text-text-muted mb-8">Désolé, nous ne parvenons pas à charger les détails de ce projet.</p>
      <button @click="router.push('/')" class="bg-primary text-white px-8 py-3 rounded-2xl font-black">Retour au Dashboard</button>
    </div>
  </div>
</template>
