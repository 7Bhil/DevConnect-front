<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Loader2, ArrowRight, Github, AlertCircle } from 'lucide-vue-next'
import { useAuth } from '../store/auth'

const router = useRouter()
const auth = useAuth()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Erreur lors de la connexion')
    
    auth.login(data.user, data.token)
    router.push('/')
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
        <h1 class="text-4xl font-black text-text tracking-tight">Bon retour parmi nous !</h1>
        <p class="text-text-muted font-medium">Connectez-vous pour continuer votre aventure.</p>
      </div>

      <div class="bg-surface p-8 rounded-3xl border border-border shadow-2xl shadow-text/5 space-y-6">
        <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-bold animate-in shake duration-300">
          <AlertCircle :size="18" />
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-2">
            <label class="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Email</label>
            <div class="relative">
              <Mail class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" :size="20" />
              <input 
                v-model="email"
                type="email" 
                required
                placeholder="nom@exemple.com"
                class="w-full bg-background border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all outline-none"
              />
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between px-1">
              <label class="text-xs font-black text-text-muted uppercase tracking-widest">Mot de passe</label>
              <a href="#" class="text-xs font-bold text-primary hover:underline">Oublié ?</a>
            </div>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" :size="20" />
              <input 
                v-model="password"
                type="password" 
                required
                placeholder="••••••••"
                class="w-full bg-background border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all outline-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            :disabled="loading"
            class="w-full bg-primary text-white py-4 rounded-xl font-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:scale-100"
          >
            <Loader2 v-if="loading" class="animate-spin" :size="20" />
            <span v-else>Se connecter</span>
            <ArrowRight v-if="!loading" :size="20" class="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div class="relative py-4">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-border"></div></div>
          <div class="relative flex justify-center text-xs uppercase"><span class="bg-surface px-4 text-text-muted font-bold">Ou continuer avec</span></div>
        </div>

        <button class="w-full bg-background border border-border py-4 rounded-xl font-bold text-text flex items-center justify-center gap-3 hover:bg-surface transition-all active:scale-95">
          <Github :size="20" />
          GitHub
        </button>
      </div>

      <p class="text-center text-sm font-medium text-text-muted">
        Pas encore de compte ? 
        <router-link to="/register" class="text-primary font-black hover:underline cursor-pointer">S'inscrire gratuitement</router-link>
      </p>
    </div>
  </div>
</template>
