<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans py-10">
    <div class="flex-grow max-w-7xl mx-auto px-4 w-full">
      
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <div class="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center border border-yellow-100">
          <svg class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tight">รายการที่ติดตาม</h1>
          <p class="text-gray-500 font-medium">สินค้าที่คุณกดดาวไว้จะมาแสดงที่นี่ทั้งหมด</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
        <div v-for="n in 5" :key="n" class="bg-white rounded-xl p-3 h-64 animate-pulse border border-gray-100">
          <div class="w-full h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2 mt-auto"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="watchedProducts.length === 0" class="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm mt-8">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">ยังไม่มีสินค้าที่ติดตาม</h2>
        <p class="text-gray-500 font-medium mb-6">คุณสามารถกดที่ไอคอนรูปดาวในการ์ดสินค้า เพื่อบันทึกเก็บไว้ดูราคาได้</p>
        <NuxtLink to="/price" class="bg-market-green hover:opacity-90 text-white font-bold px-6 py-2.5 rounded-lg transition-colors inline-block">
          ไปค้นหาสินค้าเลย
        </NuxtLink>
      </div>

      <!-- Results Grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        <ProductCard 
          v-for="product in watchedProducts" 
          :key="product._id" 
          :product="product"
          class="h-full"
          @unwatched="removeProduct"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProducts } from '@/composables/useProducts';
import ProductCard from '@/components/ProductCard.vue';

const { fetchProducts } = useProducts();

const allProducts = ref([]);
const watchedProducts = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    allProducts.value = await fetchProducts();
    
    // Filter only products that have their ID saved as true in localStorage
    watchedProducts.value = allProducts.value.filter(product => {
      return localStorage.getItem(`watched_${product._id}`) === 'true';
    });

  } catch (error) {
    console.error('Error fetching watched products:', error);
  } finally {
    loading.value = false;
  }
});

const removeProduct = (id) => {
  watchedProducts.value = watchedProducts.value.filter(p => p._id !== id);
};
</script>
