<template>
  <div class="bg-gradient-to-br from-green-50 to-teal-100 py-4 md:py-8 ">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Header -->
      <header class="mb-8 text-center animate-fade-in">
        <div class="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6">
          <h2 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500 mb-4">
            สินค้าใหม่ล่าสุด
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto text-lg">
            ค้นพบสินค้าล่าสุดที่เพิ่งถูกอัปเดทในตลาดของเรา
          </p>
        </div>
      </header>

      <!-- Error Handling -->
      <div v-if="error" class="text-center bg-red-100 rounded-lg p-4 mb-6">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="flex overflow-x-auto space-x-4 pb-4">
        <div 
          v-for="n in 6" 
          :key="n" 
          class="flex-shrink-0 bg-white/70 rounded-lg shadow-md p-4 animate-pulse w-72"
        >
          <div class="h-48 bg-gray-200 rounded mb-4"></div>
          <div class="h-6 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
        </div>
      </div>

      <!-- Product Cards -->
      <div 
        v-else-if="products.length" 
        class="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
        :class="{ 'dragging': isDragging }"
        @mousedown="startDrag"
        @mousemove="drag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
      >
        <div 
          v-for="product in products" 
          :key="product._id" 
          class="flex-shrink-0 w-72 bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl"
        >
          <div 
            @click="goToDetail(product._id)" 
            class="relative cursor-pointer group"
          >
            <img 
              :src="product.image || placeholderImage" 
              :alt="product.name" 
              class="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110" 
              @error="handleImageError" 
            />
            <div class="absolute top-2 right-2 bg-green-500/80 text-white px-3 py-1 rounded-full text-sm">
              ใหม่
            </div>
          </div>
          
          <div class="p-4">
            <h3 class="text-xl font-bold text-gray-800 mb-2 truncate">
              {{ product.name }}
            </h3>
            <div class="flex justify-between items-center">
              <div>
                <span class="text-green-600 font-semibold text-lg">
                  {{ formatPrice(product.min_price) }} - {{ formatPrice(product.max_price) }} บาท
                </span>
                <div class="text-gray-500 text-sm">
                  / {{ product.unit || 'หน่วย' }}
                </div>
              </div>
              <button 
                @click="goToDetail(product._id)"
                class="bg-green-500 text-white rounded-full px-3 py-1 text-sm hover:bg-green-600 transition-colors"
              >
                ดูเพิ่มเติม
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Products -->
      <div 
        v-else 
        class="text-center bg-white/70 backdrop-blur-sm rounded-xl p-10 shadow-lg"
      >
        <img 
          src="https://cdn-icons-png.flaticon.com/512/10132/10132307.png" 
          alt="No products" 
          class="mx-auto w-64 mb-6 opacity-70" 
        />
        <p class="text-gray-600 text-xl">ยังไม่มีสินค้าใหม่ในขณะนี้</p>
        <p class="text-gray-500 mt-2">กรุณาตรวจสอบใหม่ในภายหลัง</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchProducts } from '@/services/apiService'

// Router
const router = useRouter()

// Reactive State
const products = ref([])
const error = ref(null)
const loading = ref(true)

// Constants
const placeholderImage = 'https://cdn-icons-png.flaticon.com/512/10132/10132307.png'

// Drag Scroll State
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

// Image Error Handler
const handleImageError = (event) => {
  event.target.src = placeholderImage
}

// Price Formatter
const formatPrice = (price) => {
  return new Intl.NumberFormat('th-TH').format(price)
}

// Drag Scroll Methods
const startDrag = (e) => {
  isDragging.value = true
  const container = e.currentTarget
  startX.value = e.pageX - container.offsetLeft
  scrollLeft.value = container.scrollLeft
}

const drag = (e) => {
  if (!isDragging.value) return
  e.preventDefault()
  const container = e.currentTarget
  const x = e.pageX - container.offsetLeft
  const walk = (x - startX.value) * 2
  container.scrollLeft = scrollLeft.value - walk
}

const stopDrag = () => {
  isDragging.value = false
}

// Navigation
const goToDetail = (id) => {
  router.push(`/product/${id}`)
}

// Fetch Products on Mount
onMounted(async () => {
  try {
    loading.value = true
    const allProducts = await fetchProducts()
    products.value = allProducts
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 12)
  } catch (err) {
    error.value = 'ไม่สามารถโหลดข้อมูลสินค้าได้'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.dragging {
  cursor: grabbing;
}
</style>