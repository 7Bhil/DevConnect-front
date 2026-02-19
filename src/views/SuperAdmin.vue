<script setup>
import { onMounted, ref } from 'vue'
import { Users, Briefcase, Activity, ShieldAlert, ChevronRight, UserMinus } from 'lucide-vue-next'
import { useAuth } from '../store/auth'

const auth = useAuth()
const stats = ref({ users: 0, jobs: 0, developers: 0, recruiters: 0 })
const users = ref([])
const loading = ref(true)

const fetchAdminData = async () => {
  try {
    const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${auth.state.token}` }
    })
    const usersRes = await fetch('http://localhost:5000/api/admin/users', {
      headers: { 'Authorization': `Bearer ${auth.state.token}` }
    })
    
    if (statsRes.ok) stats.value = await statsRes.json()
    if (usersRes.ok) users.value = await usersRes.json()
  } catch (error) {
    console.error('Erreur admin:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchAdminData)
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-700">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black text-text tracking-tight flex items-center gap-3">
          <ShieldAlert class="text-red-500" :size="32" />
          Dashboard Super Admin
        </h1>
        <p class="text-text-muted font-medium">Gestion globale de la plateforme DevConnect.</p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-surface p-6 rounded-3xl border border-border shadow-xl shadow-text/5 hover:scale-[1.02] transition-all">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><Users :size="24" /></div>
        </div>
        <h3 class="text-3xl font-black text-text">{{ stats.users }}</h3>
        <p class="text-sm font-bold text-text-muted uppercase tracking-wider">Utilisateurs</p>
      </div>

      <div class="bg-surface p-6 rounded-3xl border border-border shadow-xl shadow-text/5 hover:scale-[1.02] transition-all">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-purple-500/10 rounded-2xl text-purple-500"><Briefcase :size="24" /></div>
        </div>
        <h3 class="text-3xl font-black text-text">{{ stats.jobs }}</h3>
        <p class="text-sm font-bold text-text-muted uppercase tracking-wider">Jobs Actifs</p>
      </div>

      <div class="bg-surface p-6 rounded-3xl border border-border shadow-xl shadow-text/5 hover:scale-[1.02] transition-all">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-green-500/10 rounded-2xl text-green-500"><Activity :size="24" /></div>
        </div>
        <h3 class="text-3xl font-black text-text">{{ stats.developers }}</h3>
        <p class="text-sm font-bold text-text-muted uppercase tracking-wider">Développeurs</p>
      </div>

      <div class="bg-surface p-6 rounded-3xl border border-border shadow-xl shadow-text/5 hover:scale-[1.02] transition-all">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-orange-500/10 rounded-2xl text-orange-500"><Users :size="24" /></div>
        </div>
        <h3 class="text-3xl font-black text-text">{{ stats.recruiters }}</h3>
        <p class="text-sm font-bold text-text-muted uppercase tracking-wider">Recruteurs</p>
      </div>
    </div>

    <!-- User Management List -->
    <div class="bg-surface rounded-3xl border border-border shadow-xl shadow-text/5 overflow-hidden">
      <div class="p-6 border-b border-border flex items-center justify-between">
        <h2 class="text-xl font-black text-text">Gestion des Utilisateurs</h2>
        <button class="bg-primary/5 text-primary text-xs font-black px-4 py-2 rounded-xl hover:bg-primary/10 transition-all uppercase tracking-widest">Voir tout</button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-background/50">
              <th class="px-6 py-4 text-xs font-black text-text-muted uppercase tracking-widest">Utilisateur</th>
              <th class="px-6 py-4 text-xs font-black text-text-muted uppercase tracking-widest">Rôle</th>
              <th class="px-6 py-4 text-xs font-black text-text-muted uppercase tracking-widest">Date d'inscription</th>
              <th class="px-6 py-4 text-xs font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="user in users" :key="user._id" class="hover:bg-primary/5 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img :src="user.avatar" class="w-10 h-10 rounded-full border-2 border-primary/10" alt="Avatar" />
                  <div>
                    <p class="font-bold text-text leading-tight">{{ user.name }}</p>
                    <p class="text-xs text-text-muted font-medium">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider',
                  user.role === 'superadmin' ? 'bg-red-500/10 text-red-500' : 
                  user.role === 'recruiter' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
                ]">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-medium text-text-muted">
                {{ new Date(user.createdAt).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="p-2 text-text-muted hover:text-primary transition-colors"><ChevronRight :size="20" /></button>
                  <button v-if="user.role !== 'superadmin'" class="p-2 text-text-muted hover:text-red-500 transition-colors"><UserMinus :size="20" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
