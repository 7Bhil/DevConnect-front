<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Loader2, ArrowRight, User, Briefcase, AlertCircle, CheckCircle, Globe, Phone, Linkedin } from 'lucide-vue-next'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// Étape 1: Informations de base
const step = ref(1)
const role = ref('developer')

// Étape 2: Informations de contact
const country = ref('')
const whatsapp = ref('')
const linkedin = ref('')

// Étape 3: Type de contrat (optionnel)
const contractType = ref('')

const handleNextStep = () => {
  if (step.value === 1) {
    if (!name.value || !email.value || !password.value) {
      error.value = 'Veuillez remplir tous les champs'
      return
    }
    step.value = 2
    error.value = ''
  } else if (step.value === 2) {
    if (!country.value || !whatsapp.value || !linkedin.value) {
      error.value = 'Veuillez remplir tous les champs de contact'
      return
    }
    step.value = 3
    error.value = ''
  } else if (step.value === 3) {
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
        role: role.value,
        country: country.value,
        whatsapp: whatsapp.value,
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

      <div class="bg-surface p-8 rounded-3xl border border-border shadow-2xl shadow-text/5 space-y-6">
        <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-bold animate-in shake duration-300">
          <AlertCircle :size="18" />
          {{ error }}
        </div>

        <!-- Étape 1: Informations de base -->
        <div v-if="step === 1" class="space-y-4">
          <div class="text-center mb-6">
            <h2 class="text-xl font-black text-text mb-2">Informations de base</h2>
            <p class="text-sm text-text-muted">Commençons par les essentiels</p>
          </div>
          
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
                placeholder="jean@exemple.com"
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
              <select 
                v-model="country"
                required
                class="w-full bg-background border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all outline-none appearance-none"
              >
                <option value="">Sélectionnez votre pays</option>
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Canada">Canada</option>
                <option value="Maroc">Maroc</option>
                <option value="Tunisie">Tunisie</option>
                <option value="Algérie">Algérie</option>
                <option value="Sénégal">Sénégal</option>
                <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-black text-text-muted uppercase tracking-widest ml-1">WhatsApp (avec indicatif)</label>
            <div class="relative">
              <Phone class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" :size="20" />
              <input 
                v-model="whatsapp"
                type="tel"
                required
                placeholder="+33 6 12 34 56 78"
                class="w-full bg-background border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all outline-none"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-black text-text-muted uppercase tracking-widest ml-1">LinkedIn</label>
            <div class="relative">
              <Linkedin class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" :size="20" />
              <input 
                v-model="linkedin"
                type="url"
                required
                placeholder="https://linkedin.com/in/votre-profil"
                class="w-full bg-background border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all outline-none"
              />
            </div>
          </div>
        </div>

        <!-- Étape 3: Type de contrat (optionnel) -->
        <div v-if="step === 3" class="space-y-4">
          <div class="text-center mb-6">
            <h2 class="text-xl font-black text-text mb-2">Type de contrat souhaité</h2>
            <p class="text-sm text-text-muted">Quel type de contrat vous intéresse ? (Optionnel)</p>
          </div>
          
          <div class="grid grid-cols-2 gap-3">
            <button 
              v-for="type in ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance']"
              :key="type"
              @click="contractType = type"
              :class="[
                'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                contractType === type 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border bg-background text-text hover:border-primary/50'
              ]"
            >
              <Briefcase :size="24" />
              <span class="font-bold text-sm">{{ type }}</span>
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex items-center justify-between pt-4">
          <button 
            v-if="step > 1"
            @click="step--"
            class="text-text-muted hover:text-primary transition-colors font-medium"
          >
            Retour
          </button>
          
          <div class="flex-1"></div>
          
          <button 
            @click="handleNextStep"
            :disabled="loading"
            class="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-black hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="animate-spin">
              <Loader2 :size="18" />
            </span>
            <span v-else-if="step < 3">
              Continuer
              <ArrowRight :size="18" />
            </span>
            <span v-else>
              S'inscrire
              <CheckCircle :size="18" />
            </span>
          </button>
        </div>
      </div>

      <div class="text-center">
        <p class="text-sm text-text-muted">
          Déjà un compte ? 
          <router-link to="/login" class="text-primary hover:text-primary/80 font-bold">
            Se connecter
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>
