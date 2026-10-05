<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    
    <!-- Top Search Header -->
    <div class="bg-[#004e38] text-white py-12 px-4 shadow-md relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="max-w-4xl mx-auto relative z-10 text-center">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-black mb-3 tracking-tight">ค้นหาและเปรียบเทียบราคา</h1>
        <p class="text-green-100 font-medium mb-6 text-sm sm:text-base">เช็คราคาอัปเดตล่าสุดจากตลาดรวม ทั้งผัก ผลไม้ และเนื้อสัตว์</p>
        
        <div class="relative max-w-2xl mx-auto group">
          <input 
            type="text" 
            v-model="searchQuery" 
            @input="handleSearch"
            placeholder="พิมพ์ชื่อสินค้าที่ต้องการค้นหา เช่น กะหล่ำปลี, หมูสามชั้น..." 
            class="w-full pl-12 pr-4 py-3 md:py-4 text-gray-900 bg-white rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-green-400/30 transition-all font-medium text-base md:text-lg placeholder-gray-400 border border-transparent focus:border-white"
          />
          <svg class="w-6 h-6 text-market-green absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-grow max-w-7xl mx-auto px-4 py-8 w-full overflow-hidden">
      <div class="flex flex-col md:flex-row gap-8">
        
        <!-- Sidebar: Categories Filter -->
        <div class="w-full md:w-64 flex-shrink-0 hidden md:block">
          <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-gray-900">หมวดหมู่</h3>
              <button v-if="selectedCategory" @click="resetFilters" class="text-xs text-market-green font-bold hover:underline">
                ล้างค่า
              </button>
            </div>
            
            <div class="space-y-1">
              <button 
                @click="selectedCategory = ''"
                class="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group"
                :class="!selectedCategory ? 'bg-market-green/10 text-market-green font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              >
                <span>สินค้าทั้งหมด</span>
                <span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full group-hover:bg-gray-200 transition-colors" v-if="!selectedCategory">{{ finalFilteredProducts.length }}</span>
              </button>
              
              <button 
                v-for="cat in categories" 
                :key="cat"
                @click="selectedCategory = cat"
                class="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group"
                :class="selectedCategory === cat ? 'bg-market-green/10 text-market-green font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
              >
                <span>{{ cat }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Categories Horizontal Scroll -->
        <div class="md:hidden w-full overflow-x-auto hide-scrollbar pb-3">
          <div class="flex space-x-2">
            <button 
              @click="selectedCategory = ''"
              class="whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors border shadow-sm"
              :class="!selectedCategory ? 'bg-market-green text-white border-market-green' : 'bg-white text-gray-600 border-gray-200'"
            >
              ทั้งหมด
            </button>
            <button 
              v-for="cat in categories" 
              :key="cat"
              @click="selectedCategory = cat"
              class="whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors border shadow-sm"
              :class="selectedCategory === cat ? 'bg-market-green text-white border-market-green' : 'bg-white text-gray-600 border-gray-200'"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Search Results Area -->
        <div class="flex-grow bg-[#f5f9f6] p-4 md:p-6 rounded-3xl border border-green-50 shadow-inner">
          
          <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100 mb-4">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="font-medium">{{ error }}</span>
          </div>

          <div v-else>
            <!-- Results Header -->
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-green-100">
              <h2 class="text-xl font-bold text-gray-900">
                <span v-if="searchQuery">ผลการค้นหา: "<span class="text-market-green">{{ searchQuery }}</span>"</span>
                <span v-else-if="selectedCategory">{{ selectedCategory }}</span>
                <span v-else>สินค้าทั้งหมด</span>
                <span class="text-sm font-medium text-gray-500 ml-2">({{ finalFilteredProducts.length }} รายการ)</span>
              </h2>
            </div>

            <!-- Loading Skeleton -->
            <div v-if="loadingAsync" class="flex justify-center items-center py-20">
              <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-market-green border-gray-200"></div>
            </div>

            <!-- Product Grid -->
            <div v-else-if="finalFilteredProducts.length > 0">
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                <ProductCard 
                  v-for="product in displayedProducts" 
                  :key="product._id"
                  :product="product"
                />
              </div>

              <!-- Load More Button -->
              <div v-if="hasMore" class="mt-8 text-center">
                <button 
                  @click="loadMore"
                  class="bg-white hover:bg-gray-50 text-market-green border border-market-green font-bold px-8 py-3 rounded-xl shadow-sm hover:shadow transition-all text-sm md:text-base inline-flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>แสดงสินค้าเพิ่มเติม</span>
                  <span class="text-xs bg-market-green/10 text-market-green px-2 py-0.5 rounded-full font-semibold group-hover:bg-market-green group-hover:text-white transition-colors">
                    เหลืออีก {{ finalFilteredProducts.length - displayedProducts.length }} รายการ
                  </span>
                </button>
              </div>
            </div>

            <!-- No Results Message -->
            <div v-else class="text-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
              <svg class="w-16 h-16 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h2 class="text-xl font-bold text-gray-900 mb-2">ไม่พบสินค้าที่คุณค้นหา</h2>
              <p class="text-gray-500 font-medium">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่น</p>
              <button @click="resetFilters" class="mt-6 bg-market-green hover:opacity-90 text-white font-bold px-6 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-market-green focus:outline-none">
                ดูสินค้าทั้งหมด
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProducts } from '@/composables/useProducts';
import ProductCard from '@/components/ProductCard.vue';

