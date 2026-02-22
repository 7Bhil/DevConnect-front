<template>
  <div class="min-h-screen bg-background p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-text mb-8">Support</h1>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-surface rounded-xl p-6">
          <h2 class="text-xl font-semibold text-text mb-4">Contactez-nous</h2>
          <form @submit.prevent="submitSupport" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-text mb-2">Sujet</label>
              <select 
                v-model="support.subject" 
                class="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="technical">Problème technique</option>
                <option value="account">Problème de compte</option>
                <option value="feature">Demande de fonctionnalité</option>
                <option value="other">Autre</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-text mb-2">Message</label>
              <textarea 
                v-model="support.message" 
                rows="6" 
                class="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Décrivez votre problème ou demande..."
                required
              ></textarea>
            </div>
            
            <button 
              type="submit"
              :disabled="loading"
              class="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {{ loading ? 'Envoi en cours...' : 'Envoyer' }}
            </button>
          </form>
        </div>

        <div class="space-y-6">
          <div class="bg-surface rounded-xl p-6">
            <h2 class="text-xl font-semibold text-text mb-4">FAQ</h2>
            <div class="space-y-4">
              <div class="border-b border-border pb-4">
                <h3 class="font-medium text-text mb-2">Comment puis-je postuler à une offre ?</h3>
                <p class="text-sm text-text-muted">Cliquez sur une offre d'emploi et utilisez le bouton "Postuler". Remplissez le formulaire avec vos informations.</p>
              </div>
              <div class="border-b border-border pb-4">
                <h3 class="font-medium text-text mb-2">Puis-je modifier mon profil ?</h3>
                <p class="text-sm text-text-muted">Oui, allez dans la section "Mon Profil" pour modifier vos informations personnelles.</p>
              </div>
              <div class="pb-4">
                <h3 class="font-medium text-text mb-2">Comment puis-je publier un projet ?</h3>
                <p class="text-sm text-text-muted">Utilisez le bouton "Publier" dans la barre de navigation pour partager votre projet avec la communauté.</p>
              </div>
            </div>
          </div>

          <div class="bg-surface rounded-xl p-6">
            <h2 class="text-xl font-semibold text-text mb-4">Contact rapide</h2>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span class="text-primary font-semibold">📧</span>
                </div>
                <div>
                  <p class="font-medium text-text">Email</p>
                  <p class="text-sm text-text-muted">support@devconnect.com</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span class="text-primary font-semibold">💬</span>
                </div>
                <div>
                  <p class="font-medium text-text">Chat en direct</p>
                  <p class="text-sm text-text-muted">Disponible 9h-18h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)
const support = ref({
  subject: '',
  message: ''
})

const submitSupport = async () => {
  loading.value = true
  try {
    // Simuler l'envoi
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Votre demande a été envoyée avec succès!')
    support.value = { subject: '', message: '' }
  } catch (error) {
    alert('Erreur lors de l\'envoi de votre demande')
  } finally {
    loading.value = false
  }
}
</script>
