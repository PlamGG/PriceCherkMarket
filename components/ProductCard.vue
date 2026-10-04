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
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 opacity-95 group-hover:opacity-100"
          @error="handleImageError"
        />
        <svg v-else class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
      </div>

      <!-- Product Details -->
      <div class="flex-grow flex flex-col">
        <h3 class="font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-green-700 transition-colors text-sm mb-1">
          {{ product.name }}
        </h3>
        <p class="text-xs text-gray-500 mb-2 truncate">{{ product.category || 'ทั่วไป' }}</p>

        <div class="mt-auto flex items-end justify-between">
          <p class="text-lg font-black text-gray-900 leading-none tabular-nums">
            ฿{{ product.max_price ? product.max_price.toFixed(2) : (product.min_price ? product.min_price.toFixed(2) : '0.00') }}
          </p>
          
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
const placeholderImage = '/placeholder.png'

onMounted(() => {
  // persist watchlist state ด้วย localStorage
  isWatched.value = localStorage.getItem(`watched_${props.product._id}`) === 'true'
})

const emit = defineEmits(['unwatched'])

const handleImageError = (event) => {
  if (event.target.src !== placeholderImage) {
    event.target.src = placeholderImage
  }
}

const toggleWatchlist = () => {
  isWatched.value = !isWatched.value
  localStorage.setItem(`watched_${props.product._id}`, String(isWatched.value))
  
  if (!isWatched.value) {
    emit('unwatched', props.product._id)
  }
}
</script>
