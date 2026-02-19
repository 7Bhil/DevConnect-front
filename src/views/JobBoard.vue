<script setup>
import { onMounted, ref } from 'vue'
import { Search, MapPin, ChevronDown, Clock, Building2 } from 'lucide-vue-next'
import { fetchJobs } from '../api'

const jobs = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    jobs.value = await fetchJobs()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
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
            class="w-full bg-background border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all" 
            placeholder="Poste, mots-clés ou entreprise..."
            type="text"
          />
        </div>
        <div class="flex-1 relative">
          <MapPin class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" :size="20" />
          <input 
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
         <button class="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-text-muted hover:border-primary hover:text-primary transition-colors">
           Type de contrat <ChevronDown :size="14" />
         </button>
         <button class="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-text-muted hover:border-primary hover:text-primary transition-colors">
           Fourchette salariale <ChevronDown :size="14" />
         </button>
         <button class="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-xs font-bold text-text-muted hover:border-primary hover:text-primary transition-colors">
           Expérience <ChevronDown :size="14" />
         </button>
         <div class="h-6 w-px bg-border mx-2"></div>
         <div class="flex items-center gap-2">
           <span class="text-[10px] font-bold text-text-muted uppercase tracking-widest">Filtres rapides :</span>
           <span class="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full cursor-pointer hover:opacity-90">Remote</span>
           <span class="bg-background border border-border text-text text-[10px] font-black px-3 py-1.5 rounded-full cursor-pointer hover:border-primary hover:text-primary transition-all">CDI</span>
           <span class="bg-background border border-border text-text text-[10px] font-black px-3 py-1.5 rounded-full cursor-pointer hover:border-primary hover:text-primary transition-all">Freelance</span>
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
        :key="job.id" 
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
               <button class="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-md shadow-primary/10">
                 Postuler
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="text-center pt-8 pb-12">
      <p class="text-xs text-text-muted mt-4">Affichage de {{ jobs.length }} offre(s) active(s)</p>
    </div>
  </div>
</template>
