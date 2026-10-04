<template>
  <section class="bg-[#004e38] py-10 px-4 relative overflow-hidden">
    <div class="max-w-7xl mx-auto relative z-10 flex flex-col gap-10">
        
      <!-- Row 1: Losers (Price Drops - Good for Buyers) -->
      <div v-if="loading || losers.length > 0">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 px-2">
            <h2 class="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
               <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
               สินค้าปรับราคาลง วันนี้ <span class="text-sm font-normal bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full ml-2 border border-green-500/30">น่าซื้อ</span>
            </h2>
            <div class="hidden md:flex items-center gap-2">
                <button @click="scrollRow(losersRow, -400)" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center text-white transition-colors border border-white/20">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button @click="scrollRow(losersRow, 400)" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center text-white transition-colors border border-white/20">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
        </div>

        <div v-if="loading" class="flex gap-4 overflow-x-hidden pb-6 px-2">
          <div v-for="n in 5" :key="'l-load'+n" class="bg-white rounded-lg p-3 w-[190px] flex-shrink-0 animate-pulse">
            <div class="w-full aspect-square bg-gray-200 rounded mb-3"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        <div v-else class="relative group">
            <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#004e38] to-transparent z-10 pointer-events-none opacity-0 md:group-hover:opacity-100 transition-opacity"></div>
            <div class="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#004e38] to-transparent z-10 pointer-events-none"></div>

            <div ref="losersRow" class="flex gap-4 overflow-x-auto hide-scrollbar pb-6 px-2 scroll-smooth snap-x snap-mandatory">
                <ProductCard 
                    v-for="product in losers" 
                    :key="'l-'+product._id" 
                    :product="product"
                    class="w-[190px] flex-shrink-0 shrink-0 border-none bg-white rounded-xl shadow-lg transition-transform hover:-translate-y-1 snap-start"
                />
            </div>
        </div>
      </div>

      <!-- Row 2: Gainers (Price Hikes) -->
      <div v-if="loading || gainers.length > 0">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 px-2">
            <h2 class="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
               <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
               สินค้าปรับราคาขึ้น วันนี้
            </h2>
            <div class="hidden md:flex items-center gap-2">
                <button @click="scrollRow(gainersRow, -400)" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center text-white transition-colors border border-white/20">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button @click="scrollRow(gainersRow, 400)" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center text-white transition-colors border border-white/20">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
        </div>

        <div v-if="loading" class="flex gap-4 overflow-x-hidden pb-6 px-2">
          <div v-for="n in 5" :key="'g-load'+n" class="bg-white rounded-lg p-3 w-[190px] flex-shrink-0 animate-pulse">
            <div class="w-full aspect-square bg-gray-200 rounded mb-3"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        <div v-else class="relative group">
            <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#004e38] to-transparent z-10 pointer-events-none opacity-0 md:group-hover:opacity-100 transition-opacity"></div>
            <div class="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#004e38] to-transparent z-10 pointer-events-none"></div>

            <div ref="gainersRow" class="flex gap-4 overflow-x-auto hide-scrollbar pb-6 px-2 scroll-smooth snap-x snap-mandatory">
                <ProductCard 
                    v-for="product in gainers" 
                    :key="'g-'+product._id" 
                    :product="product"
                    class="w-[190px] flex-shrink-0 shrink-0 border-none bg-white rounded-xl shadow-lg transition-transform hover:-translate-y-1 snap-start"
                />
            </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="text-center py-10">
        <p class="text-red-300 font-bold">{{ error }}</p>
      </div>

      <!-- Global See All Button -->
      <div class="mt-2 text-center">
          <NuxtLink to="/price" class="inline-flex bg-white/10 text-white border border-white/20 font-bold px-8 py-3 rounded-full text-sm items-center gap-2 hover:bg-white hover:text-market-green transition-all shadow-sm hover:shadow-md">
              ดูราคาสินค้าทั้งหมด
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </NuxtLink>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProducts } from '@/composables/useProducts';
import ProductCard from './ProductCard.vue';

const { fetchProducts } = useProducts();

const gainers = ref([]);
const losers = ref([]);
const loading = ref(true);
const error = ref(null);

const losersRow = ref(null);
const gainersRow = ref(null);

const scrollRow = (elementRef, amount) => {
  if (elementRef) {
    elementRef.scrollBy({ left: amount, behavior: 'smooth' });
  }
};

onMounted(async () => {
  try {
    const allProducts = await fetchProducts();
    
    // Gainers (Price Up)
    gainers.value = allProducts
      .filter(p => p.priceChange && p.priceChange > 0)
      .sort((a, b) => b.priceChange - a.priceChange)
      .slice(0, 10);
      
    // Losers (Price Down)
    losers.value = allProducts
      .filter(p => p.priceChange && p.priceChange < 0)
      .sort((a, b) => a.priceChange - b.priceChange)
      .slice(0, 10);

  } catch (err) {
    console.error('Failed to load products:', err);
    error.value = 'ไม่สามารถดึงข้อมูลได้';
  } finally {
    loading.value = false;
  }
});
</script>
