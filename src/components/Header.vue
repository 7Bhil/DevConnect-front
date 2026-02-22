<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { PlusCircle, Bell, User, Sun, Moon, LogIn, X, Briefcase, LogOut, Settings } from 'lucide-vue-next'
import { useAuth } from '../store/auth'
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  getUnreadNotificationsCount
} from '../api'

const router = useRouter()
const auth = useAuth()
const showProfileMenu = ref(false)
const showNotifications = ref(false)
const notifications = ref([])
const notificationCount = ref(0)
const isDark = ref(document.documentElement.classList.contains('dark'))
const tokenInvalid = ref(false) // Flag pour éviter les appels répétés

// Watcher pour détecter les changements d'authentification
watch(() => auth.state.isAuthenticated, (newValue) => {
  console.log('Auth state changed:', newValue)
}, { immediate: true })

// Watcher pour les changements de route
watch(() => router.currentRoute.value, () => {
  auth.syncWithStorage()
})

// Synchroniser au montage du composant
onMounted(() => {
  auth.syncWithStorage()
  
  // Désactiver temporairement le chargement des notifications
  // TODO: Réactiver quand le token sera valide
  console.log('Notifications désactivées temporairement')
  
  // Vérifier si le token est valide en testant une requête simple
  // if (auth.state.isAuthenticated) {
  //   testTokenValidity()
  // } else {
  //   loadNotifications()
  //   loadUnreadCount()
  // }
})

// Test si le token est valide
const testTokenValidity = async () => {
  try {
    await getUnreadNotificationsCount()
    loadNotifications()
    loadUnreadCount()
  } catch (error) {
    console.log('Token invalide, déconnexion forcée...')
    tokenInvalid.value = true // Marquer le token comme invalide
    auth.logout()
    router.push('/login')
    return // Arrêter l'exécution
  }
}

// Load notifications from API
const loadNotifications = async () => {
  if (tokenInvalid.value) return // Ne pas appeler si token invalide
  
  try {
    if (!auth.state.isAuthenticated) {
      notifications.value = []
      notificationCount.value = 0
      return
    }

    const data = await fetchNotifications()
    notifications.value = data.notifications
    notificationCount.value = data.unreadCount
  } catch (error) {
    console.error('Error loading notifications:', error)
    // Vérifier si c'est une erreur 401
    if (error.message.includes('401') || 
        error.message.includes('Unauthorized') ||
        error.message.includes('Failed to fetch')) {
      tokenInvalid.value = true
      auth.logout()
      router.push('/login')
      return
    }
    notifications.value = []
    notificationCount.value = 0
  }
}

