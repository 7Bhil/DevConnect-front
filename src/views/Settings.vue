<template>
  <div class="min-h-screen bg-background p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-text mb-8">Paramètres</h1>
      
      <div class="bg-surface rounded-xl p-6 mb-6">
        <h2 class="text-xl font-semibold text-text mb-4">Profil</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-text mb-2">Nom</label>
            <input 
              v-model="profile.name" 
              type="text" 
              class="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-text mb-2">Email</label>
            <input 
              v-model="profile.email" 
              type="email" 
              class="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button 
            @click="updateProfile"
            class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sauvegarder
          </button>
        </div>
      </div>

      <div class="bg-surface rounded-xl p-6">
        <h2 class="text-xl font-semibold text-text mb-4">Apparence</h2>
        <div class="flex items-center justify-between">
          <span class="text-text">Mode sombre</span>
          <button 
            @click="toggleTheme"
            class="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            :class="{ 'bg-primary': isDark }"
          >
            <span 
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="{ 'translate-x-6': isDark, 'translate-x-1': !isDark }"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../store/auth'
import { updateProfile as updateProfileAPI } from '../api'

const auth = useAuth()
const profile = ref({ name: '', email: '' })
const isDark = ref(false)

onMounted(() => {
  if (auth.state.user) {
    profile.value = { ...auth.state.user }
  }
  isDark.value = document.documentElement.classList.contains('dark')
})

const updateProfile = async () => {
  try {
    await updateProfileAPI(profile.value)
    auth.state.user = { ...auth.state.user, ...profile.value }
    alert('Profil mis à jour avec succès!')
  } catch (error) {
    alert('Erreur lors de la mise à jour du profil')
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
</script>
