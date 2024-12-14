<template>
  <div class="relative w-full max-w-2xl mx-auto">
    <!-- Search Input Container -->
    <div class="relative group">
      <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <svg 
          class="w-5 h-5 text-gray-400 group-focus-within:text-green-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        v-model="searchQuery"
        type="text"
        placeholder="ค้นหาสินค้า..."
        @input="fetchFilteredProducts"
        class="w-full pl-11 pr-12 py-3 bg-white border border-gray-200 rounded-xl
               text-base placeholder-gray-400
               transition-all duration-200 ease-in-out
               focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600
               shadow-sm hover:shadow-md"
      />

      <div 
        v-if="searchQuery" 
        class="absolute inset-y-0 right-3 flex items-center"
      >
        <button 
          @click="clearSearch"
          class="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200
                 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg 
            class="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Search Results Dropdown -->
    <div 
      v-if="isOpen" 
      class="absolute w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 
             overflow-hidden z-50 transform transition-all duration-200 ease-out"
    >
      <div 
        v-if="filteredProducts.length > 0"
        class="max-h-[400px] overflow-y-auto custom-scrollbar"
      >
        <div
          v-for="(product, index) in limitedProducts"
          :key="product.id"
          class="relative group"
        >
          <div 
            class="flex items-center px-6 py-4 group-hover:bg-gray-50/80 
                   transition-colors duration-200 cursor-pointer"
          >
            <div class="relative w-14 h-14 flex-shrink-0">
              <img 
                :src="product.image || placeholderImage" 
                :alt="product.name"
                @error="handleImageError"
                class="w-full h-full rounded-lg object-cover shadow-sm
                       group-hover:shadow-md transition-shadow duration-200"
              />
            </div>

            <div class="ml-4 flex-grow min-w-0">
              <h3 
                class="text-base font-medium text-gray-900 truncate
                       group-hover:text-green-600 transition-colors duration-200"
              >
                {{ product.name }}
              </h3>
            </div>
          </div>

          <!-- Use NuxtLink for navigation -->
          <NuxtLink 
            :to="`/product/${product._id}`" 
            class="absolute inset-0 focus:outline-none focus:ring-2 
                   focus:ring-inset focus:ring-green-600 rounded-xl"
          />
        </div>

        <!-- See All Results Button -->
        <div 
          v-if="filteredProducts.length > 8" 
          class="px-6 py-4 text-center border-t border-gray-100"
        >
          <NuxtLink 
          :to="`/search?query=${searchQuery}`" 
            class="text-green-600 hover:text-green-700 font-semibold 
                   transition-colors duration-200 inline-block"
          >
            ดูผลลัพธ์ทั้งหมด ({{ filteredProducts.length }} รายการ)
          </NuxtLink>
        </div>
      </div>

      <!-- No Results Message -->
      <div 
        v-else 
        class="px-6 py-8 text-center"
      >
        <div class="text-gray-400 mb-2">
          <svg 
            class="w-12 h-12 mx-auto" 
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
        <p class="text-gray-500 text-base">
          ไม่พบผลลัพธ์ที่ตรงกับการค้นหาของคุณ
        </p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue';
import { fetchProducts } from '@/services/apiService';

interface Product {
  _id: string;
  id: string;
  name: string;
  image?: string;
}

const searchQuery = ref('');
const isOpen = ref(false);
const filteredProducts = ref<Product[]>([]);

// Placeholder image
const placeholderImage = 'https://via.placeholder.com/150';

// Handle image error
const handleImageError = (event: Event) => {
  (event.target as HTMLImageElement).src = placeholderImage;
};

// Computed property to limit results to 8
const limitedProducts = computed(() => 
  filteredProducts.value.slice(0, 8)
);

const fetchFilteredProducts = async () => {
  if (!searchQuery.value) {
    isOpen.value = false;
    filteredProducts.value = [];
    return;
  }

  try {
    const allProducts: Product[] = await fetchProducts();
    filteredProducts.value = allProducts.filter((product: Product) =>
      product.name.toLowerCase().startsWith(searchQuery.value.toLowerCase()) // ใช้ startsWith
    );
    isOpen.value = filteredProducts.value.length > 0;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};


const clearSearch = () => {
  searchQuery.value = '';
  isOpen.value = false;
  filteredProducts.value = [];
};

</script>


<style scoped>
.nuxt-link-active {
  text-decoration: none;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}
</style>
