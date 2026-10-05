<template>
  <NuxtLink :to="`/product/${product._id}`" class="block h-full group">
    <div
      class="bg-white border border-gray-200 hover:border-market-green rounded-2xl p-3.5 h-full flex flex-col justify-between transition-all duration-300 group-hover:shadow-lg relative"
    >
      <!-- Watchlist Star -->
      <button 
        @click.prevent.stop="toggleWatchlist" 
        class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full text-gray-300 hover:text-yellow-500 hover:bg-yellow-50/80 flex items-center justify-center transition-colors z-10 focus:outline-none"
        :title="isWatched ? 'ยกเลิกติดตาม' : 'ติดตามสินค้านี้'"
      >
        <svg class="w-5 h-5 transition-transform group-hover:scale-105" :class="{'text-yellow-400 fill-current': isWatched}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        </svg>
      </button>
      
      <!-- Top Section: Image & Category -->
      <div>
        <div class="h-32 sm:h-36 bg-gray-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden border border-gray-100 relative">
          <img
            :src="product.image || getFallbackImage(product.category)"
            :alt="product.name"
            class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            @error="handleImageError"
          />
          <span class="absolute bottom-2 left-2 bg-white/90 backdrop-blur text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
            {{ product.category || 'ทั่วไป' }}
          </span>
        </div>

        <!-- Fixed Title Box (Height 40px: guarantees identical height for 1 or 2 lines) -->
        <h3 class="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-market-green transition-colors text-sm h-10 flex items-start mb-1">
          {{ product.name }}
        </h3>
      </div>

      <!-- Bottom Section: Price & Trend -->
      <div class="mt-2 pt-2 border-t border-gray-50 flex items-end justify-between">
        <div class="flex items-baseline gap-1">
          <p class="text-xl font-black text-gray-900 leading-none tabular-nums">
            ฿{{ formatPrice(product.max_price || product.min_price) }}
          </p>
          <span class="text-[11px] text-gray-500 font-medium">/ {{ product.unit || 'กก.' }}</span>
        </div>
        
        <!-- Price Change Indicator -->
        <div v-if="product.priceChange && product.priceChange < 0" class="text-emerald-700 tabular-nums text-[10px] font-black bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
          ▼ {{ Math.abs(product.priceChange).toFixed(1) }}%
        </div>
        <div v-else-if="product.priceChange && product.priceChange > 0" class="text-rose-700 tabular-nums text-[10px] font-black bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
          ▲ {{ product.priceChange.toFixed(1) }}%
        </div>
        <div v-else class="text-gray-400 text-[10px] font-medium">
          คงที่
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const isWatched = ref(false)

const categoryImages = {
  'ผักสด': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
  'ผลไม้': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80',
  'เนื้อสัตว์และอาหารทะเล': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80',
  'ดอกไม้': 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&q=80',
  'ของแห้งและอื่นๆ': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
  'default': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80'
}

const getFallbackImage = (cat) => categoryImages[cat] || categoryImages['default']
const formatPrice = (p) => p ? Math.round(p).toLocaleString('th-TH') : '0'

const syncWatched = () => {
  if (typeof window === 'undefined' || !props.product || !props.product._id) return
  isWatched.value = localStorage.getItem(`watched_${props.product._id}`) === 'true'
}

onMounted(() => {
  syncWatched()
  window.addEventListener('watchlist-updated', syncWatched)
  window.addEventListener('storage', syncWatched)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('watchlist-updated', syncWatched)
    window.removeEventListener('storage', syncWatched)
  }
})

const emit = defineEmits(['unwatched'])

const handleImageError = (event) => {
  const fallback = getFallbackImage(props.product.category)
  if (event.target && event.target.src !== fallback) {
    event.target.src = fallback
  }
}

const toggleWatchlist = () => {
  isWatched.value = !isWatched.value
  localStorage.setItem(`watched_${props.product._id}`, String(isWatched.value))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('watchlist-updated'))
  }
  
  if (!isWatched.value) {
    emit('unwatched', props.product._id)
  }
}
</script>
