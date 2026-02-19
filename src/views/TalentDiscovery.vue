<script setup>
import { 
  MapPin, 
  Mail, 
  User, 
  Filter, 
  ChevronDown, 
  CheckCircle2 
} from 'lucide-vue-next'
import { MOCK_TALENTS } from '../constants'
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
               <label v-for="(role, i) in ['Développeur', 'Candidat', 'Recruteur']" :key="role" class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" :checked="i === 0" class="w-5 h-5 rounded border-border text-primary focus:ring-primary/20 bg-background" />
                  <span class="text-sm font-bold text-text-muted group-hover:text-primary transition-colors">{{ role }}</span>
               </label>
            </div>
         </div>

         <div class="space-y-4">
            <p class="text-[10px] font-black text-text-muted uppercase tracking-widest">Type de Contrat</p>
            <div class="space-y-3">
               <label v-for="(type, i) in ['Tous types', 'Temps plein', 'Freelance']" :key="type" class="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="contract" :checked="i === 0" class="w-5 h-5 border-border text-primary focus:ring-primary/20 bg-background" />
                  <span class="text-sm font-bold text-text-muted group-hover:text-primary transition-colors">{{ type }}</span>
               </label>
            </div>
         </div>

         <div class="space-y-4">
            <p class="text-[10px] font-black text-text-muted uppercase tracking-widest">Tech Populaires</p>
            <div class="flex flex-wrap gap-2">
               <span v-for="(tech, i) in ['REACT', 'NODE.JS', 'PYTHON', 'TYPESCRIPT', 'AWS', 'DOCKER']" :key="tech" class="px-2.5 py-1.5 rounded-md text-[9px] font-black cursor-pointer transition-all"
                 :class="i === 0 ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-background border border-border text-text-muted hover:border-primary hover:text-primary'"
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
              <p class="text-lg text-text-muted font-medium">1,240 développeurs sont disponibles pour leur prochain défi.</p>
           </div>
           <div class="flex items-center gap-3">
              <span class="text-xs font-bold text-text-muted uppercase tracking-widest">Trier par :</span>
              <button class="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-xl text-xs font-bold text-text hover:border-primary transition-colors">
                 Plus Pertinent <ChevronDown :size="14" />
              </button>
           </div>
        </div>

        <div class="grid grid-cols-1 gap-6">
          <div v-for="talent in MOCK_TALENTS" :key="talent.id" class="group bg-surface p-8 rounded-3xl border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col md:flex-row gap-8 relative overflow-hidden">
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
              <button class="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white text-sm font-black rounded-2xl hover:scale-105 shadow-xl shadow-primary/20 transition-all active:scale-95">
                <Mail :size="18" /> Contact
              </button>
              <button class="flex items-center justify-center gap-2 px-8 py-3 bg-background text-text text-sm font-black rounded-2xl border border-border hover:border-primary transition-all">
                <User :size="18" /> Profil
              </button>
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
