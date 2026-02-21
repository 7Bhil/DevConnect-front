<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, MapPin, Phone, Linkedin, User, CheckCircle2, ChevronDown, Filter } from 'lucide-vue-next'
import { fetchTalents } from '../api'
import { useAuth } from '../store/auth'

const router = useRouter()
const auth = useAuth()
const talents = ref([])
const loading = ref(true)
const pagination = ref({})

// WhatsApp and LinkedIn functions
const contactWhatsApp = (whatsapp) => {
  if (!whatsapp) {
    alert('Numéro WhatsApp non disponible')
    return
  }
  
  // Ouvrir WhatsApp
  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`
  window.open(whatsappUrl, '_blank')
}

const contactLinkedIn = (linkedin) => {
  if (!linkedin) {
    alert('Profil LinkedIn non disponible')
    return
  }
  
  // Ouvrir LinkedIn
  window.open(linkedin, '_blank')
}

// Filter states
const searchQuery = ref('')
const selectedRole = ref('all')
const selectedLocation = ref('all')
const selectedAvailability = ref('all')
const selectedContractType = ref('all')
const selectedSkills = ref([])
const currentPage = ref(1)

// Build filters object
const buildFilters = () => {
  const filters = {}
  
  if (searchQuery.value.trim()) filters.search = searchQuery.value.trim()
  if (selectedRole.value !== 'all') filters.role = selectedRole.value
  if (selectedLocation.value !== 'all') filters.location = selectedLocation.value
  if (selectedAvailability.value !== 'all') filters.availability = selectedAvailability.value === 'available'
  if (selectedContractType.value !== 'all') filters.contractType = selectedContractType.value
  if (selectedSkills.value.length > 0) filters.skills = selectedSkills.value.join(',')
  if (currentPage.value > 1) filters.page = currentPage.value
  
  return filters
}

// Load talents with filters
const loadTalents = async () => {
  try {
    loading.value = true
    const response = await fetchTalents(buildFilters())
    talents.value = response.talents || []
    pagination.value = response.pagination || {}
  } catch (error) {
    console.error(error)
    talents.value = []
  } finally {
    loading.value = false
  }
}

// Watch for filter changes
watch([searchQuery, selectedRole, selectedLocation, selectedAvailability, selectedContractType, selectedSkills, currentPage], () => {
  currentPage.value = 1 // Reset to page 1 when filters change
  loadTalents()
}, { deep: true })

// Initial load
onMounted(loadTalents)

// Quick filter functions
const applyQuickFilter = (skill) => {
  if (!selectedSkills.value.includes(skill)) {
    selectedSkills.value.push(skill)
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedRole.value = 'all'
  selectedLocation.value = 'all'
  selectedAvailability.value = 'all'
  selectedContractType.value = 'all'
  selectedSkills.value = []
  currentPage.value = 1
}
</script>

<template>
  <div class="flex h-full min-h-[calc(100vh-64px)] overflow-hidden animate-in fade-in duration-500">
    <!-- Sidebar Filters -->
    <aside class="w-80 bg-surface border-r border-border p-8 hidden xl:block overflow-y-auto no-scrollbar transition-colors duration-300">
      <div class="flex items-center gap-2 text-primary mb-8">
         <Filter :size="20" />
         <h3 class="text-lg font-black text-text">Filtres</h3>
      </div>

      <div class="space-y-10">
         <div class="space-y-4">
            <p class="text-[10px] font-black text-text-muted uppercase tracking-widest">Rôle Principal</p>
            <div class="space-y-3">
               <label v-for="(role, i) in ['all', 'developer', 'recruiter']" :key="role" class="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="role" 
                    :value="role"
                    v-model="selectedRole"
                    class="w-5 h-5 rounded border-border text-primary focus:ring-primary/20 bg-background" 
                  />
                  <span class="text-sm font-bold text-text-muted group-hover:text-primary transition-colors">
                    {{ role === 'all' ? 'Tous les rôles' : role === 'developer' ? 'Développeur' : 'Recruteur' }}
                  </span>
               </label>
            </div>
         </div>

         <div class="space-y-4">
            <p class="text-[10px] font-black text-text-muted uppercase tracking-widest">Type de Contrat</p>
            <div class="space-y-3">
               <label v-for="(type, i) in ['all', 'CDI', 'CDD', 'Freelance']" :key="type" class="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="contract" 
                    :value="type"
                    v-model="selectedContractType"
                    class="w-5 h-5 rounded border-border text-primary focus:ring-primary/20 bg-background" 
                  />
                  <span class="text-sm font-bold text-text-muted group-hover:text-primary transition-colors">
                    {{ type === 'all' ? 'Tous types' : type }}
                  </span>
               </label>
            </div>
         </div>

         <div class="space-y-4">
            <p class="text-[10px] font-black text-text-muted uppercase tracking-widest">Tech Populaires</p>
            <div class="flex flex-wrap gap-2">
               <span 
                 v-for="tech in ['REACT', 'NODE.JS', 'PYTHON', 'TYPESCRIPT', 'AWS', 'DOCKER']" 
                 :key="tech" 
                 @click="applyQuickFilter(tech)"
                 class="px-2.5 py-1.5 rounded-md text-[9px] font-black cursor-pointer transition-all"
                 :class="selectedSkills.includes(tech) ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-background border border-border text-text-muted hover:border-primary hover:text-primary'"
               >
                 {{ tech }}
               </span>
            </div>
         </div>

         <div class="pt-6 space-y-3">
            <button class="w-full py-4 bg-text text-background text-sm font-black rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-text/5">
              Appliquer les Filtres
            </button>
            <button class="w-full py-2 text-xs font-bold text-text-muted hover:text-primary transition-colors">
              Réinitialiser
            </button>
         </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 bg-background overflow-y-auto no-scrollbar p-8 transition-colors duration-300">
      <div class="max-w-5xl mx-auto space-y-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 class="text-4xl font-black text-text tracking-tight mb-2">Découvrir les Talents</h1>
              <p class="text-lg text-text-muted font-medium">{{ talents?.length || 0 }} développeur{{ (talents?.length || 0) > 1 ? 's sont' : ' est' }} disponible{{ (talents?.length || 0) > 1 ? 's' : '' }} pour leur prochain défi.</p>
            </div>
           <div class="flex items-center gap-3">
              <span class="text-xs font-bold text-text-muted uppercase tracking-widest">Trier par :</span>
              <button class="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-xl text-xs font-bold text-text hover:border-primary transition-colors">
                 Plus Pertinent <ChevronDown :size="14" />
              </button>
           </div>
        </div>
        <!-- Talent Grid -->
        <div class="flex-1 space-y-6">
          <div v-if="loading" class="grid grid-cols-1 gap-6">
             <div v-for="i in 3" :key="i" class="h-64 bg-surface rounded-3xl animate-pulse border border-border"></div>
          </div>
          <div v-else-if="talents.length === 0" class="text-center py-20">
            <div class="p-6 bg-surface rounded-full mb-4 border border-border mx-auto w-fit">
              <User :size="48" class="text-text-muted opacity-50" />
            </div>
            <h4 class="text-lg font-black text-text mb-2">Aucun talent trouvé</h4>
            <p class="text-sm text-text-muted max-w-xs mx-auto">Essayez d'ajuster vos filtres pour voir plus de résultats.</p>
          </div>
          <div v-else class="space-y-6">
            <div v-for="talent in talents" :key="talent._id" class="bg-surface rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden flex flex-col md:flex-row gap-8">
            <div class="shrink-0 relative">
              <div class="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-background ring-1 ring-border group-hover:scale-105 transition-transform duration-500 shadow-xl shadow-text/5">
                <img :src="talent.avatar" class="w-full h-full object-cover" alt="" />
              </div>
              <div v-if="talent.isAvailable" class="absolute -bottom-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-surface flex items-center justify-center" title="Disponible">
                 <CheckCircle2 :size="12" class="text-white" />
              </div>
            </div>

            <div class="flex-1 space-y-4">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <h3 class="text-2xl font-black text-text group-hover:text-primary transition-colors">{{ talent.name }}</h3>
                   <p class="text-primary font-bold text-sm tracking-tight">{{ talent.role }}</p>
                </div>
                <div class="flex items-center gap-2 text-text-muted text-xs font-bold uppercase tracking-widest">
                   <MapPin :size="14" /> {{ talent.location }}
                </div>
              </div>

              <p class="text-text-muted text-sm leading-relaxed max-w-2xl font-medium">
                {{ talent.bio }}
              </p>

              <div class="flex flex-wrap gap-2 pt-2">
                <span v-for="skill in talent.skills" :key="skill" class="px-3 py-1 bg-background border border-border text-text-muted text-[10px] font-black rounded-lg uppercase tracking-wider group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all">
                  {{ skill }}
                </span>
              </div>
            </div>

            <div class="flex md:flex-col justify-end gap-3 shrink-0">
              <button 
                @click="contactWhatsApp(talent.whatsapp)"
                :disabled="!talent.whatsapp"
                class="flex items-center justify-center gap-2 px-8 py-3 bg-green-500 text-white text-sm font-black rounded-2xl hover:scale-105 shadow-xl shadow-green-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Phone :size="18" /> WhatsApp
              </button>
              <button 
                @click="contactLinkedIn(talent.linkedin)"
                :disabled="!talent.linkedin"
                class="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white text-sm font-black rounded-2xl hover:scale-105 shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Linkedin :size="18" /> LinkedIn
              </button>
            </div>
          </div>
        </div>
          </div>

        <div class="text-center pt-10 pb-12">
          <button class="inline-flex items-center gap-3 px-10 py-4 bg-surface border border-border rounded-2xl font-black text-text hover:border-primary hover:text-primary transition-all shadow-sm">
            Charger plus de développeurs
            <ChevronDown :size="20" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
