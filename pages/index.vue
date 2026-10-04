<template>
  <div class="font-sans antialiased min-h-screen bg-gray-50">
    
    <!-- 1. HERO SECTION -->
    <section class="bg-market-green pt-12 pb-10">
        <div class="max-w-6xl mx-auto px-4 text-center">
            
            <!-- หัวข้อหลัก -->
            <h1 class="text-[32px] md:text-[40px] font-bold text-white mb-8 flex flex-col md:flex-row items-center justify-center gap-2">
                อัปเดตราคาสินค้า 
                <span class="bg-[#f08b33] text-white px-3 py-1 rounded shadow-sm transform -rotate-2">
                    ในตลาดรายวัน
                </span>
            </h1>

            <!-- ช่องค้นหาสินค้า -->
            <div class="max-w-4xl mx-auto relative mb-12 text-left">
                <Search />
            </div>

            <!-- ไอคอนหมวดหมู่ -->
            <div class="flex justify-start md:justify-center gap-4 md:gap-8 overflow-x-auto hide-scrollbar pb-4 px-2">
                <div 
                    v-for="cat in categoryCircles" 
                    :key="cat.name"
                    @click="goToCategory(cat.name)"
                    class="flex flex-col items-center flex-shrink-0 cursor-pointer group"
                >
                    <div class="w-[80px] h-[80px] md:w-[90px] md:h-[90px] bg-white rounded-full flex items-center justify-center p-1.5 mb-3 shadow-md group-hover:-translate-y-2 transition-transform duration-300">
                        <img 
                          :src="cat.image" 
                          :alt="cat.name" 
                          class="w-full h-full object-cover rounded-full"
                          @error="(e) => e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&q=80'"
                        >
                    </div>
                    <span class="text-white font-medium text-[13px] md:text-[15px]">{{ cat.name }}</span>
                </div>
            </div>

        </div>
    </section>

    <!-- 2. TRENDING SECTION (Today.vue) -->
    <Today />

    <!-- 2.5 CATEGORY TRENDS -->
    <CategoryTrend />

    <!-- 3. ZONES & CATEGORIES -->
    <section class="py-12 px-4">
        <div class="max-w-6xl mx-auto">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <h2 class="text-2xl font-black text-gray-800">เลือกดูสินค้าตามหมวดหมู่</h2>
                <NuxtLink to="/price" class="text-market-green font-bold text-sm hover:underline flex items-center">
                    ดูสินค้าทั้งหมด <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </NuxtLink>
            </div>
            
            <CategoryFilter />
        </div>
    </section>
    
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Today from '~/components/Today.vue';
import CategoryTrend from '~/components/CategoryTrend.vue';
import CategoryFilter from '~/components/CategoryFilter.vue';

const router = useRouter();

const categoryCircles = [
  { name: 'ผักสด', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=150&q=80' },
  { name: 'ผลไม้', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=150&q=80' },
  { name: 'เนื้อสัตว์และอาหารทะเล', image: 'https://png.pngtree.com/png-clipart/20240923/original/pngtree-fresh-pork-meat-freshness-png-image_16079866.png' },
  { name: 'ดอกไม้', image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=150&q=80' },
  { name: 'ของแห้งและอื่นๆ', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=150&q=80' }
];

const goToCategory = (category) => {
  router.push({ path: '/price', query: { query: category } });
};
</script>
