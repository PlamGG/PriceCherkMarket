<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Search Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">
          ผลการค้นหา "{{ searchQuery }}"
        </h1>
        <p class="text-gray-600">
          พบ {{ filteredProducts.length }} รายการ
        </p>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product._id" 
          :product="product"
        />
      </div>

      <!-- No Results Message -->
      <div 
        v-if="filteredProducts.length === 0" 
        class="text-center py-12"
      >
        <div class="text-gray-400 mb-4">
          <svg 
            class="w-16 h-16 mx-auto" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 class="text-xl text-gray-700 mb-2">
          ไม่พบผลลัพธ์การค้นหา
        </h2>
        <p class="text-gray-500">
          ลองค้นหาด้วยคำค่อยอื่นหรือตรวจสอบการสะกดคำ
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchProducts } from '@/services/apiService';
import ProductCard from '@/components/ProductCard.vue';

interface Product {
  _id: string;
  id: string;
  name: string;
  category: string;
  max_price: number;
  min_price: number;
  price_history: Array<{ max_price: number }>;
  priceChange?: number; // เพิ่ม property สำหรับ priceChange
  image?: string;
}

const route = useRoute();
const searchQuery = ref('');
const filteredProducts = ref<Product[]>([]);

onMounted(async () => {
  // ดึงค่า query parameter จาก URL
  searchQuery.value = route.query.query?.toString() || '';

  try {
    // ดึงสินค้าทั้งหมด
    const allProducts: Product[] = await fetchProducts();
    
    // คำนวณ priceChange สำหรับแต่ละสินค้า
    allProducts.forEach(product => {
      const latestHistory = product.price_history[product.price_history.length - 1];
      const previousHistory = product.price_history[product.price_history.length - 2];

      let priceChange = 0;
      if (latestHistory && previousHistory) {
        const maxPriceNow = latestHistory.max_price;
        const maxPricePrev = previousHistory.max_price;

        priceChange = ((maxPriceNow - maxPricePrev) / maxPricePrev) * 100;
      }

      product.priceChange = priceChange; // เพิ่มค่า priceChange ให้กับสินค้าทุกตัว
    });

    // กรองสินค้าตามคำค้นหา
    filteredProducts.value = allProducts.filter((product: Product) =>
      product.name.toLowerCase().startsWith(searchQuery.value.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching products:', error);
  }
});
</script>