const route = useRoute();
const router = useRouter();
const { fetchProducts } = useProducts();

const allProducts = ref([]);
const error = ref(null);

const searchQuery = ref('');
const selectedCategory = ref('');

const PAGE_SIZE = 24;
const displayLimit = ref(PAGE_SIZE);

const categories = computed(() => {
  if (!allProducts.value) return [];
  return [...new Set(allProducts.value.map(p => p.category).filter(Boolean))].sort();
});

const handleSearch = () => {
  displayLimit.value = PAGE_SIZE;
  router.replace({ query: { ...route.query, query: searchQuery.value } });
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  displayLimit.value = PAGE_SIZE;
  router.replace({ query: {} });
};

const finalFilteredProducts = computed(() => {
  let result = [...allProducts.value];

  if (searchQuery.value) {
    result = result.filter(product =>
      (product.name || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value);
  }

  result.sort((a, b) => {
    return (a.name || '').localeCompare(b.name || '', 'th');
  });

  return result;
});

const displayedProducts = computed(() => {
  return finalFilteredProducts.value.slice(0, displayLimit.value);
});

const hasMore = computed(() => {
  return displayLimit.value < finalFilteredProducts.value.length;
});

const loadMore = () => {
  displayLimit.value += PAGE_SIZE;
};

watch(selectedCategory, () => {
  displayLimit.value = PAGE_SIZE;
});

const loadInitialState = () => {
  const query = route.query.query || '';
  
  if (categories.value.includes(query)) {
    selectedCategory.value = query;
    searchQuery.value = '';
  } else {
    searchQuery.value = query;
    selectedCategory.value = '';
  }
  displayLimit.value = PAGE_SIZE;
};

watch(() => route.query.query, () => {
  loadInitialState();
});

// useLazyAsyncData renders SSR quickly without blocking client navigation
const { data: fetchedProducts, pending: loadingAsync, error: asyncError } = await useLazyAsyncData(
  'search-products',
  async () => {
    return await fetchProducts();
  },
  { default: () => [] }
);

watch(fetchedProducts, (newVal) => {
  allProducts.value = newVal || [];
}, { immediate: true });

onMounted(() => {
  if (asyncError.value) {
    error.value = 'ไม่สามารถดึงข้อมูลได้';
  }
  loadInitialState();
});
</script>
