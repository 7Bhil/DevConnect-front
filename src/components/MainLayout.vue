<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'

const route = useRoute()
const isAuthPage = computed(() => ['Login', 'Register'].includes(route.name))
</script>

<template>
  <div class="flex min-h-screen bg-background transition-colors duration-300">
    <Sidebar v-if="!isAuthPage" />
    <div :class="['flex-1 flex flex-col min-h-screen', !isAuthPage ? 'lg:ml-64' : '']">
      <Header v-if="!isAuthPage" />
      <main :class="[!isAuthPage ? 'p-8' : '']">
        <router-view v-slot="{ Component }">
          <transition 
            name="fade" 
            mode="out-in"
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-4"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>
