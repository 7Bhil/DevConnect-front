<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronLeft, Send, Smile, Paperclip, Phone, Video, MoreVertical, Info, Plus } from 'lucide-vue-next'
import { fetchMessages, fetchConversation, sendMessage } from '../api'
import { useAuth } from '../store/auth'

const route = useRoute()
const conversations = ref([])
const activeId = ref(null)
const messages = ref([])
const loading = ref(true)
const sendingMessage = ref(false)

const activeChat = ref(null)
const message = ref('')
const messagesContainer = ref(null)

const setActiveChat = async (conv) => {
  activeChat.value = conv
  activeId.value = conv._id
  
  try {
    messages.value = await fetchConversation(conv._id)
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Error loading conversation:', error)
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleSendMessage = async () => {
  if (!message.value.trim() || !activeChat.value || sendingMessage.value) return
  
  sendingMessage.value = true
  const tempMessage = message.value
  message.value = ''
  
  try {
    const newMessage = await sendMessage(
      activeChat.value._id,
      tempMessage
    )
    messages.value.push(newMessage)
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Error sending message:', error)
    message.value = tempMessage // Restore message on error
  } finally {
    sendingMessage.value = false
  }
}

const formatTime = (date) => {
  const messageDate = new Date(date)
  const now = new Date()
  const diff = now - messageDate
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}j`
  return messageDate.toLocaleDateString('fr-FR')
}

const formatLastTimestamp = (date) => {
  const messageDate = new Date(date)
  const now = new Date()
  const diff = now - messageDate
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `Il y a ${minutes} min`
  if (hours < 24) return `Il y a ${hours}h`
  if (days < 7) return `Il y a ${days}j`
  return messageDate.toLocaleDateString('fr-FR')
}

onMounted(async () => {
  try {
    conversations.value = await fetchMessages()
    if (conversations.value.length > 0) {
      await setActiveChat(conversations.value[0])
    }
  } catch (error) {
    console.error('Error loading conversations:', error)
  } finally {
    loading.value = false
  }
})
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
          :key="conv._id"
          @click="setActiveChat(conv)"
          class="w-full flex items-center gap-3 p-4 transition-all border-l-4"
          :class="activeChat && activeChat._id === conv._id
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
              <span class="text-xs text-text-muted whitespace-nowrap">{{ formatLastTimestamp(conv.lastTimestamp) }}</span>
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

        <div class="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar" ref="messagesContainer">
          <div v-if="messages.length === 0" class="flex-1 flex flex-col items-center justify-center text-text-muted py-20 px-8 text-center">
            <div class="p-6 bg-surface rounded-full mb-4 border border-border">
              <Send :size="48" class="opacity-20" />
            </div>
            <h4 class="text-lg font-black text-text mb-2">Aucun message ici</h4>
            <p class="text-sm max-w-xs">Envoyez le premier message pour entamer la discussion avec {{ activeChat?.participant?.name || '' }}.</p>
          </div>
          
          <div v-else class="space-y-4">
            <div 
              v-for="msg in messages" 
              :key="msg._id"
              class="flex items-start gap-3"
              :class="{ 'flex-row-reverse': msg.sender._id === auth.state.user?._id }"
            >
              <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  :src="msg.sender.avatar || '/default-avatar.png'" 
                  :alt="msg.sender.name"
                  class="w-full h-full object-cover"
                />
              </div>
              
              <div 
                class="max-w-xs lg:max-w-md"
                :class="{ 'items-end': msg.sender._id === auth.state.user?._id }"
              >
                <div 
                  class="px-4 py-2 rounded-2xl text-sm"
                  :class="{
                    'bg-primary text-white rounded-br-sm': msg.sender._id === auth.state.user?._id,
                    'bg-surface border border-border text-text rounded-bl-sm': msg.sender._id !== auth.state.user?._id
                  }"
                >
                  {{ msg.content }}
                </div>
                <p class="text-xs text-text-muted mt-1 px-1" :class="{ 'text-right': msg.sender._id === auth.state.user?._id }">
                  {{ formatTime(msg.createdAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>

      <!-- Input Area -->
      <div class="p-6 bg-surface border-t border-border transition-colors duration-300">
         <div class="max-w-4xl mx-auto flex items-end gap-4">
            <button class="p-2 text-text-muted hover:text-primary transition-colors">
              <Paperclip :size="20" />
            </button>
            
            <div class="flex-1 relative">
              <textarea 
                v-model="message"
                @keydown.enter.prevent="handleSendMessage"
                :disabled="!activeChat || sendingMessage"
                class="w-full bg-background border border-border rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-text resize-none no-scrollbar transition-all disabled:opacity-50"
                placeholder="Tapez votre message..."
                rows="1"
              ></textarea>
              <button 
                @click="handleSendMessage"
                :disabled="!message.trim() || !activeChat || sendingMessage"
                class="absolute right-3 top-3 text-text-muted hover:text-primary disabled:opacity-50 transition-colors"
              >
                <Send :size="20" />
              </button>
            </div>
            
            <button class="p-2 text-text-muted hover:text-primary transition-colors">
              <Smile :size="20" />
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
