<script setup>
import { onMounted, ref } from 'vue'
import { 
  Search, 
  Send, 
  Phone, 
  Video, 
  Info, 
  MoreVertical, 
  Plus, 
  Code, 
  Smile,
  Paperclip,
  Check,
  ChevronLeft
} from 'lucide-vue-next'
import { fetchMessages } from '../api'

const conversations = ref([])
const activeId = ref('c2')
const loading = ref(true)

onMounted(async () => {
  try {
    conversations.value = await fetchMessages()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

const activeChat = ref(null) // Initialize as null, will be set in onMounted
const message = ref('')

const setActiveChat = (conv) => {
  activeChat.value = conv
  activeId.value = conv.id // Update activeId when chat changes
}
</script>

<template>
  <div class="flex h-[calc(100vh-128px)] overflow-hidden bg-background rounded-3xl border border-border shadow-2xl shadow-text/5 animate-in fade-in duration-500 transition-colors duration-300">
    <!-- Conversations List -->
    <div class="w-80 border-r border-border flex flex-col h-full bg-surface transition-colors duration-300">
      <div class="p-6 bg-surface border-b border-border">
         <div class="flex items-center justify-between mb-4">
           <h2 class="text-xl font-black text-text">Messages</h2>
           <button class="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
             <Plus :size="20" />
           </button>
         </div>
         <div class="relative">
           <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" :size="16" />
           <input
             type="text"
             class="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary text-text placeholder:text-text-muted transition-all"
             placeholder="Rechercher..."
           />
         </div>
      </div>

      <div class="flex-1 overflow-y-auto no-scrollbar">
        <div v-if="loading" class="p-4 space-y-4">
           <div v-for="i in 5" :key="i" class="h-20 bg-background rounded-2xl animate-pulse border border-border"></div>
        </div>
        <button
          v-else
          v-for="conv in conversations"
          :key="conv.id"
          @click="setActiveChat(conv)"
          class="w-full flex items-center gap-3 p-4 transition-all border-l-4"
          :class="activeChat && activeChat.id === conv.id
            ? 'bg-primary/5 border-primary'
            : 'bg-transparent border-transparent hover:bg-primary/5'"
        >
          <div class="relative shrink-0">
            <img :src="conv.participant.avatar" class="w-12 h-12 rounded-full border-2 border-background shadow-sm" alt="" />
            <span class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-surface rounded-full"></span>
          </div>
          <div class="flex-1 text-left overflow-hidden">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-bold text-text truncate">{{ conv.participant.name }}</span>
              <span class="text-[10px] text-text-muted whitespace-nowrap">{{ conv.lastTimestamp }}</span>
            </div>
            <p class="text-xs truncate transition-colors" :class="conv.unread ? 'font-bold text-text' : 'text-text-muted'">
              {{ conv.lastMessage }}
            </p>
          </div>
          <div v-if="conv.unread" class="w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center shrink-0">
            {{ conv.unread }}
          </div>
        </button>
      </div>
    </div>

    <!-- Chat Window -->
    <div v-if="activeChat" class="flex-1 flex flex-col h-full bg-background transition-colors duration-300">
      <!-- Chat Header -->
      <header class="h-16 bg-surface border-b border-border px-6 flex items-center justify-between shrink-0 transition-colors duration-300">
        <div class="flex items-center gap-3">
           <img :src="activeChat.participant.avatar" class="w-10 h-10 rounded-full border-2 border-primary/20" />
           <div>
             <h3 class="text-sm font-bold text-text">{{ activeChat.participant.name }}</h3>
             <p class="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
               <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> En ligne
             </p>
           </div>
        </div>
        
        <div class="flex items-center gap-2">
          <button class="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"><Phone :size="20" /></button>
          <button class="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"><Video :size="20" /></button>
          <button class="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"><Info :size="20" /></button>
          <button class="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"><MoreVertical :size="20" /></button>
        </div>
      </header>

      <!-- Message Thread -->
      <div class="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
         <div class="flex justify-center">
           <span class="text-[10px] font-bold text-text-muted uppercase tracking-widest bg-surface border border-border px-3 py-1 rounded-full shadow-sm">Aujourd'hui</span>
         </div>

         <div class="flex-1 flex flex-col items-center justify-center text-text-muted py-20 px-8 text-center">
            <div class="p-6 bg-surface rounded-full mb-4 border border-border">
              <MessageCircle :size="48" class="opacity-20" />
            </div>
            <h4 class="text-lg font-black text-text mb-2">Aucun message ici</h4>
            <p class="text-sm max-w-xs">Envoyez le premier message pour entamer la discussion avec {{ activeChat.participant.name }}.</p>
         </div>
      </div>

      <!-- Input Area -->
      <div class="p-6 bg-surface border-t border-border transition-colors duration-300">
         <div class="max-w-4xl mx-auto flex items-end gap-4">
            <div class="flex items-center gap-1 mb-1">
               <button class="p-2 text-text-muted hover:text-primary transition-colors"><Plus :size="22" /></button>
               <button class="p-2 text-text-muted hover:text-primary transition-colors"><Code :size="22" /></button>
            </div>
            <div class="flex-1 relative">
              <textarea 
                v-model="message"
                class="w-full bg-background border border-border rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text resize-none no-scrollbar h-12 transition-all"
                placeholder="Tapez votre message..."
                rows="1"
              ></textarea>
              <button class="absolute right-3 top-3 text-text-muted hover:text-primary"><Smile :size="20" /></button>
            </div>
            <button 
              class="bg-primary text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-primary/20 active:scale-95 shrink-0"
            >
              <Send :size="20" />
            </button>
         </div>
         <div class="max-w-4xl mx-auto flex justify-center gap-6 mt-3 text-[10px] font-bold text-text-muted uppercase tracking-widest">
           <span class="flex items-center gap-1">Entrée pour envoyer</span>
           <span class="flex items-center gap-1">Maj + Entrée pour retour ligne</span>
         </div>
      </div>
    </div>
    <div v-else class="flex-1 flex flex-col items-center justify-center text-text-muted bg-background transition-colors duration-300">
       <div class="p-6 bg-surface rounded-full mb-4">
         <Send :size="48" class="opacity-20" />
       </div>
       <p class="font-bold">Sélectionnez une conversation pour commencer</p>
    </div>
  </div>
</template>
