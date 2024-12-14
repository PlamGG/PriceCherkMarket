<template>
  <nav class="bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- Logo Section -->
        <NuxtLink 
          to="/" 
          class="flex items-center space-x-2 text-white hover:opacity-80 transition-opacity duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 transform transition-transform hover:rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span class="text-2xl font-bold tracking-tight">ตลาดรวม</span>
        </NuxtLink>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-6">
          <NuxtLink 
            to="/" 
            class="text-white hover:text-teal-300 transition-colors duration-300 flex items-center space-x-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            <span>หน้าแรก</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/price" 
            class="text-white hover:text-teal-300 transition-colors duration-300 flex items-center space-x-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span>ราคาสินค้า</span>
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button 
            @click="toggleMobileMenu" 
            class="text-white focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      <transition name="fade">
        <div 
          v-if="mobileMenuOpen" 
          class="md:hidden absolute left-0 right-0 bg-gray-900 z-20"
        >
          <div class="px-4 pt-2 pb-4 space-y-2">
            <NuxtLink 
              to="/" 
              class="block text-white hover:bg-gray-800 py-2 px-3 rounded"
              @click="toggleMobileMenu"
            >
              หน้าแรก
            </NuxtLink>
            <NuxtLink 
              to="/price" 
              class="block text-white hover:bg-gray-800 py-2 px-3 rounded"
              @click="toggleMobileMenu"
            >
              ราคาสินค้า
            </NuxtLink>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

button:hover svg {
  transform: scale(1.1);
}
</style>
