<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Plus, 
  Image as ImageIcon, 
  Terminal, 
  Globe, 
  Github, 
  ArrowRight,
  Sparkles,
  Layout,
  Code2,
  Rocket
} from 'lucide-vue-next'

import { createProject } from '../api'
import { useAuth } from '../store/auth'

const router = useRouter()
const auth = useAuth()

const form = ref({
  title: '',
  description: '',
  tags: '',
  githubUrl: '',
  demoUrl: '',
  image: null
})

const isSubmitting = ref(false)

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = async () => {
  if (!form.value.title || !form.value.description) return
  
  isSubmitting.value = true
  try {
    await createProject(form.value, auth.state.token)
    router.push('/')
  } catch (error) {
    console.error('Erreur lors de la publication:', error)
    alert('Erreur lors de la publication du projet')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div class="flex items-center gap-4 mb-8">
      <div class="p-3 bg-primary/10 rounded-2xl text-primary shadow-lg shadow-primary/5">
        <Rocket :size="32" />
      </div>
      <div>
        <h1 class="text-4xl font-black text-text tracking-tight">Publier un Projet</h1>
        <p class="text-text-muted font-medium">Partagez votre travail avec la communauté DevConnect.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form Content -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-surface rounded-3xl p-8 border border-border shadow-xl shadow-text/5 space-y-6">
          <!-- Title -->
          <div class="space-y-2">
            <label class="text-xs font-black text-text-muted uppercase tracking-widest pl-1">Nom du projet</label>
            <div class="relative group">
              <Layout class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" :size="20" />
              <input 
                v-model="form.title"
                type="text" 
                placeholder="Ex: Mon Super Dashboard"
                class="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary text-text transition-all outline-none"
              />
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <label class="text-xs font-black text-text-muted uppercase tracking-widest pl-1">Description</label>
            <textarea 
              v-model="form.description"
              rows="4"
              placeholder="Décrivez votre projet, les défis relevés..."
              class="w-full bg-background border border-border rounded-2xl p-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary text-text transition-all outline-none resize-none"
            ></textarea>
          </div>

          <!-- Links -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-xs font-black text-text-muted uppercase tracking-widest pl-1">Lien GitHub</label>
              <div class="relative group">
                <Github class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" :size="18" />
                <input 
                  v-model="form.githubUrl"
                  type="url" 
                  placeholder="https://github.com/..."
                  class="w-full bg-background border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary text-text transition-all outline-none"
                />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-black text-text-muted uppercase tracking-widest pl-1">Démo Live</label>
              <div class="relative group">
                <Globe class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" :size="18" />
                <input 
                  v-model="form.demoUrl"
                  type="url" 
                  placeholder="https://mon-projet.com"
                  class="w-full bg-background border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary text-text transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div class="space-y-2">
             <label class="text-xs font-black text-text-muted uppercase tracking-widest pl-1">Technologies (séparées par des virgules)</label>
             <div class="relative group">
                <Code2 class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" :size="20" />
                <input 
                  v-model="form.tags"
                  type="text" 
                  placeholder="Vue, Tailwind, Node.js..."
                  class="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary text-text transition-all outline-none"
                />
             </div>
          </div>
        </div>
      </div>

      <!-- Preview & Image -->
      <div class="space-y-6">
        <div class="bg-surface rounded-3xl p-6 border border-border shadow-xl shadow-text/5 text-center">
          <label class="text-xs font-black text-text-muted uppercase tracking-widest block mb-4">Capture d'écran</label>
          <div 
            class="aspect-video bg-background border-2 border-dashed border-border rounded-2xl overflow-hidden relative group cursor-pointer hover:border-primary/50 transition-all"
            @click="$refs.fileInput.click()"
          >
            <div v-if="!form.image" class="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-2">
              <div class="p-3 bg-primary/5 rounded-full text-primary group-hover:scale-110 transition-transform">
                <Plus :size="24" />
              </div>
              <p class="text-xs font-bold text-text-muted">Cliquez pour uploader une image</p>
            </div>
            <img v-else :src="form.image" class="w-full h-full object-cover" />
            <input 
              ref="fileInput"
              type="file" 
              class="hidden" 
              accept="image/*"
              @change="handleImageUpload"
            />
          </div>
          <p class="text-[10px] text-text-muted mt-3 italic font-medium">Recommandé : 1200x675px (16:9)</p>
        </div>

        <div class="bg-primary/5 rounded-3xl p-6 border border-primary/20 space-y-4">
           <div class="flex items-center gap-2 text-primary">
             <Sparkles :size="18" />
             <span class="text-xs font-black uppercase tracking-widest">Conseils Pro</span>
           </div>
           <ul class="space-y-3">
             <li v-for="tip in [
               'Utilisez un titre accrocheur',
               'Ajoutez un lien vers le repo GitHub',
               'N\'oubliez pas la démo live !'
             ]" :key="tip" class="flex items-center gap-2 text-xs font-bold text-text-muted">
               <div class="w-1.5 h-1.5 bg-primary rounded-full"></div>
               {{ tip }}
             </li>
           </ul>
        </div>

        <button 
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          <span v-if="!isSubmitting">Lancer le Projet</span>
          <span v-else class="flex items-center gap-2">
            <span class="w-2 h-2 bg-white rounded-full animate-bounce"></span>
            <span class="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span class="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </span>
          <ArrowRight v-if="!isSubmitting" :size="20" />
        </button>
      </div>
    </div>
  </div>
</template>
