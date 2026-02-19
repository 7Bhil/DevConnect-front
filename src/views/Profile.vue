<script setup>
import { 
  Github, 
  Linkedin, 
  Mail, 
  Globe, 
  MapPin, 
  Terminal, 
  TrendingUp, 
  FolderOpen, 
  Star, 
  ExternalLink,
  UserPlus,
  MessageCircle,
  ArrowRight
} from 'lucide-vue-next'
import { useAuth } from '../store/auth'

const auth = useAuth()
const me = auth.state.user || { name: 'Utilisateur', role: 'Professionnel', avatar: 'https://picsum.photos/200', location: 'Non renseigné', skills: [] }

const projects = []
</script>

<template>
  <div class="min-h-screen -m-8 pb-20 animate-in fade-in duration-700">
    <!-- Hero Banner -->
    <div class="h-48 bg-gradient-to-r from-primary to-indigo-700 relative overflow-hidden transition-colors duration-300">
       <div class="absolute inset-0 opacity-10">
         <div class="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full blur-[100px]"></div>
         <div class="absolute top-40 right-20 w-64 h-64 bg-white rounded-full blur-[80px]"></div>
       </div>
    </div>

    <div class="max-w-6xl mx-auto px-8">
      <!-- Profile Card -->
      <div class="bg-surface rounded-3xl shadow-xl shadow-text/5 -mt-20 relative z-10 p-10 border border-border transition-colors duration-300">
        <div class="flex flex-col lg:flex-row gap-10 items-start lg:items-end">
          <div class="relative group">
            <div class="w-40 h-40 rounded-[2.5rem] bg-surface p-1 shadow-2xl overflow-hidden border border-border">
              <img :src="me.avatar" class="w-full h-full object-cover rounded-[2.2rem]" alt="" />
            </div>
            <div class="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 border-4 border-surface rounded-full flex items-center justify-center">
              <div class="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          <div class="flex-1 space-y-4">
             <div>
               <h1 class="text-4xl font-black text-text tracking-tight">{{ me.name }}</h1>
               <p class="text-lg text-text-muted font-bold flex items-center gap-3 mt-1">
                 {{ me.role }}
                 <span class="w-1.5 h-1.5 bg-border rounded-full"></span>
                 <span class="flex items-center gap-1.5 text-text-muted font-medium">
                    <MapPin :size="18" /> {{ me.location }}
                 </span>
               </p>
             </div>
             <p class="text-text-muted max-w-3xl leading-relaxed text-lg font-medium">
               Construction d'applications web évolutives avec React, Node.js et infrastructure Cloud. Plus de 8 ans d'expérience en startups à forte croissance.
             </p>
          </div>

          <div class="flex gap-4 lg:pb-4 w-full lg:w-auto">
            <button class="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-black rounded-2xl hover:scale-105 shadow-xl shadow-primary/20 transition-all active:scale-95">
              <UserPlus :size="20" /> Connecter
            </button>
            <button class="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-background text-text font-black rounded-2xl border border-border hover:border-primary transition-all">
              <MessageCircle :size="20" /> Message
            </button>
          </div>
        </div>

        <div class="flex flex-wrap gap-4 mt-12 pt-10 border-t border-border">
           <a href="#" class="flex items-center gap-2 px-6 py-3 bg-background border border-border hover:bg-slate-900 hover:text-white text-text-muted rounded-2xl font-bold text-sm transition-all">
             <Github :size="20" /> GitHub
           </a>
           <a href="#" class="flex items-center gap-2 px-6 py-3 bg-background border border-border hover:bg-blue-600 hover:text-white text-text-muted rounded-2xl font-bold text-sm transition-all">
             <Linkedin :size="20" /> LinkedIn
           </a>
           <a href="#" class="flex items-center gap-2 px-6 py-3 bg-background border border-border hover:bg-primary hover:text-white text-text-muted rounded-2xl font-bold text-sm transition-all">
             <Mail :size="20" /> Email
           </a>
           <a href="#" class="flex items-center gap-2 px-6 py-3 bg-background border border-border hover:bg-indigo-600 hover:text-white text-text-muted rounded-2xl font-bold text-sm transition-all">
             <Globe :size="20" /> Portfolio
           </a>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
         <!-- Sidebar -->
         <div class="lg:col-span-4 space-y-8">
            <div class="bg-surface rounded-3xl p-8 shadow-sm border border-border transition-colors duration-300">
               <h3 class="text-xl font-black text-text mb-6 flex items-center gap-2">
                 <Terminal class="text-primary" :size="24" /> Compétences
               </h3>
               <div class="flex flex-wrap gap-2">
                  <span v-for="skill in me.skills" :key="skill" class="px-4 py-2 bg-primary/10 text-primary text-xs font-black rounded-xl border border-primary/20">
                    {{ skill }}
                  </span>
               </div>
            </div>

            <div class="bg-surface rounded-3xl p-8 shadow-sm border border-border transition-colors duration-300">
               <h3 class="text-xl font-black text-text mb-6 flex items-center gap-2">
                 <TrendingUp class="text-primary" :size="24" /> Statistiques
               </h3>
               <div class="grid grid-cols-2 gap-4">
                  <div class="p-6 bg-background rounded-2xl text-center border border-border transition-colors duration-300">
                     <p class="text-3xl font-black text-primary">{{ me.projectsCount }}</p>
                     <p class="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">Projets</p>
                  </div>
                  <div class="p-6 bg-background rounded-2xl text-center border border-border transition-colors duration-300">
                     <p class="text-3xl font-black text-primary">{{ me.followersCount }}</p>
                     <p class="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">Followers</p>
                  </div>
               </div>
            </div>
         </div>

         <!-- Main Projects Section -->
         <div class="lg:col-span-8 space-y-8">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-black text-text flex items-center gap-3">
                <FolderOpen class="text-primary" :size="28" /> Mes Projets
              </h3>
              <button class="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                Voir tout <ArrowRight :size="16" />
              </button>
            </div>

            <div v-if="projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div v-for="project in projects" :key="project.title" class="group bg-surface rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col">
                <!-- ... -->
              </div>
            </div>
            <div v-else class="bg-surface rounded-3xl border-2 border-dashed border-border p-20 text-center">
              <div class="p-6 bg-primary/5 rounded-full w-fit mx-auto mb-6">
                <FolderOpen class="text-primary" :size="48" />
              </div>
              <h4 class="text-2xl font-black text-text mb-2">Votre portfolio est vide</h4>
              <p class="text-text-muted mb-8 max-w-md mx-auto">Présentez vos meilleures réalisations pour attirer l'attention des recruteurs et d'autres développeurs.</p>
              <button class="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                Ajouter mon premier projet
              </button>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>
