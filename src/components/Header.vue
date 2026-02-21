<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, PlusCircle, Bell, User, LogOut, Sun, Moon, LogIn, X, MessageCircle, Briefcase } from 'lucide-vue-next'
import { useAuth } from '../store/auth'
import { globalSearch } from '../api'

const router = useRouter()
const auth = useAuth()
const showNotifications = ref(false)
const notificationCount = ref(0)
const notifications = ref([])

// Load notifications from API
const loadNotifications = async () => {
  try {
    // For now, we'll use mock data but structure for real API
    const mockNotifications = [
      {
        id: 1,
        type: 'message',
        title: 'Nouveau message',
        message: 'Jean Dupont vous a envoyé un message concernant votre projet React.',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5)
      },
      {
        id: 2,
        type: 'project',
        title: 'Projet mis en avant',
        message: 'Votre projet "Dashboard Analytics" a été ajouté aux projets vedettes.',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60)
      },
      {
        id: 3,
        type: 'job',
        title: 'Nouvelle offre d\'emploi',
        message: 'Une offre correspondant à "Développeur React" a été publiée.',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
      }
    ]
    
    notifications.value = mockNotifications
    notificationCount.value = mockNotifications.filter(n => !n.read).length
  } catch (error) {
    console.error('Error loading notifications:', error)
  }
}

// Load notifications on mount
onMounted(() => {
  loadNotifications()
})
const isDark = ref(document.documentElement.classList.contains('dark'))
const searchQuery = ref('')
const showSearchResults = ref(false)
const searchResults = ref({ projects: [], talents: [], jobs: [] })
const searchLoading = ref(false)

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
  showProfileMenu.value = false
  router.push('/login')
}

// Search functionality
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    showSearchResults.value = false
    return
  }
  
  searchLoading.value = true
  try {
    searchResults.value = await globalSearch(searchQuery.value)
    showSearchResults.value = true
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    searchLoading.value = false
  }
}

// Watch search query with debounce
let searchTimeout
watch(searchQuery, (newValue) => {
  clearTimeout(searchTimeout)
  if (newValue.trim().length >= 2) {
    searchTimeout = setTimeout(handleSearch, 300)
  } else {
    showSearchResults.value = false
  }
})

// Close search results when clicking outside
const handleClickOutside = () => {
  showSearchResults.value = false
}

// Navigate to search results
const goToResults = (type, item) => {
  showSearchResults.value = false
  searchQuery.value = ''
  
  if (type === 'projects') {
    router.push(`/projects/${item._id || item.id}`)
  } else if (type === 'talents') {
    router.push(`/talents`)
  } else if (type === 'jobs') {
    router.push(`/jobs`)
  }
}

const goToAllResults = () => {
  showSearchResults.value = false
  router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
}

