<script setup>
import { onMounted, ref, watch } from 'vue'
import { Search, MapPin, ChevronDown, Clock, Building2, X, Send, Briefcase, Bookmark } from 'lucide-vue-next'
import { fetchJobs, applyToJob, createJob } from '../api'
import { useAuth } from '../store/auth'

const auth = useAuth()
const jobs = ref([])
const loading = ref(true)
const pagination = ref({})

// Application modal state
const showApplicationModal = ref(false)
const selectedJob = ref(null)
const applicationForm = ref({
  coverLetter: '',
  resume: '',
  portfolio: '',
  expectedSalary: '',
  availability: 'immediate'
})
const submittingApplication = ref(false)

// Create job modal state
const showCreateJobModal = ref(false)
const newJob = ref({
  title: '',
  company: '',
  description: '',
  type: 'CDI',
  salary: '',
  location: '',
  tags: ''
})
const submittingJob = ref(false)

// Filter states
const searchQuery = ref('')
const locationQuery = ref('')
const selectedType = ref('all')
const selectedSalary = ref('all')
const selectedTags = ref([])
const currentPage = ref(1)

// Build filters object
const buildFilters = () => {
  const filters = {}
  
  if (searchQuery.value.trim()) filters.search = searchQuery.value.trim()
  if (locationQuery.value.trim()) filters.location = locationQuery.value.trim()
  if (selectedType.value !== 'all') filters.type = selectedType.value
  if (selectedSalary.value !== 'all') filters.salary = selectedSalary.value
  if (selectedTags.value.length > 0) filters.tags = selectedTags.value.join(',')
  if (currentPage.value > 1) filters.page = currentPage.value
  
  return filters
}

// Load jobs with filters
const loadJobs = async () => {
  try {
    loading.value = true
    const response = await fetchJobs(buildFilters())
    jobs.value = response.jobs || response
    pagination.value = response.pagination || {}
  } catch (error) {
    console.error(error)
    jobs.value = []
  } finally {
    loading.value = false
  }
}

// Open application modal
const openApplicationModal = (job) => {
  if (!auth.state.isAuthenticated) {
    alert('Vous devez être connecté pour postuler à une offre')
    return
  }
  
  selectedJob.value = job
  showApplicationModal.value = true
  applicationForm.value = {
    coverLetter: '',
    resume: '',
    portfolio: '',
    expectedSalary: '',
    availability: 'immediate'
  }
}

// Close application modal
const closeApplicationModal = () => {
  showApplicationModal.value = false
  selectedJob.value = null
  applicationForm.value = {
    coverLetter: '',
    resume: '',
    portfolio: '',
    expectedSalary: '',
    availability: 'immediate'
  }
}

// Submit application
const submitApplication = async () => {
  if (!applicationForm.value.coverLetter.trim()) {
    alert('Veuillez rédiger une lettre de motivation')
    return
  }
  
  submittingApplication.value = true
  try {
    await applyToJob({
      jobId: selectedJob.value._id,
      ...applicationForm.value
    })
    
    alert('Candidature envoyée avec succès !')
    closeApplicationModal()
  } catch (error) {
    console.error('Application error:', error)
    alert(error.message || 'Erreur lors de l\'envoi de la candidature')
  } finally {
    submittingApplication.value = false
  }
}

// Create job
const handleCreateJob = async () => {
  if (!newJob.value.title.trim() || !newJob.value.company.trim()) {
    alert('Veuillez remplir le titre et l\'entreprise')
    return
  }
  
  submittingJob.value = true
  try {
    await createJob({
      ...newJob.value,
      tags: newJob.value.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    })
    
    alert('Offre d\'emploi publiée avec succès !')
    showCreateJobModal.value = false
    newJob.value = {
      title: '',
      company: '',
      description: '',
      type: 'CDI',
      salary: '',
      location: '',
      tags: ''
    }
    loadJobs()
  } catch (error) {
    console.error('Create job error:', error)
    alert(error.message || 'Erreur lors de la publication de l\'offre')
  } finally {
    submittingJob.value = false
  }
}

// Watch for filter changes
watch([searchQuery, locationQuery, selectedType, selectedSalary, selectedTags, currentPage], () => {
  currentPage.value = 1 // Reset to page 1 when filters change
  loadJobs()
}, { deep: true })

