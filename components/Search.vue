<template>
  <div class="relative w-full mx-auto" ref="searchContainer">
    <!-- Search Input Container -->
    <div class="relative group">
      <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <svg 
          class="w-5 h-5 text-gray-400 group-focus-within:text-green-500" 
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
        @input="handleInput"
        @focus="handleFocus"
        @keydown.enter="handleEnter"
        class="w-full pl-11 pr-12 py-3 bg-white border-2 border-gray-800 border border-gray-200 rounded-xl
               text-base placeholder-gray-400
               transition-all duration-200 ease-in-out
               focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500
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
      class="absolute w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl 
             overflow-hidden z-50 transform transition-all duration-200 ease-out"
    >
      <div 
        v-if="filteredProducts.length > 0"
        class="max-h-[300px] overflow-y-auto custom-scrollbar py-2"
      >
        <div
          v-for="product in limitedProducts"
          :key="product._id"
          class="relative group"
        >
          <div 
            class="flex items-center px-4 py-2.5 group-hover:bg-green-50 
                   transition-colors duration-150 cursor-pointer"
          >
            <!-- Search Icon instead of Image to keep it clean -->
            <svg class="w-4 h-4 text-gray-400 mr-3 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            
            <div class="flex-grow min-w-0 flex items-center justify-between">
              <h3 
                class="text-sm font-medium text-gray-700 truncate
                       group-hover:text-green-700 transition-colors duration-150"
              >
                {{ product.name }}
              </h3>
            </div>
          </div>

          <!-- Use NuxtLink for navigation -->
          <NuxtLink 
            :to="`/product/${product._id}`" 
            class="absolute inset-0 focus:outline-none focus:ring-2 
                   focus:ring-inset focus:ring-green-600"
            @click="isOpen = false"
          />
        </div>

        <!-- See All Results Button -->
        <div 
          v-if="filteredProducts.length > 6" 
          class="px-4 py-3 text-center border-t border-gray-50 mt-1"
        >
          <NuxtLink 
            :to="`/price?query=${searchQuery}`" 
            class="text-green-600 hover:text-green-700 text-sm font-semibold 
                   transition-colors duration-200 inline-block"
            @click="isOpen = false"
          >
            ดูผลการค้นหาทั้งหมด ({{ filteredProducts.length }} รายการ)
          </NuxtLink>
        </div>
      </div>

      <!-- No Results Message -->
      <div 
        v-else 
        class="px-6 py-6 text-center"
      >
        <p class="text-gray-500 text-sm">
          ไม่พบผลลัพธ์ที่ตรงกับ "{{ searchQuery }}"
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
const { fetchProducts } = useProducts();
const router = useRouter();

interface Product {
  _id: string;
  name: string;
}

const searchQuery = ref('');
const isOpen = ref(false);
const allProducts = ref<Product[]>([]);
const filteredProducts = ref<Product[]>([]);
const searchContainer = ref<HTMLElement | null>(null);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(async () => {
  try {
    allProducts.value = await fetchProducts();
  } catch (error) {
    console.error('Error fetching products for search:', error);
  }
  
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
  document.removeEventListener('click', handleClickOutside);
});

const handleClickOutside = (event: MouseEvent) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

const limitedProducts = computed(() => 
  filteredProducts.value.slice(0, 6)
);

const handleInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  
  debounceTimer = setTimeout(() => {
    executeSearch();
  }, 200);
};

const handleFocus = () => {
  if (searchQuery.value) {
    executeSearch();
  }
};

const handleEnter = () => {
  if (searchQuery.value.trim()) {
    isOpen.value = false;
    router.push(`/price?query=${encodeURIComponent(searchQuery.value.trim())}`);
  }
};

const executeSearch = () => {
  if (!searchQuery.value.trim()) {
    isOpen.value = false;
    filteredProducts.value = [];
    return;
  }

  const query = searchQuery.value.trim().toLowerCase();
  const cleanQuery = query.replace(/\s/g, '');
  
  // Fuzzy Match Pattern: "หมสาม" -> /ห.*ม.*ส.*า.*ม/i
  const pattern = cleanQuery.split('').join('.*');
  let regex: RegExp | null = null;
  try {
    regex = new RegExp(pattern, 'i');
  } catch (e) {}

  const results = allProducts.value.map(product => {
    const name = product.name.toLowerCase();
    const cleanName = name.replace(/\s/g, '');
    
    let score = 0;
    
    if (name === query) score = 100;
    else if (name.startsWith(query)) score = 80;
    else if (name.includes(query)) score = 60;
    else if (cleanName.includes(cleanQuery)) score = 40;
    else if (regex && regex.test(cleanName)) score = 20;
    
    return { product, score };
  }).filter(item => item.score > 0);
  
  // Sort by highest score first, then alphabetically
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.product.name.localeCompare(b.product.name, 'th');
  });
  
  filteredProducts.value = results.map(item => item.product);
  isOpen.value = true;
};

const clearSearch = () => {
  searchQuery.value = '';
  isOpen.value = false;
  filteredProducts.value = [];
};
</script>
