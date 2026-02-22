<template>
  <div class="min-h-screen bg-background p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-text">Mes Projets</h1>
        <router-link 
          to="/publish"
          class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Nouveau projet
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="mt-4 text-text-muted">Chargement de vos projets...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl">❌</span>
        </div>
        <h3 class="text-xl font-semibold text-text mb-2">Erreur de chargement</h3>
        <p class="text-text-muted mb-6">{{ error }}</p>
        <div class="flex gap-4 justify-center">
          <button 
            @click="auth.logout(); router.push('/login')"
            class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Se reconnecter
          </button>
          <button 
            @click="$router.go(0)"
            class="bg-surface text-text px-6 py-2 rounded-lg hover:bg-surface/90 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>

      <div v-else-if="projects.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl">📁</span>
        </div>
        <h3 class="text-xl font-semibold text-text mb-2">Aucun projet</h3>
        <p class="text-text-muted mb-6">Commencez par partager votre premier projet avec la communauté.</p>
        <router-link 
          to="/publish"
          class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Publier un projet
        </router-link>
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="project in projects" 
          :key="project._id"
          class="bg-surface rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
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
            <h3 class="text-lg font-semibold text-text mb-2">{{ project.title }}</h3>
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
                {{ formatDate(project.createdAt) }}
              </span>
              <div class="flex gap-2">
                <button 
                  @click="editProject(project)"
                  class="p-2 text-text-muted hover:text-primary transition-colors"
                  title="Modifier"
                >
                  ✏️
                </button>
                <button 
                  @click="deleteProject(project._id)"
                  class="p-2 text-text-muted hover:text-red-500 transition-colors"
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchMyProjects, deleteProject as deleteProjectAPI } from '../api'
import { useRouter } from 'vue-router'
import { useAuth } from '../store/auth'

const router = useRouter()
const auth = useAuth()
const projects = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    projects.value = await fetchMyProjects(auth.state.token)
    error.value = null
  } catch (error) {
    console.error('Erreur chargement projets:', error)
    error.value = 'Erreur lors du chargement des projets. Veuillez vous reconnecter.'
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  })
}

const editProject = (project) => {
  // Rediriger vers la page de publication avec le projet à éditer
  router.push(`/publish?edit=${project._id}`)
}

const deleteProject = async (projectId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
    try {
      await deleteProjectAPI(projectId, auth.state.token)
      // Mettre à jour la liste des projets
      projects.value = projects.value.filter(p => p._id !== projectId)
      alert('Projet supprimé avec succès')
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression du projet')
    }
  }
}
</script>
