<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="container mx-auto px-4">
      <!-- หัวข้อหมวดหมู่ -->
      <div class="mb-10">
        <h1 class="text-3xl font-bold text-gray-800">{{ categoryName }}</h1>
        <p class="text-gray-600 mt-2">{{ categoryDescription }}</p>
      </div>

      <!-- Skeleton Loader -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="w-full h-48 bg-gray-200 animate-pulse"></div>
          <div class="p-4">
            <div class="h-6 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- รายการสินค้า -->
      <div v-else-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="product in products" 
          :key="product.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <NuxtLink 
            :to="{
              path: `/product/${product.id}`,
              query: { id: product.id }
            }"
            class="block hover:opacity-75 transition-opacity"
            :prefetch="true"
          >
            <img 
              :src="product.image || 'https://placehold.co/300x200?text=No+Image'" 
              :alt="product.name"
              class="w-full h-48 object-cover"
              loading="lazy"
              @error="$event.target.src='https://placehold.co/300x200?text=No+Image'"
            />
          </NuxtLink>
          <div class="p-4">
            <NuxtLink 
              :to="{
                path: `/product/${product.id}`,
                query: { id: product.id }
              }"
              class="block group"
            >
              <h3 class="text-lg font-semibold text-gray-800 group-hover:text-emerald-600">
                {{ product.name }}
              </h3>
            </NuxtLink>
            <p class="text-gray-600 mt-1">{{ product.market }}</p>
            <div class="mt-4 flex justify-between items-center">
              <span class="text-2xl font-bold text-emerald-600">฿{{ product.price }}</span>
              <NuxtLink 
                :to="{
                  path: `/product/${product.id}`,
                  query: { id: product.id }
                }"
                class="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                ดูรายละเอียด
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- No Products State -->
      <div v-else class="text-center py-20">
        <p class="text-gray-600 text-lg">ไม่พบสินค้าในหมวดหมู่นี้</p>
      </div>

      <!-- ปุ่มโหลดเพิ่มเติม -->
      <div v-if="!isLoading && hasMoreProducts" class="mt-8 text-center">
        <button 
          @click="loadMoreProducts" 
          class="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
        >
          โหลดเพิ่มเติม
        </button>
      </div>

      <!-- ปุ่มย้อนกลับ -->
      <div class="mt-8">
        <button 
          @click="$router.back()" 
          class="flex items-center text-gray-600 hover:text-emerald-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          ย้อนกลับ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchProducts } from '@/services/apiService'

const route = useRoute()
const categoryId = route.params.id
const categoryName = route.query.name
const categoryDescription = route.query.description

const products = ref([])
const isLoading = ref(true)
const currentPage = ref(1)
const pageSize = 12
const hasMoreProducts = ref(true)

const fetchCategoryProducts = async () => {
  try {
    const cachedProducts = localStorage.getItem(`products_${categoryId}`)
    if (cachedProducts) {
      products.value = JSON.parse(cachedProducts)
      isLoading.value = false
      return
    }

    isLoading.value = true
    const response = await fetchProducts(categoryId, currentPage.value, pageSize)
    products.value = response
    if (response.length < pageSize) {
      hasMoreProducts.value = false
    }
    localStorage.setItem(`products_${categoryId}`, JSON.stringify(products.value))
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error)
  } finally {
    isLoading.value = false
  }
}

const loadMoreProducts = async () => {
  try {
    isLoading.value = true
    currentPage.value++
    const response = await fetchProducts(categoryId, currentPage.value, pageSize)
    if (response.length < pageSize) {
      hasMoreProducts.value = false
    }
    products.value = [...products.value, ...response]
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCategoryProducts()
})
</script>
