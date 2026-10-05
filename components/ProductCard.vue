<template>
  <NuxtLink :to="`/product/${product._id}`" class="block h-full">
    <div
      class="bg-white border border-gray-200 hover:border-green-500 rounded-xl p-3 h-full flex flex-col transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-md relative"
    >
      <!-- Watchlist Star -->
      <button @click.prevent="toggleWatchlist" class="absolute top-2 right-2 text-gray-300 hover:text-yellow-400 transition-colors z-10 focus:outline-none">
        <svg class="w-5 h-5" :class="{'text-yellow-400 fill-current': isWatched}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        </svg>
      </button>
      
      <!-- Product Image -->
      <div class="h-24 md:h-32 bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden border border-gray-100">
        <img
          :src="product.image || getFallbackImage(product.category)"
          :alt="product.name"
          class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 opacity-95 group-hover:opacity-100"
          @error="handleImageError"
        />
      </div>

      <!-- Product Details -->
      <div class="flex-grow flex flex-col">
        <h3 class="font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-green-700 transition-colors text-sm mb-1">
          {{ product.name }}
        </h3>
        <p class="text-xs text-gray-500 mb-2 truncate">{{ product.category || 'ทั่วไป' }}</p>

        <div class="mt-auto flex items-end justify-between">
          <div class="flex items-baseline gap-1">
            <p class="text-lg font-black text-gray-900 leading-none tabular-nums">
              ฿{{ formatPrice(product.max_price || product.min_price) }}
            </p>
            <span class="text-[11px] text-gray-500 font-medium">/ {{ product.unit || 'กก.' }}</span>
          </div>
          
          <!-- Price Change Indicator -->
          <div v-if="product.priceChange && product.priceChange < 0" class="text-green-600 tabular-nums text-[10px] font-bold bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
            ▼ {{ Math.abs(product.priceChange).toFixed(1) }}%
          </div>
          <div v-else-if="product.priceChange && product.priceChange > 0" class="text-red-600 tabular-nums text-[10px] font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
            ▲ {{ product.priceChange.toFixed(1) }}%
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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
  'เนื้อสัตว์และอาหารทะเล': 'https://png.pngtree.com/png-clipart/20240923/original/pngtree-fresh-pork-meat-freshness-png-image_16079866.png',
  'ดอกไม้': 'https://images.pexels.com/photos/30458590/pexels-photo-30458590.jpeg?cs=srgb&dl=pexels-casnafu-30458590.jpg&fm=jpg',
  'ของแห้งและอื่นๆ': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
  'default': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80'
}

const getFallbackImage = (cat) => categoryImages[cat] || categoryImages['default']
const formatPrice = (p) => p ? Math.round(p).toLocaleString('th-TH') : '0'

onMounted(() => {
  // persist watchlist state ด้วย localStorage
  isWatched.value = localStorage.getItem(`watched_${props.product._id}`) === 'true'
})

const emit = defineEmits(['unwatched'])

const handleImageError = (event) => {
  const fallback = getFallbackImage(props.product.category)
  if (event.target.src !== fallback) {
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
