<template>


<!-- Price Trend Section -->
<PriceTrendSection :categories="categories" />



  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold mb-10 text-gray-800 text-center">
        ประเภทสินค้า
        <span class="block text-lg text-gray-600 mt-2 font-normal">สำรวจและเปรียบเทียบราคาสินค้าทั้งหมด</span>
      </h1>

      <ClientOnly>
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
        </div>

        <!-- Category Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CategoryCard
            v-for="category in categories"
            :key="category.id"
            :category="category"
            @navigate="navigateToCategory"
          />
        </div>
      </ClientOnly>

      
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

const CategoryCard = defineAsyncComponent(() => 
  import('~/components/CategoryCard.vue')
)
const PriceTrendSection = defineAsyncComponent(() => 
  import('~/components/PriceTrendSection.vue')
)

const isLoading = ref(false)
const categories = [
  {
    id: 'ผลไม้',
    name: 'ผลไม้',
    description: 'ผลไม้สดใหม่จากแหล่งเพาะปลูก',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&q=80',
    totalProducts: 127,
    avgPrice: 45.50,
    priceTrend: 2.5
  },
  {
    id: 'ผัก',
    name: 'ผัก',
    description: 'ผักสดคุณภาพดี ปลอดสารพิษ',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80',
    totalProducts: 95,
    avgPrice: 35.75,
    priceTrend: -1.7
  },
  {
    id: 'เนื้อสัตว์',
    name: 'เนื้อสัตว์',
    description: 'เนื้อสัตว์คุณภาพพรีเมียม',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&q=80',
    totalProducts: 64,
    avgPrice: 220.00,
    priceTrend: 3.2
  },
  {
    id: 'ปลาและอาหารทะเล',
    name: 'ปลาและอาหารทะเล',
    description: 'ปลาสดและอาหารทะเลคุณภาพ',
    image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=500&q=80',
    totalProducts: 52,
    avgPrice: 180.50,
    priceTrend: -0.5
  },
  {
    id: 'ข้าวสาร',
    name: 'ข้าวสาร',
    description: 'ข้าวคุณภาพดีจากแหล่งผลิต',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80',
    totalProducts: 38,
    avgPrice: 75.25,
    priceTrend: 1.1
  },
  {
    id: 'ของแห้ง',
    name: 'ของแห้ง',
    description: 'ของแห้งหลากหลายสำหรับคนรักการทำอาหาร',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80',
    totalProducts: 89,
    avgPrice: 60.75,
    priceTrend: 0.8
  },
  {
    id: 'ดอกไม้',
    name: 'ดอกไม้',
    description: 'ดอกไม้สดสวยจากไร่',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80',
    totalProducts: 43,
    avgPrice: 120.00,
    priceTrend: -2.3
  }
]

const navigateToCategory = async (category) => {
  try {
    isLoading.value = true
    await navigateTo({
      path: `/category/${category.id}`,
      query: {
        name: category.name,
        description: category.description
      }
    })
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการนำทาง:', error)
  } finally {
    isLoading.value = false
  }
}
</script>