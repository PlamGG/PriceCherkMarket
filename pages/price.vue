<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    
    <!-- Top Search Header -->
    <div class="bg-[#004e38] text-white py-12 px-4 shadow-md relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="max-w-4xl mx-auto relative z-10 text-center">
        <h1 class="text-3xl md:text-4xl font-black mb-4 tracking-tight">ค้นหาและเปรียบเทียบราคา</h1>
        <p class="text-green-100 font-medium mb-8">เช็คราคาอัปเดตล่าสุดจากตลาดรวม ทั้งผัก ผลไม้ และเนื้อสัตว์</p>
        
        <div class="relative max-w-2xl mx-auto group">
          <input 
            type="text" 
            v-model="searchQuery" 
            @input="handleSearch"
            placeholder="พิมพ์ชื่อสินค้าที่ต้องการค้นหา เช่น กะหล่ำปลี, หมูสามชั้น..." 
            class="w-full pl-12 pr-4 py-3.5 md:py-4 text-gray-900 bg-white rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-green-400/30 transition-all font-medium text-lg placeholder-gray-400 border border-transparent focus:border-white"
          />
          <svg class="w-6 h-6 text-market-green absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
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
        <div class="md:hidden w-full overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
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
            <div v-else-if="finalFilteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              
              <NuxtLink 
                v-for="product in finalFilteredProducts" 
                :key="product._id"
                :to="`/product/${product._id}`"
                class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-market-green transition-all group flex flex-col focus:outline-none focus:ring-2 focus:ring-market-green relative"
              >
                <!-- Image Section -->
                <div class="w-full h-40 relative overflow-hidden rounded-t-2xl bg-gray-100 flex-shrink-0">
                  <img 
                    :src="product.image || getFallbackImage(product.category)" 
                    :alt="product.name" 
                    loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    @error="(e) => e.target.src = getFallbackImage(product.category)" 
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <span class="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                    {{ product.category || 'อื่นๆ' }}
                  </span>
                </div>

                <div v-if="product.price_diff > 0" 
                  class="absolute top-[135px] right-4 z-10 px-3 py-1.5 rounded-full text-sm font-black shadow-md border-2 border-white flex items-center gap-1"
                  :class="product.trend === 'down' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
                >
                  <span class="text-[16px] leading-none">{{ product.trend === 'down' ? '↓' : '↑' }}</span>
                  <span>{{ product.price_diff }} บ.</span>
                </div>

                <!-- Content Section -->
                <div class="p-4 pt-6 flex-grow flex flex-col justify-between">
                  <h3 class="font-bold text-gray-900 text-base line-clamp-1 mb-1 group-hover:text-market-green transition-colors">{{ product.name }}</h3>
                  
                  <div class="mt-auto pt-2 flex items-baseline gap-1">
                    <span class="text-2xl font-black text-gray-900 tracking-tight tabular-nums">฿{{ formatPrice(product.max_price || product.min_price) }}</span>
                    <span class="text-xs text-gray-500 font-medium">/ {{ product.unit || 'กก.' }}</span>
                  </div>
                </div>
              </NuxtLink>

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

const route = useRoute();
const router = useRouter();
const { fetchProducts } = useProducts();

const allProducts = ref([]);
const error = ref(null);

const searchQuery = ref('');
const selectedCategory = ref('');

const categories = computed(() => {
  if (!allProducts.value) return [];
  return [...new Set(allProducts.value.map(p => p.category).filter(Boolean))].sort();
});

const categoryImages = {
  'ผักสด': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
  'ผลไม้': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80',
  'เนื้อสัตว์และอาหารทะเล': 'https://png.pngtree.com/png-clipart/20240923/original/pngtree-fresh-pork-meat-freshness-png-image_16079866.png',
  'ดอกไม้': 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&q=80',
  'ของแห้งและอื่นๆ': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
  'default': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80'
};

const getFallbackImage = (category) => {
  return categoryImages[category] || categoryImages['default'];
};

const handleSearch = () => {
  router.replace({ query: { ...route.query, query: searchQuery.value } });
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  router.replace({ query: {} });
};

const formatPrice = (price) => {
  return price ? Math.round(price).toLocaleString('th-TH') : '0';
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

const loadInitialState = () => {
  const query = route.query.query || '';
  
  if (categories.value.includes(query)) {
    selectedCategory.value = query;
    searchQuery.value = '';
  } else {
    searchQuery.value = query;
    selectedCategory.value = '';
  }
};

watch(() => route.query.query, () => {
  loadInitialState();
});

// useAsyncData เป็น single source of truth สำหรับ loading state
const { data: fetchedProducts, pending: loadingAsync, error: asyncError } = await useAsyncData(
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
