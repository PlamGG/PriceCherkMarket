<template>
  <nav class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 font-sans">
    <div class="max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
      
      <!-- Logo Section -->
      <NuxtLink to="/" class="flex items-center space-x-2 group">
        <span class="text-2xl font-black tracking-tight text-gray-900 group-hover:opacity-80 transition-opacity">
          Market <span class="text-market-green">Price</span>
        </span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex space-x-8 font-bold text-sm items-center">
        <NuxtLink 
          to="/" 
          class="nav-link pb-1 transition-colors"
          active-class="text-market-green border-b-2 border-market-green"
          exact-active-class="text-market-green border-b-2 border-market-green"
          :class="[$route.path === '/' ? '' : 'text-gray-600 hover:text-market-green']"
        >
          หน้าแรก
        </NuxtLink>

        
        <NuxtLink 
          to="/price" 
          class="nav-link pb-1 transition-colors"
          active-class="text-market-green border-b-2 border-market-green"
          :class="[$route.path === '/price' ? '' : 'text-gray-600 hover:text-market-green']"
        >
          ราคาสินค้าวันนี้
        </NuxtLink>

        <!-- New Watchlist Link -->
        <NuxtLink 
          to="/watchlist" 
          class="nav-link pb-1 transition-colors flex items-center gap-1.5"
          active-class="text-market-green border-b-2 border-market-green"
          :class="[$route.path === '/watchlist' ? '' : 'text-gray-600 hover:text-market-green']"
        >
          <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>รายการที่ติดตาม</span>
          <span 
            v-if="watchlistCount > 0" 
            class="bg-yellow-400 text-gray-900 text-[11px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none shadow-sm"
          >
            {{ watchlistCount }}
          </span>
        </NuxtLink>
      </div>

    </div>

    <!-- Bottom Navigation (Mobile Only) -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[60] flex justify-around items-center pb-2 pt-1.5 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <NuxtLink to="/" class="flex flex-col items-center py-1 px-4 text-gray-400 hover:text-market-green" exact-active-class="text-market-green">
        <svg class="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        <span class="text-[10px] font-bold">หน้าแรก</span>
      </NuxtLink>

      <NuxtLink to="/price" class="flex flex-col items-center py-1 px-4 text-gray-400 hover:text-market-green" active-class="text-market-green">
        <svg class="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <span class="text-[10px] font-bold">ค้นหาราคา</span>
      </NuxtLink>

      <NuxtLink to="/watchlist" class="flex flex-col items-center py-1 px-4 text-gray-400 hover:text-market-green relative" active-class="text-market-green">
        <div class="relative">
          <svg class="w-6 h-6 mb-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <span 
            v-if="watchlistCount > 0" 
            class="absolute -top-1 -right-2 bg-yellow-400 text-gray-900 text-[9px] font-black px-1 rounded-full min-w-[15px] h-[15px] flex items-center justify-center shadow-sm"
          >
            {{ watchlistCount }}
          </span>
        </div>
        <span class="text-[10px] font-bold">ติดตาม</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const watchlistCount = ref(0);

const updateWatchlistCount = () => {
  if (typeof window === 'undefined') return;
  try {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('watched_') && localStorage.getItem(key) === 'true') {
        count++;
      }
    }
    watchlistCount.value = count;
  } catch (e) {
    console.error('Failed to read watchlist count', e);
  }
};

onMounted(() => {
  updateWatchlistCount();
  window.addEventListener('watchlist-updated', updateWatchlistCount);
  window.addEventListener('storage', updateWatchlistCount);
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('watchlist-updated', updateWatchlistCount);
    window.removeEventListener('storage', updateWatchlistCount);
  }
});
</script>
