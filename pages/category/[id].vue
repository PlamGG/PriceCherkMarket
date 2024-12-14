<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
    <div class="container mx-auto px-4">
      <!-- หัวข้อและ Breadcrumb -->
      <div class="mb-8">
        <div class="flex items-center text-sm text-gray-600 mb-4">
          <NuxtLink to="/" class="hover:text-emerald-600 transition-colors">
            หน้าแรก
          </NuxtLink>
          <span class="mx-2">›</span>
          <span class="text-emerald-600">{{ categoryName }}</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-800">
          สินค้าในหมวด{{ categoryName }}
          <span class="block text-lg font-normal text-gray-600 mt-2">
            พบ {{ products.length }} รายการ
          </span>
        </h1>
      </div>

      <!-- Products Grid -->
      <div v-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard 
          v-for="product in products" 
          :key="product._id"
          :product="product"
        />
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <p class="text-gray-600">ไม่พบสินค้าในหมวดหมู่นี้</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchProducts } from '@/services/apiService'
import ProductCard from '@/components/ProductCard.vue' // นำเข้า ProductCard

const route = useRoute()
const categoryId = route.params.id
const categoryName = route.query.name || categoryId

const products = ref([]) // สินค้า
const isLoading = ref(true) // สถานะการโหลด

const fetchCategoryProducts = async () => {
  try {
    isLoading.value = true
    const response = await fetchProducts() // ดึงข้อมูลสินค้าทั้งหมด
    products.value = response
      .filter(product => product.category === categoryId) // กรองสินค้าตามหมวดหมู่
      .map(product => {
        // คำนวณการเปลี่ยนแปลงของราคา (priceChange)
        const latestHistory = product.price_history[product.price_history.length - 1] // ข้อมูลราคาล่าสุด
        const previousHistory = product.price_history[product.price_history.length - 2] // ข้อมูลราคาก่อนหน้า

        let priceChange = 0; // เริ่มต้นการคำนวณการเปลี่ยนแปลงของราคา
        if (latestHistory && previousHistory) {
          const maxPriceNow = latestHistory.max_price; // ราคาในช่วงเวลาล่าสุด
          const maxPricePrev = previousHistory.max_price; // ราคาในช่วงเวลาก่อนหน้า

          // คำนวณเปอร์เซ็นต์การเปลี่ยนแปลงของราคา
          priceChange = ((maxPriceNow - maxPricePrev) / maxPricePrev) * 100;
        }

        // ส่งคืนข้อมูลสินค้าเดิมพร้อมกับ priceChange ที่คำนวณแล้ว
        return {
          ...product,
          priceChange: priceChange,
        }
      })
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCategoryProducts()
})
</script>

