<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Loader2, ArrowRight, User, Briefcase, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('developer')
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.value, email: email.value, password: password.value, role: role.value })
    })
    
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Erreur lors de l\'inscription')
    
    router.push('/login')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-128px)] flex items-center justify-center p-6">
    <div class="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div class="text-center space-y-2">
        <h1 class="text-4xl font-black text-text tracking-tight">Rejoignez la communauté</h1>
        <p class="text-text-muted font-medium">Créez votre profil et connectez-vous avec les meilleurs.</p>
      </div>

      <div class="bg-surface p-8 rounded-3xl border border-border shadow-2xl shadow-text/5 space-y-6">
        <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-bold animate-in shake duration-300">
          <AlertCircle :size="18" />
          {{ error }}
        </div>

        <div class="flex p-1 bg-background rounded-2xl border border-border">
          <button 
            @click="role = 'developer'"
            :class="['flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2', role === 'developer' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text']"
          >
            <User :size="16" /> Développeur
          </button>
          <button 
            @click="role = 'recruiter'"
            :class="['flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2', role === 'recruiter' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text']"
          >
            <Briefcase :size="16" /> Recruteur
          </button>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="space-y-2">
            <label class="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Nom complet</label>
            <div class="relative">
              <User class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" :size="20" />
              <input 
                v-model="name"
                type="text" 
                required
                placeholder="Jean Dupont"
                class="w-full bg-background border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all outline-none"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Email professionnel</label>
            <div class="relative">
              <Mail class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" :size="20" />
              <input 
                v-model="email"
                type="email" 
                required
                placeholder="jean@entreprise.com"
                class="w-full bg-background border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all outline-none"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Mot de passe</label>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" :size="20" />
              <input 
                v-model="password"
                type="password" 
                required
                placeholder="Min. 8 caractères"
                class="w-full bg-background border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all outline-none"
              />
            </div>
          </div>

          <div class="flex items-start gap-3 px-1 pt-2">
            <input type="checkbox" required class="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary/20" />
            <p class="text-[10px] text-text-muted font-bold leading-tight uppercase tracking-wider">
              J'accepte les <a href="#" class="text-primary">conditions d'utilisation</a> et la <a href="#" class="text-primary">politique de confidentialité</a>.
            </p>
          </div>

          <button 
            type="submit"
            :disabled="loading"
            class="w-full bg-primary text-white py-4 rounded-xl font-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            <Loader2 v-if="loading" class="animate-spin" :size="20" />
            <span v-else>Créer mon compte</span>
            <ArrowRight v-if="!loading" :size="20" class="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>

      <p class="text-center text-sm font-medium text-text-muted">
        Déjà un compte ? 
        <router-link to="/login" class="text-primary font-black hover:underline cursor-pointer">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>