// Load unread count
const loadUnreadCount = async () => {
  if (tokenInvalid.value) return // Ne pas appeler si token invalide
  
  try {
    if (!auth.state.isAuthenticated) return
    
    const data = await getUnreadNotificationsCount()
    notificationCount.value = data.count
  } catch (error) {
    console.error('Error loading unread count:', error)
    // Vérifier si c'est une erreur 401
    if (error.message.includes('401') || 
        error.message.includes('Unauthorized') ||
        error.message.includes('Failed to fetch')) {
      tokenInvalid.value = true
      auth.logout()
      router.push('/login')
      return
    }
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}

// Notification functions
const getNotificationIcon = (type) => {
  switch (type) {
    case 'project': return Briefcase
    case 'job': return User
    case 'application': return Briefcase
    default: return Bell
  }
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`
  if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`
  return `Il y a ${days} jour${days > 1 ? 's' : ''}`
}

const markAsRead = async (id) => {
  try {
    const notification = notifications.value.find(n => n._id === id)
    if (notification && !notification.read) {
      await markNotificationAsRead(id)
      notification.read = true
      notificationCount.value = Math.max(0, notificationCount.value - 1)
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

const markAllAsRead = async () => {
  try {
    await markAllNotificationsAsRead()
    notifications.value.forEach(n => n.read = true)
    notificationCount.value = 0
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
  }
}

// Add new notification (for real-time updates)
const addNotification = (notification) => {
  notifications.value.unshift({
    ...notification,
    id: Date.now(),
    read: false,
    createdAt: new Date()
  })
  notificationCount.value++
}
</script>

<template>
  <header class="h-16 bg-surface border-b border-border flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 transition-colors duration-300">
    <!-- Left side - Logo or empty space -->
    <div class="flex-1"></div>
    
    <!-- Right side - Actions -->
    <div class="flex items-center gap-2 sm:gap-4">
      <!-- Theme Toggle -->
      <button 
        @click="toggleTheme"
        class="p-2 text-text-muted hover:bg-primary/5 rounded-full transition-colors"
        aria-label="Toggle theme"
      >
        <Sun v-if="isDark" :size="20" />
        <Moon v-else :size="20" />
      </button>

      <!-- Notifications (désactivées temporairement) -->
      <div class="relative">
        <button 
          class="p-2 text-text-muted hover:bg-primary/5 rounded-full transition-colors relative"
          aria-label="Notifications"
          title="Notifications désactivées temporairement"
        >
          <Bell :size="20" />
          <!-- Badge masqué temporairement -->
          <!-- <span 
            v-if="notificationCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse"
          >
            {{ notificationCount > 99 ? '99+' : notificationCount }}
          </span> -->
        </button>
        
        <!-- Dropdown masqué temporairement -->
        <!-- <div 
          v-if="showNotifications"
          class="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-2xl shadow-2xl shadow-text/10 z-50"
        >
          <div class="p-4 border-b border-border">
            <h3 class="font-black text-text">Notifications</h3>
            <p class="text-xs text-text-muted">{{ notificationCount }} non lue{{ notificationCount > 1 ? 's' : '' }}</p>
          </div>
          
          <div class="max-h-96 overflow-y-auto">
            <div v-if="notifications.length === 0" class="p-8 text-center">
              <div class="w-12 h-12 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell :size="24" class="text-text-muted opacity-50" />
              </div>
              <p class="text-sm text-text-muted">Aucune notification</p>
            </div>
            
            <div v-else class="divide-y divide-border">
              <div 
                v-for="notification in notifications.slice(0, 5)" 
                :key="notification._id"
                @click="markAsRead(notification._id)"
                class="p-4 hover:bg-background transition-colors cursor-pointer"
                :class="{ 'bg-primary/5': !notification.read }"
              >
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <component :is="getNotificationIcon(notification.type)" :size="16" class="text-primary" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-text">{{ notification.title }}</p>
                    <p class="text-xs text-text-muted mt-1">{{ notification.message }}</p>
                    <p class="text-xs text-text-muted mt-2">{{ formatTime(notification.createdAt) }}</p>
                  </div>
                  <div v-if="!notification.read" class="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-4 border-t border-border">
            <div class="flex gap-2">
              <button 
                v-if="notificationCount > 0"
                @click="markAllAsRead"
                class="flex-1 py-2 bg-background text-text rounded-xl text-sm font-bold hover:bg-surface transition-colors"
              >
                Marquer tout comme lu
              </button>
              <button class="flex-1 py-2 bg-background text-text rounded-xl text-sm font-bold hover:bg-surface transition-colors">
                Voir toutes les notifications
              </button>
            </div>
          </div>
        </div> -->
      </div>

      <template v-if="auth.state.isAuthenticated">
        <router-link to="/publish" class="hidden sm:flex items-center gap-2 bg-primary text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold hover:scale-105 transition-all shadow-md shadow-primary/10">
          <PlusCircle :size="16" class="sm:w-4 sm:h-4" />
          <span class="hidden sm:inline">Publier</span>
        </router-link>

        <div class="hidden sm:block w-px h-6 bg-border mx-2"></div>

        <div class="relative">
          <button 
            @click="showProfileMenu = !showProfileMenu"
            aria-label="Profile menu"
            class="flex items-center gap-2 sm:gap-3 p-1 rounded-full hover:bg-primary/5 transition-colors"
          >
            <img 
              :src="auth.state.user?.avatar || `https://ui-avatars.com/api/?name=${auth.state.user?.name || 'U'}&background=45b7d1&color=fff&size=200&font-size=100&bold=true`" 
              :alt="auth.state.user?.name"
              class="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
            />
            <span class="hidden sm:block text-sm font-medium text-text">{{ auth.state.user?.name }}</span>
          </button>
          
          <!-- Profile Dropdown -->
          <div 
            v-if="showProfileMenu"
            class="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-2xl shadow-2xl shadow-text/10 z-50"
          >
            <div class="p-2">
              <router-link 
                to="/profile"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 transition-colors text-text"
                @click="showProfileMenu = false"
              >
                <User :size="18" />
                <span>Mon Profil</span>
              </router-link>
              
              <router-link 
                to="/settings"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 transition-colors text-text"
                @click="showProfileMenu = false"
              >
                <Settings :size="18" />
                <span>Paramètres</span>
              </router-link>
              
              <hr class="my-2 border-border">
              
              <button 
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-5 hover:text-red-500 transition-colors text-text"
              >
                <LogOut :size="18" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="flex items-center gap-1 sm:gap-2">
          <router-link to="/login" class="text-xs sm:text-sm font-bold text-text-muted hover:text-primary px-2 sm:px-4 py-2 transition-colors flex items-center gap-1 sm:gap-2">
            <LogIn :size="14" class="sm:w-4 sm:h-4" />
            <span class="hidden xs:inline">Connexion</span>
          </router-link>
          <router-link to="/register" class="bg-primary text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black hover:scale-105 transition-all shadow-lg shadow-primary/20">
            <span class="hidden xs:inline">S'inscrire</span>
            <span class="xs:hidden">+</span>
          </router-link>
        </div>
      </template>
    </div>
  </header>
</template>