// Notification functions
const getNotificationIcon = (type) => {
  switch (type) {
    case 'message': return MessageCircle
    case 'project': return Briefcase
    case 'job': return User
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

const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification && !notification.read) {
    notification.read = true
    notificationCount.value = Math.max(0, notificationCount.value - 1)
    
    // Here you would also call API to mark as read
    // await markNotificationAsRead(id)
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
  <header class="h-16 bg-surface border-b border-border flex items-center justify-between px-8 sticky top-0 z-30 transition-colors duration-300">
    <div class="flex-1 max-w-xl relative">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" :size="18" />
        <input 
          v-model="searchQuery"
          @focus="handleSearch"
          @clickoutside="handleClickOutside"
          type="text" 
          placeholder="Rechercher des projets, développeurs ou compétences..." 
          class="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text placeholder:text-text-muted transition-colors"
        />
        
        <!-- Search Results Dropdown -->
        <div 
          v-if="showSearchResults && (searchResults.projects.length > 0 || searchResults.talents.length > 0 || searchResults.jobs.length > 0)"
          class="absolute top-full mt-2 w-full bg-surface border border-border rounded-2xl shadow-2xl shadow-text/10 z-50 max-h-96 overflow-y-auto"
        >
          <div class="p-4">
            <!-- Projects Section -->
            <div v-if="searchResults.projects.length > 0" class="mb-4">
              <h3 class="text-xs font-black text-text-muted uppercase tracking-widest mb-2">Projets</h3>
              <div class="space-y-2">
                <div 
                  v-for="project in searchResults.projects.slice(0, 3)" 
                  :key="project._id || project.id"
                  @click="goToResults('projects', project)"
                  class="p-3 rounded-xl bg-background hover:bg-surface cursor-pointer transition-colors"
                >
                  <h4 class="font-bold text-text text-sm">{{ project.title }}</h4>
                  <p class="text-xs text-text-muted truncate">{{ project.description }}</p>
                </div>
              </div>
            </div>
            
            <!-- Talents Section -->
            <div v-if="searchResults.talents.length > 0" class="mb-4">
              <h3 class="text-xs font-black text-text-muted uppercase tracking-widest mb-2">Talents</h3>
              <div class="space-y-2">
                <div 
                  v-for="talent in searchResults.talents.slice(0, 3)" 
                  :key="talent._id || talent.id"
                  @click="goToResults('talents', talent)"
                  class="p-3 rounded-xl bg-background hover:bg-surface cursor-pointer transition-colors"
                >
                  <h4 class="font-bold text-text text-sm">{{ talent.name }}</h4>
                  <p class="text-xs text-text-muted">{{ talent.skills?.slice(0, 3).join(', ') }}</p>
                </div>
              </div>
            </div>
            
            <!-- Jobs Section -->
            <div v-if="searchResults.jobs.length > 0" class="mb-4">
              <h3 class="text-xs font-black text-text-muted uppercase tracking-widest mb-2">Offres d'emploi</h3>
              <div class="space-y-2">
                <div 
                  v-for="job in searchResults.jobs.slice(0, 3)" 
                  :key="job._id || job.id"
                  @click="goToResults('jobs', job)"
                  class="p-3 rounded-xl bg-background hover:bg-surface cursor-pointer transition-colors"
                >
                  <h4 class="font-bold text-text text-sm">{{ job.title }}</h4>
                  <p class="text-xs text-text-muted">{{ job.company }} • {{ job.location }}</p>
                </div>
              </div>
            </div>
            
            <!-- View All Results -->
            <button 
              @click="goToAllResults"
              class="w-full py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              Voir tous les résultats
            </button>
          </div>
        </div>
        
        <!-- Loading Indicator -->
        <div v-if="searchLoading" class="absolute right-3 top-1/2 -translate-y-1/2">
          <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <!-- Theme Toggle -->
      <button 
        @click="toggleTheme"
        class="p-2 text-text-muted hover:bg-primary/5 rounded-full transition-colors"
        aria-label="Toggle theme"
      >
        <Sun v-if="isDark" :size="20" />
        <Moon v-else :size="20" />
      </button>

      <!-- Notifications -->
      <div class="relative">
        <button 
          @click="showNotifications = !showNotifications"
          class="p-2 text-text-muted hover:bg-primary/5 rounded-full transition-colors relative"
          aria-label="Notifications"
        >
          <Bell :size="20" />
          <!-- Notification Badge -->
          <span 
            v-if="notificationCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse"
          >
            {{ notificationCount > 99 ? '99+' : notificationCount }}
          </span>
        </button>
        
        <!-- Notifications Dropdown -->
        <div 
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
                :key="notification.id"
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
            <button class="w-full py-2 bg-background text-text rounded-xl text-sm font-bold hover:bg-surface transition-colors">
              Voir toutes les notifications
            </button>
          </div>
        </div>
      </div>

      <template v-if="auth.state.isAuthenticated">
        <router-link to="/publish" class="hidden sm:flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-md shadow-primary/10">
          <PlusCircle :size="18" />
          Publier
        </router-link>

        <div class="w-px h-6 bg-border mx-2"></div>

        <div class="relative">
          <button 
            @click="showProfileMenu = !showProfileMenu"
            class="flex items-center gap-3 p-1 rounded-full hover:bg-primary/5 transition-colors"
          >
            <div class="text-right hidden sm:block">
              <p class="text-xs font-bold text-text leading-tight">{{ auth.state.user?.name }}</p>
              <p class="text-[10px] text-text-muted font-medium uppercase tracking-wider">{{ auth.state.user?.role }}</p>
            </div>
            <img :src="auth.state.user?.avatar || 'https://ui-avatars.com/api/?name=U&background=7f9cf5&color=fff&size=200'" class="w-9 h-9 rounded-full border-2 border-primary/20" alt="Avatar" />
          </button>
          
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div v-if="showProfileMenu" class="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-xl border border-border p-2 z-50">
              <router-link to="/profile" @click="showProfileMenu = false" class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text hover:bg-primary/5 transition-colors">
                <User :size="16" /> Mon Profil
              </router-link>
              <button @click="handleLogout" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/5 transition-colors">
                <LogOut :size="16" /> Déconnexion
              </button>
            </div>
          </transition>
        </div>
      </template>

      <template v-else>
        <div class="flex items-center gap-2">
          <router-link to="/login" class="text-sm font-bold text-text-muted hover:text-primary px-4 py-2 transition-colors flex items-center gap-2">
            <LogIn :size="18" />
            Connexion
          </router-link>
          <router-link to="/register" class="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-black hover:scale-105 transition-all shadow-lg shadow-primary/20">
            S'inscrire
          </router-link>
        </div>
      </template>
    </div>
  </header>
</template>
