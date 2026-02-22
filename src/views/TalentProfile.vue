<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MapPin, Mail, User, Calendar, Briefcase, Award, Github, Linkedin, Twitter, Globe, ArrowLeft } from 'lucide-vue-next'
import { getUserById, fetchProjects } from '../api'
import { useAuth } from '../store/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuth()

const talent = ref(null)
const loading = ref(true)
const error = ref('')
const projects = ref([])
const projectsLoading = ref(false)

const talentId = computed(() => route.params.id)

const loadTalent = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await getUserById(talentId.value)
    talent.value = response.user
    
    // Charger les projets du talent
    await loadTalentProjects()
  } catch (err) {
    console.error('Error loading talent:', err)
    error.value = 'Talent non trouvé'
  } finally {
    loading.value = false
  }
}

const loadTalentProjects = async () => {
  if (!talent.value) return
  
  try {
    projectsLoading.value = true
    const allProjects = await fetchProjects()
    // Filtrer les projets de ce talent
    projects.value = allProjects.filter(project => 
      project.author && project.author._id === talent.value._id
    )
  } catch (err) {
    console.error('Error loading talent projects:', err)
  } finally {
    projectsLoading.value = false
  }
}

const goBack = () => {
  router.go(-1)
}

onMounted(loadTalent)
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-surface border-b border-border">
      <div class="max-w-6xl mx-auto px-8 py-6">
        <button 
          @click="goBack"
          class="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft :size="20" />
          Retour
        </button>
        
        <div v-if="loading" class="animate-pulse">
          <div class="h-8 bg-background rounded w-64 mb-2"></div>
          <div class="h-4 bg-background rounded w-48"></div>
        </div>
        
        <div v-else-if="error" class="text-center py-20">
          <User :size="48" class="text-text-muted mx-auto mb-4" />
          <h2 class="text-xl font-black text-text mb-2">{{ error }}</h2>
          <button @click="goBack" class="text-primary hover:text-primary/80">
            Retour à la découverte
          </button>
        </div>
        
        <div v-else class="flex flex-col md:flex-row items-start gap-8">
          <!-- Avatar -->
          <div class="shrink-0">
            <div class="w-32 h-32 rounded-3xl overflow-hidden border-4 border-background ring-4 ring-border">
              <img :src="talent.avatar" class="w-full h-full object-cover" alt="" />
            </div>
            <div v-if="talent.isAvailable" class="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-sm">
              <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Disponible
            </div>
          </div>
          
          <!-- Info -->
          <div class="flex-1">
            <h1 class="text-3xl font-black text-text mb-2">{{ talent.name }}</h1>
            <p class="text-lg text-primary font-bold mb-4">{{ talent.role }}</p>
            
            <div class="flex flex-wrap gap-4 text-sm text-text-muted mb-6">
              <div v-if="talent.location" class="flex items-center gap-1">
                <MapPin :size="16" />
                {{ talent.location }}
              </div>
              <div class="flex items-center gap-1">
                <Calendar :size="16" />
                Inscrit {{ new Date(talent.createdAt).toLocaleDateString('fr-FR') }}
              </div>
              <div class="flex items-center gap-1">
                <Briefcase :size="16" />
                {{ talent.projectsCount || 0 }} projet{{ talent.projectsCount > 1 ? 's' : '' }}
              </div>
              <div class="flex items-center gap-1">
                <Award :size="16" />
                {{ talent.followersCount || 0 }} abonné{{ talent.followersCount > 1 ? 's' : '' }}
              </div>
            </div>
            
            <!-- Bio -->
            <div v-if="talent.bio" class="mb-8">
              <h3 class="text-lg font-black text-text mb-3">À propos</h3>
              <p class="text-text-muted leading-relaxed">{{ talent.bio }}</p>
            </div>
            
            <!-- Skills -->
            <div v-if="talent.skills && talent.skills.length > 0" class="mb-8">
              <h3 class="text-lg font-black text-text mb-3">Compétences</h3>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="skill in talent.skills" 
                  :key="skill"
                  class="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-black"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
            
            <!-- Social Links -->
            <div class="mb-8">
              <h3 class="text-lg font-black text-text mb-3">Réseaux</h3>
              <div class="flex gap-3">
                <button class="p-3 bg-background border border-border rounded-xl hover:border-primary transition-colors">
                  <Github :size="20" />
                </button>
                <button class="p-3 bg-background border border-border rounded-xl hover:border-primary transition-colors">
                  <Linkedin :size="20" />
                </button>
                <button class="p-3 bg-background border border-border rounded-xl hover:border-primary transition-colors">
                  <Twitter :size="20" />
                </button>
                <button class="p-3 bg-background border border-border rounded-xl hover:border-primary transition-colors">
                  <Globe :size="20" />
                </button>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex flex-wrap gap-4">
              <button class="flex items-center gap-2 px-8 py-3 bg-background text-text font-black rounded-2xl border border-border hover:border-primary transition-all">
                <User :size="20" />
                Suivre
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Projects Section -->
    <div v-if="talent" class="max-w-6xl mx-auto px-8 py-12">
      <h2 class="text-2xl font-black text-text mb-8">Projets ({{ projects.length }})</h2>
      
      <div v-if="projectsLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="mt-4 text-text-muted">Chargement des projets...</p>
      </div>
      
      <div v-else-if="projects.length === 0" class="text-center py-12 bg-surface rounded-3xl border border-border">
        <Briefcase :size="48" class="text-text-muted mx-auto mb-4" />
        <h3 class="text-lg font-black text-text mb-2">Aucun projet</h3>
        <p class="text-text-muted">Ce talent n'a pas encore publié de projets.</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="project in projects" 
          :key="project._id"
          class="bg-surface rounded-xl overflow-hidden hover:shadow-lg transition-shadow border border-border group"
        >
          <div class="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <img 
              v-if="project.image" 
              :src="project.image" 
              :alt="project.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="text-4xl">🚀</div>
          </div>
          
          <div class="p-6">
            <h3 class="text-lg font-semibold text-text mb-2 group-hover:text-primary transition-colors">
              {{ project.title }}
            </h3>
            <p class="text-text-muted text-sm mb-4 line-clamp-2">{{ project.description }}</p>
            
            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="tag in project.tags?.slice(0, 3)" 
                :key="tag"
                class="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
              >
                {{ tag }}
              </span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-xs text-text-muted">
                {{ new Date(project.createdAt).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                }) }}
              </span>
              <router-link 
                :to="`/projects/${project._id}`"
                class="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
              >
                Voir →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
