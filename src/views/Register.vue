<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Loader2, ArrowRight, User, Briefcase, AlertCircle, CheckCircle, Globe, Phone, Linkedin, Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// Étape 1: Informations de base
const step = ref(1)
const role = ref('developer')

// Étape 2: Informations de contact
const country = ref('')
const phoneIndicatif = ref('+33')
const phoneNumber = ref('')
const linkedin = ref('')

// Étape 3: Type de contrat (optionnel)
const contractType = ref('')

// Rôle final déterminé
const finalRole = ref('')

const handleNextStep = () => {
  if (step.value === 1) {
    if (!name.value || !email.value || !password.value) {
      error.value = 'Veuillez remplir tous les champs'
      return
    }
    step.value = 2
    error.value = ''
  } else if (step.value === 2) {
    if (!country.value || !phoneIndicatif.value || !phoneNumber.value) {
      error.value = 'Veuillez remplir les champs obligatoires'
      return
    }
    step.value = 3
    error.value = ''
  } else if (step.value === 3) {
    finalRole.value = 'developer'
    handleRegister()
  }
}

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: name.value, 
        email: email.value, 
        password: password.value, 
        role: finalRole.value || 'developer',
        country: country.value,
        whatsapp: phoneIndicatif.value + ' ' + phoneNumber.value,
        linkedin: linkedin.value,
        contractType: contractType.value
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      error.value = data.message || 'Erreur lors de l\'inscription'
      return
    }
    
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    router.push('/')
  } catch (err) {
    error.value = 'Erreur de connexion au serveur'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  if (step.value > 1) {
    step.value--
    error.value = ''
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-128px)] flex items-center justify-center p-6">
    <div class="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div class="text-center space-y-2">
        <h1 class="text-4xl font-black text-text tracking-tight">Rejoignez la communauté</h1>
        <p class="text-text-muted font-medium">Créez votre profil et connectez-vous avec les meilleurs.</p>
        <!-- Progress indicator -->
        <div class="flex items-center justify-center gap-2 mt-6">
          <div 
            v-for="i in 3" 
            :key="i"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="{
              'bg-primary w-8': step >= i,
              'bg-border': step < i
            }"
          />
        </div>
      </div>

      <div class="bg-surface p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border shadow-2xl shadow-text/5 space-y-6">
        <div v-if="error" class="p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-xs sm:text-sm font-bold animate-in shake duration-300">
          <AlertCircle :size="16" class="sm:w-4 sm:h-4" />
          {{ error }}
        </div>

        <!-- Étape 1: Informations de base -->
        <div v-if="step === 1" class="space-y-4">
          <div class="text-center mb-4 sm:mb-6">
            <h2 class="text-lg sm:text-xl font-black text-text mb-2">Informations de base</h2>
            <p class="text-xs sm:text-sm text-text-muted">Commençons par les essentiels</p>
          </div>
          
          <div class="space-y-2">
            <label class="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Nom complet</label>
            <div class="relative">
              <User class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 sm:w-5 sm:h-5" :size="20" />
              <input 
                v-model="name"
                type="text" 
                required
                placeholder="Jean Dupont"
                class="w-full bg-background border-border rounded-xl py-3 sm:py-4 pl-10 sm:pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all outline-none"
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
                :type="showPassword ? 'text' : 'password'" 
                required
                placeholder="Min. 8 caractères"
                class="w-full bg-background border-border rounded-xl py-4 pl-12 pr-12 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all outline-none"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
              >
                <Eye v-if="!showPassword" :size="20" />
                <EyeOff v-else :size="20" />
              </button>
            </div>
          </div>
        </div>

        <!-- Étape 2: Informations de contact -->
        <div v-if="step === 2" class="space-y-4">
          <div class="text-center mb-6">
            <h2 class="text-xl font-black text-text mb-2">Informations de contact</h2>
            <p class="text-sm text-text-muted">Restons en contact facilement</p>
          </div>
          
          <div class="space-y-2">
            <label class="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Pays</label>
            <div class="relative">
              <Globe class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" :size="20" />
              <input 
                v-model="country"
                type="text"
                required
                placeholder="France, Belgique, Suisse..."
                class="w-full bg-background border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all outline-none"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-black text-text-muted uppercase tracking-widest ml-1">WhatsApp</label>
            <div class="flex gap-2">
              <div class="relative flex-1 max-w-[100px]">
                <Phone class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" :size="18" />
                <input 
                  v-model="phoneIndicatif"
                  type="text"
                  required
                  placeholder="+33"
                  class="w-full bg-background border-border rounded-xl py-4 pl-9 pr-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all outline-none"
                />
              </div>
              <div class="relative flex-1">
                <input 
                  v-model="phoneNumber"
                  type="tel"
                  required
                  placeholder="6 12 34 56 78"
                  class="w-full bg-background border-border rounded-xl py-4 pl-4 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-black text-text-muted uppercase tracking-widest ml-1">LinkedIn (optionnel)</label>
            <div class="relative">
              <Linkedin class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" :size="20" />
              <input 
                v-model="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/votre-profil"
                class="w-full bg-background border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all outline-none"
              />
            </div>
          </div>
        </div>

        <!-- Étape 3: Type de contrat -->
        <div v-if="step === 3" class="space-y-4">
          <div class="text-center mb-6">
            <h2 class="text-xl font-black text-text mb-2">Type de contrat souhaité</h2>
            <p class="text-sm text-text-muted">Quel type de contrat vous intéresse ? (Optionnel)</p>
          </div>
          
          <div class="space-y-3">
            <label 
              v-for="type in ['N\'importe quel contrat', 'CDI', 'CDD', 'Freelance', 'Stage', 'Alternance', 'Aucun']" 
              :key="type"
              class="flex items-center gap-4 p-4 rounded-xl border-2 border-border bg-background cursor-pointer hover:border-primary/50 transition-all"
              :class="{ 'border-primary bg-primary/10': contractType === type }"
            >
              <input 
                v-model="contractType" 
                :value="type" 
                type="radio" 
                class="w-5 h-5 text-primary focus:ring-primary/20"
              />
              <span class="font-bold text-text">{{ type }}</span>
            </label>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex gap-3 pt-4">
          <button 
            v-if="step > 1"
            @click="goBack"
            :disabled="loading"
            class="flex-1 py-4 bg-background border border-border text-text rounded-xl font-bold hover:bg-surface transition-all disabled:opacity-50"
          >
            Retour
          </button>
          
          <button 
            @click="handleNextStep"
            :disabled="loading"
            class="flex-1 bg-primary text-white py-4 rounded-xl font-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            <Loader2 v-if="loading" class="animate-spin" :size="20" />
            <span v-else>{{ step === 3 ? 'Créer mon compte' : 'Continuer' }}</span>
            <ArrowRight v-if="!loading && step < 3" :size="20" class="group-hover:translate-x-1 transition-transform" />
            <CheckCircle v-else-if="!loading && step === 3" :size="20" />
          </button>
        </div>

        <!-- Bouton pour passer l'étape 3 (optionnel) -->
        <div v-if="step === 3" class="mt-3">
          <button 
            @click="handleRegister"
            :disabled="loading"
            class="w-full py-3 bg-background border border-border text-text-muted rounded-xl font-bold hover:bg-surface transition-all text-sm disabled:opacity-50"
          >
            Passer cette étape et créer mon compte
          </button>
        </div>

        <!-- Conditions uniquement à l'étape 1 -->
        <div v-if="step === 1" class="flex items-start gap-3 px-1 pt-2">
          <input type="checkbox" required class="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary/20" />
          <p class="text-[10px] text-text-muted font-bold leading-tight uppercase tracking-wider">
            J'accepte les <a href="#" class="text-primary">conditions d'utilisation</a> et la <a href="#" class="text-primary">politique de confidentialité</a>.
          </p>
        </div>
      </div>

      <p class="text-center text-sm font-medium text-text-muted">
        Déjà un compte ? 
        <router-link to="/login" class="text-primary font-black hover:underline cursor-pointer">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>