// Initial load
onMounted(loadJobs)

// Quick filter functions
const applyQuickFilter = (type, value) => {
  if (type === 'location') {
    locationQuery.value = value
  } else if (type === 'type') {
    selectedType.value = value
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  locationQuery.value = ''
  selectedType.value = 'all'
  selectedSalary.value = 'all'
  selectedTags.value = []
  currentPage.value = 1
}
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div class="mb-8">
      <h1 class="text-4xl font-black text-text tracking-tight mb-2">Offres d'emploi Développeur</h1>
      <p class="text-text-muted max-w-2xl text-lg">Découvrez des rôles à fort impact dans les meilleures entreprises tech. Filtrez par contrat, expérience ou stack technique.</p>
    </div>

    <!-- Search & Filter Bar -->
    <div class="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-4">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex-1 relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" :size="20" />
          <input 
            v-model="searchQuery"
            class="w-full bg-background border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all" 
            placeholder="Poste, mots-clés ou entreprise..."
            type="text"
          />
        </div>
        <div class="flex-1 relative">
          <MapPin class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" :size="20" />
          <input 
            v-model="locationQuery"
            class="w-full bg-background border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all" 
            placeholder="Ville, pays ou Télétravail"
            type="text"
          />
        </div>
        <button class="bg-primary text-white px-10 py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
          Rechercher
        </button>
      </div>
      
      <div class="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
         <select v-model="selectedType" class="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-text focus:outline-none focus:border-primary">
           <option value="all">Type de contrat</option>
           <option value="CDI">CDI</option>
           <option value="CDD">CDD</option>
           <option value="Freelance">Freelance</option>
           <option value="Stage">Stage</option>
           <option value="Alternance">Alternance</option>
         </select>
         <select v-model="selectedSalary" class="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-text focus:outline-none focus:border-primary">
           <option value="all">Fourchette salariale</option>
           <option value="0-30k">0-30k€</option>
           <option value="30k-50k">30k-50k€</option>
           <option value="50k-70k">50k-70k€</option>
           <option value="70k-100k">70k-100k€</option>
           <option value="100k+">100k€+</option>
         </select>
         <button 
           v-if="searchQuery || locationQuery || selectedType !== 'all' || selectedSalary !== 'all'"
           @click="clearFilters"
           class="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-colors"
         >
           <X :size="14" /> Effacer les filtres
         </button>
         <div class="h-6 w-px bg-border mx-2"></div>
         <div class="flex items-center gap-2">
           <span class="text-[10px] font-bold text-text-muted uppercase tracking-widest">Filtres rapides :</span>
           <span 
             @click="applyQuickFilter('location', 'Télétravail')"
             class="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full cursor-pointer hover:opacity-90"
           >
             Remote
           </span>
           <span 
             @click="applyQuickFilter('type', 'CDI')"
             class="bg-background border border-border text-text text-[10px] font-black px-3 py-1.5 rounded-full cursor-pointer hover:border-primary hover:text-primary transition-all"
           >
             CDI
           </span>
           <span 
             @click="applyQuickFilter('type', 'Freelance')"
             class="bg-background border border-border text-text text-[10px] font-black px-3 py-1.5 rounded-full cursor-pointer hover:border-primary hover:text-primary transition-all"
           >
             Freelance
           </span>
         </div>
      </div>
    </div>

    <!-- Jobs Grid -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
      <div v-for="i in 3" :key="i" class="h-48 bg-surface rounded-2xl animate-pulse border border-border"></div>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
      <div 
        v-for="job in jobs" 
        :key="job._id || job.id" 
        class="group bg-surface p-8 rounded-3xl border border-border shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20 transition-all duration-500 cursor-pointer relative overflow-hidden"
      >
        <div class="w-16 h-16 bg-background rounded-2xl border border-border flex items-center justify-center p-3 shrink-0">
          <img :src="job.logo" :alt="job.company" class="w-full h-full object-contain" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 class="text-xl font-bold text-text group-hover:text-primary transition-colors">{{ job.title }}</h3>
              <div class="flex items-center gap-3 mt-1">
                <span class="text-sm font-bold text-primary flex items-center gap-1">
                   <Building2 :size="14" /> {{ job.company }}
                </span>
                <span class="text-border">•</span>
                <span class="text-sm text-text-muted flex items-center gap-1">
                   <MapPin :size="14" /> {{ job.location }}
                </span>
              </div>
            </div>
            <div class="flex gap-2">
              <span 
                class="text-[11px] font-black px-3 py-1.5 rounded-lg border border-transparent"
                :class="{
                  'bg-blue-500/10 text-blue-500': job.type === 'Freelance',
                  'bg-emerald-500/10 text-emerald-500': job.type === 'CDI',
                  'bg-amber-500/10 text-amber-500': job.type === 'CDD'
                }"
              >
                {{ job.type }}
              </span>
              <span class="bg-background text-text-muted text-[11px] font-black px-3 py-1.5 rounded-lg border border-border">
                {{ job.salary }}
              </span>
            </div>
          </div>
          <p class="text-text-muted text-sm mb-6 leading-relaxed line-clamp-2">{{ job.description }}</p>
          
          <div class="flex items-center justify-between">
            <div class="flex gap-2">
              <span v-for="tag in job.tags" :key="tag" class="text-[10px] font-bold text-text-muted bg-background border border-border px-2 py-1 rounded">
                {{ tag }}
              </span>
            </div>
            <div class="flex items-center gap-4">
               <span class="text-xs text-text-muted flex items-center gap-1">
                 <Clock :size="12" /> {{ job.postedAt }}
               </span>
               <div class="flex items-center gap-3">
                 <button 
                   @click="openApplicationModal(job)"
                   class="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
                 >
                   <Send :size="16" />
                   Postuler
                 </button>
                 <button class="p-2 text-text-muted hover:text-primary transition-colors">
                   <Bookmark :size="18" />
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Pagination -->
    <div v-if="pagination.pages > 1" class="flex justify-center items-center gap-4 pt-8">
      <button 
        @click="currentPage--"
        :disabled="currentPage <= 1"
        class="px-4 py-2 bg-background border border-border rounded-xl text-sm font-bold text-text hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Précédent
      </button>
      <span class="text-sm text-text-muted">
        Page {{ pagination.page }} sur {{ pagination.pages }}
      </span>
      <button 
        @click="currentPage++"
        :disabled="currentPage >= pagination.pages"
        class="px-4 py-2 bg-background border border-border rounded-xl text-sm font-bold text-text hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Suivant
      </button>
    </div>
    
    <div class="text-center pt-8 pb-12">
      <p class="text-xs text-text-muted mt-4">
        Affichage de {{ jobs.length }} offre(s) active(s)
        <span v-if="pagination.total"> sur {{ pagination.total }} au total</span>
      </p>
    </div>
    
    <!-- Floating Action Button -->
    <button 
      @click="showCreateJobModal = true"
      class="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-xl shadow-primary/30 hover:scale-110 transition-all z-40 group"
    >
      <Briefcase :size="24" />
      <span class="absolute right-full mr-3 bg-surface border border-border px-3 py-2 rounded-lg text-sm font-black text-text whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all">
        Publier une offre
      </span>
    </button>
    
    <!-- Create Job Modal -->
    <div v-if="showCreateJobModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-surface rounded-3xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-border flex items-center justify-between">
          <h3 class="text-xl font-black text-text">Publier une offre d'emploi</h3>
          <button @click="showCreateJobModal = false" class="p-2 text-text-muted hover:text-primary transition-colors">
            <X :size="24" />
          </button>
        </div>
        
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-black text-text">Titre du poste</label>
              <input v-model="newJob.title" type="text" placeholder="Développeur React" class="w-full bg-background border border-border rounded-xl p-3 text-sm">
            </div>
            <div class="space-y-2">
              <label class="text-sm font-black text-text">Entreprise</label>
              <input v-model="newJob.company" type="text" placeholder="Tech Company" class="w-full bg-background border border-border rounded-xl p-3 text-sm">
            </div>
          </div>
          
          <div class="space-y-2">
            <label class="text-sm font-black text-text">Description</label>
            <textarea v-model="newJob.description" rows="4" placeholder="Description du poste..." class="w-full bg-background border border-border rounded-xl p-3 text-sm resize-none"></textarea>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-black text-text">Type</label>
              <select v-model="newJob.type" class="w-full bg-background border border-border rounded-xl p-3 text-sm">
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Freelance">Freelance</option>
                <option value="Stage">Stage</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-black text-text">Salaire</label>
              <input v-model="newJob.salary" type="text" placeholder="40k-60k€" class="w-full bg-background border border-border rounded-xl p-3 text-sm">
            </div>
            <div class="space-y-2">
              <label class="text-sm font-black text-text">Localisation</label>
              <input v-model="newJob.location" type="text" placeholder="Paris" class="w-full bg-background border border-border rounded-xl p-3 text-sm">
            </div>
          </div>
          
          <div class="space-y-2">
            <label class="text-sm font-black text-text">Tags (séparés par des virgules)</label>
            <input v-model="newJob.tags" type="text" placeholder="React, Node.js, MongoDB" class="w-full bg-background border border-border rounded-xl p-3 text-sm">
          </div>
        </div>
        
        <div class="p-6 border-t border-border flex justify-end gap-4">
          <button @click="showCreateJobModal = false" class="px-6 py-3 bg-background border border-border text-text rounded-xl font-bold hover:bg-surface">
            Annuler
          </button>
          <button @click="handleCreateJob" :disabled="!newJob.title || !newJob.company" class="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50">
            Publier l'offre
          </button>
        </div>
      </div>
    </div>
    
    <!-- Application Modal -->
    <div v-if="showApplicationModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-surface rounded-3xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 class="text-xl font-black text-text">Postuler à : {{ selectedJob?.title }}</h3>
            <p class="text-sm text-text-muted mt-1">{{ selectedJob?.company }} • {{ selectedJob?.location }}</p>
          </div>
          <button @click="closeApplicationModal" class="p-2 text-text-muted hover:text-primary transition-colors">
            <X :size="24" />
          </button>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- Cover Letter -->
          <div class="space-y-2">
            <label class="text-sm font-black text-text uppercase tracking-wider">Lettre de motivation *</label>
            <textarea 
              v-model="applicationForm.coverLetter"
              rows="6"
              placeholder="Présentez-vous et expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
              class="w-full bg-background border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text resize-none"
            ></textarea>
          </div>
          
          <!-- Resume -->
          <div class="space-y-2">
            <label class="text-sm font-black text-text uppercase tracking-wider">Lien vers votre CV</label>
            <input 
              v-model="applicationForm.resume"
              type="url"
              placeholder="https://mon-cv.pdf"
              class="w-full bg-background border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text"
            />
          </div>
          
          <!-- Portfolio -->
          <div class="space-y-2">
            <label class="text-sm font-black text-text uppercase tracking-wider">Portfolio</label>
            <input 
              v-model="applicationForm.portfolio"
              type="url"
              placeholder="https://mon-portfolio.com"
              class="w-full bg-background border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text"
            />
          </div>
          
          <!-- Expected Salary -->
          <div class="space-y-2">
            <label class="text-sm font-black text-text uppercase tracking-wider">Salaire souhaité (€/an)</label>
            <input 
              v-model="applicationForm.expectedSalary"
              type="number"
              placeholder="45000"
              class="w-full bg-background border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text"
            />
          </div>
          
          <!-- Availability -->
          <div class="space-y-2">
            <label class="text-sm font-black text-text uppercase tracking-wider">Disponibilité</label>
            <select 
              v-model="applicationForm.availability"
              class="w-full bg-background border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text"
            >
              <option value="immediate">Immédiate</option>
              <option value="2weeks">2 semaines</option>
              <option value="1month">1 mois</option>
              <option value="2months">2 mois</option>
              <option value="3months">3 mois</option>
            </select>
          </div>
        </div>
        
        <div class="p-6 border-t border-border flex justify-end gap-4">
          <button 
            @click="closeApplicationModal"
            :disabled="submittingApplication"
            class="px-6 py-3 bg-background border border-border text-text rounded-xl font-bold hover:bg-surface transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button 
            @click="submitApplication"
            :disabled="submittingApplication"
            class="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <div v-if="submittingApplication" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span v-else>Envoyer ma candidature</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
