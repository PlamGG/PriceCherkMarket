<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
    <div class="container mx-auto px-4">
      <!-- หัวข้อและ Breadcrumb -->
      <div class="mb-8">
        <div class="flex items-center text-sm text-gray-600 mb-4">
          <nuxt-link to="/" class="hover:text-emerald-600">หน้าแรก</nuxt-link>
          <span class="mx-2">›</span>
          <span class="text-emerald-600">{{ route.params.categoryId }}</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-800">
          สินค้าในหมวด{{ route.params.categoryId }}
          <span class="block text-lg font-normal text-gray-600 mt-2">
            พบ {{ categoryProducts.length }} รายการ
          </span>
        </h1>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="text-center py-10">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-10">
        <div class="bg-red-50 p-4 rounded-lg inline-block">
          <p class="text-red-600">{{ error }}</p>
          <button 
            @click="loadProducts" 
            class="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else-if="categoryProducts.length > 0" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in categoryProducts"
          :key="product._id"
          :product="product"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-10">
        <div class="bg-gray-50 p-8 rounded-xl inline-block">
          <p class="text-gray-600">ไม่พบสินค้าในหมวดหมู่นี้</p>
          <nuxt-link 
            to="/" 
            class="mt-4 inline-block px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
          >
            กลับหน้าแรก
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '~/components/ProductCard.vue'
import { getProductsByCategory } from '@/services/apiService' // ใช้ฟังก์ชันที่ปรับปรุงให้รับ categoryId

const route = useRoute()
const products = ref([]) // เก็บข้อมูลสินค้าทั้งหมด
const pending = ref(true) // สถานะการโหลดข้อมูล
const error = ref(null) // สถานะข้อผิดพลาด

// กรองสินค้าตามหมวดหมู่ที่ตรงกัน
const categoryProducts = computed(() => {
  const currentCategory = route.params.categoryId
  return products.value.filter(product => 
    product.category === currentCategory
  )
})

// ฟังก์ชันสำหรับโหลดข้อมูลสินค้า
const loadProducts = async () => {
  try {
    pending.value = true // เริ่มการโหลด
    error.value = null // ลบข้อผิดพลาด
    const response = await getProductsByCategory(route.params.categoryId) // โหลดสินค้าตาม categoryId
    products.value = response
  } catch (e) {
    console.error('Error loading products:', e)
    error.value = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง'
  } finally {
    pending.value = false // การโหลดเสร็จสิ้น
  }
}

// เรียกฟังก์ชัน loadProducts เมื่อ component ถูก mounted
onMounted(() => {
  loadProducts()
})
</script>
