<script setup>
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
</script>

<template>
  <div class="flex min-h-screen bg-background transition-colors duration-300">
    <Sidebar />
    <div class="flex-1 lg:ml-64 flex flex-col min-h-screen">
      <Header />
      <main class="p-8">
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
