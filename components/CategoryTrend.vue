<template>
  <section class="bg-white py-2 mt-4 border-y border-gray-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-2 text-market-green">
          <svg class="w-6 h-6 text-market-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          <h2 class="text-2xl font-bold text-gray-900">แนวโน้มราคาเฉลี่ยตามหมวดหมู่</h2>
        </div>
        <NuxtLink to="/price" class="text-sm font-bold text-market-green hover:underline flex items-center gap-1 group">
          <span>ดูราคาทั้งหมด</span>
          <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </NuxtLink>
      </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
      <div v-for="n in 5" :key="n" class="bg-white border border-gray-100 rounded-2xl p-5 w-[250px] lg:flex-1 flex-shrink-0 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div class="h-8 bg-gray-100 rounded w-3/4 mb-3"></div>
        <div class="h-16 bg-gray-100 rounded w-full mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    </div>

    <!-- Category Cards -->
    <div v-else class="flex gap-4 overflow-x-auto hide-scrollbar pb-6 px-1">
      <div 
        v-for="cat in categoryTrends" 
        :key="cat.name" 
        @click="goToCategory(cat.name)"
        class="bg-white border border-gray-200 hover:border-market-green hover:shadow-lg transition-all duration-300 rounded-2xl p-5 w-[260px] lg:flex-1 flex-shrink-0 relative overflow-hidden group cursor-pointer hover:-translate-y-1 flex flex-col justify-between"
      >
        <div>
          <!-- Header: Category Name + Trend Badge -->
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="font-bold text-gray-900 text-lg group-hover:text-market-green transition-colors">{{ cat.name }}</h3>
              <span class="text-xs text-gray-400 font-medium">{{ cat.itemCount }} รายการ</span>
            </div>
            
            <div v-if="cat.trend !== 'same'" 
              class="text-xs font-bold px-2 py-1 rounded-md border flex items-center gap-1 shadow-xs"
              :class="cat.trend === 'up' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'"
            >
              <span>{{ cat.trend === 'up' ? '▲' : '▼' }}</span>
              <span>{{ cat.trend === 'up' ? 'แพงขึ้น' : 'ถูกลง' }}</span>
              <span>{{ Math.abs(cat.averageChange).toFixed(1) }}%</span>
            </div>
            <div v-else class="text-xs font-bold px-2 py-1 rounded-md border bg-gray-50 text-gray-500 border-gray-200">
              ▬ ทรงตัว
            </div>
          </div>

          <!-- Average Category Price -->
          <div class="mb-3">
            <div class="text-2xl font-black text-gray-900 tracking-tight tabular-nums">
              ฿{{ formatPrice(cat.currentPrice) }}
              <span class="text-xs font-medium text-gray-500 tracking-normal">/ กก. เฉลี่ย</span>
            </div>
          </div>

          <!-- Sparkline Graph -->
          <div class="h-16 w-full relative flex items-end mb-3 bg-gray-50/50 rounded-lg p-1.5">
            <svg v-if="cat.points && cat.points.length > 1" class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient :id="'gradient-' + cat.name" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" :stop-color="cat.trend === 'down' ? '#10B981' : (cat.trend === 'up' ? '#EF4444' : '#9CA3AF')" stop-opacity="0.25" />
                  <stop offset="100%" :stop-color="cat.trend === 'down' ? '#10B981' : (cat.trend === 'up' ? '#EF4444' : '#9CA3AF')" stop-opacity="0.0" />
                </linearGradient>
              </defs>
              <!-- Fill Area -->
              <path :d="cat.fillPath" :fill="'url(#gradient-' + cat.name + ')'" />
              <!-- Stroke Line -->
              <path :d="cat.linePath" fill="none" :stroke="cat.trend === 'down' ? '#10B981' : (cat.trend === 'up' ? '#EF4444' : '#9CA3AF')" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              <!-- Points -->
              <circle v-for="(pt, idx) in cat.coords" :key="idx" :cx="pt.x" :cy="pt.y" r="2.5" :fill="cat.trend === 'down' ? '#10B981' : (cat.trend === 'up' ? '#EF4444' : '#9CA3AF')" />
            </svg>
            <div v-else class="w-full h-full flex items-center justify-center text-xs text-gray-400">ไม่มีข้อมูลย้อนหลังเพียงพอ</div>
          </div>
        </div>

        <div>
          <!-- Key Driver (สินค้าที่ราคาผันผวนสุด) -->
          <div v-if="cat.keyDriver" class="text-[11px] font-medium text-gray-600 bg-gray-50 group-hover:bg-emerald-50/40 p-2 rounded-lg flex items-center justify-between transition-colors">
            <span class="flex items-center gap-1.5 truncate">
              <span class="w-2 h-2 rounded-full shrink-0" :class="cat.keyDriver.change > 0 ? 'bg-red-500' : (cat.keyDriver.change < 0 ? 'bg-emerald-500' : 'bg-gray-400')"></span>
              <span class="text-gray-400">ผันผวนสุด:</span>
              <strong class="text-gray-800 truncate max-w-[95px]">{{ cat.keyDriver.name }}</strong>
            </span>
            <span class="font-bold shrink-0 ml-1" :class="cat.keyDriver.change > 0 ? 'text-red-500' : (cat.keyDriver.change < 0 ? 'text-emerald-600' : 'text-gray-500')">
              {{ cat.keyDriver.change > 0 ? '+' : '' }}{{ cat.keyDriver.change.toFixed(1) }}%
            </span>
          </div>

          <!-- Click CTA Hint -->
          <div class="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-400 group-hover:text-market-green transition-colors">
            <span>ดูสินค้าในหมวดหมู่นี้</span>
            <span>→</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProducts } from '@/composables/useProducts';

const router = useRouter();
const { fetchProducts } = useProducts();
const loading = ref(true);
const categoryTrends = ref([]);

const macroCategories = ['ผักสด', 'ผลไม้', 'เนื้อสัตว์และอาหารทะเล', 'ดอกไม้', 'ของแห้งและอื่นๆ'];

const formatPrice = (price) => {
  return price ? Math.round(price).toLocaleString('th-TH') : '0';
};

const goToCategory = (categoryName) => {
  router.push({ path: '/price', query: { query: categoryName } });
};

onMounted(async () => {
  try {
    const products = await fetchProducts();
    
    const grouped = macroCategories.map(catName => {
      const catProducts = products.filter(p => p.category === catName);
      if (catProducts.length === 0) return null;

      let keyDriver = null;
      let maxAbsChange = -1;
      
      const dailyAverages = {};
      
      catProducts.forEach(p => {
        if (p.priceChange !== undefined && Math.abs(p.priceChange) > maxAbsChange) {
          maxAbsChange = Math.abs(p.priceChange);
          keyDriver = { name: p.name, change: p.priceChange };
        }

        if (p.raw_data && p.raw_data.price_records) {
          p.raw_data.price_records.forEach(record => {
            const date = record.record_date.split('T')[0];
            if (!dailyAverages[date]) dailyAverages[date] = [];
            dailyAverages[date].push((record.min_price + record.max_price) / 2);
          });
        }
      });

      const sortedDates = Object.keys(dailyAverages).sort();
      const last7Dates = sortedDates.slice(-7);
      
      const chartPoints = last7Dates.map(date => {
        const prices = dailyAverages[date];
        return prices.reduce((a, b) => a + b, 0) / prices.length;
      });

      let trend = 'same';
      let averageChange = 0;
      if (chartPoints.length >= 2) {
        const todayAvg = chartPoints[chartPoints.length - 1];
        const ytdAvg = chartPoints[chartPoints.length - 2];
        if (ytdAvg > 0) {
          averageChange = ((todayAvg - ytdAvg) / ytdAvg) * 100;
        }
        if (averageChange > 0.1) trend = 'up';
        else if (averageChange < -0.1) trend = 'down';
      }

      let linePath = '';
      let fillPath = '';
      let coords = [];

      if (chartPoints.length > 1) {
        const minVal = Math.min(...chartPoints);
        const maxVal = Math.max(...chartPoints);
        const range = maxVal - minVal || 1;
        
        const w = 100;
        const h = 100;
        const stepX = w / (chartPoints.length - 1);
        
        coords = chartPoints.map((val, i) => {
          const x = Math.round(i * stepX);
          const normalizedY = (val - minVal) / range;
          const y = Math.round(h - (normalizedY * h * 0.7) - (h * 0.15));
          return { x, y };
        });

        linePath = `M ${coords[0].x} ${coords[0].y} ` + coords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ');
        fillPath = linePath + ` L ${coords[coords.length-1].x} 100 L ${coords[0].x} 100 Z`;
      }

      const currentPrice = chartPoints.length > 0 
        ? chartPoints[chartPoints.length - 1] 
        : (catProducts.reduce((sum, p) => sum + (p.max_price || p.min_price || 0), 0) / (catProducts.length || 1));

      return {
        name: catName,
        itemCount: catProducts.length,
        currentPrice,
        averageChange,
        trend,
        keyDriver,
        points: chartPoints,
        coords,
        linePath,
        fillPath
      };
    }).filter(Boolean);

    categoryTrends.value = grouped;
  } catch (error) {
    console.error("Error loading category trends:", error);
  } finally {
    loading.value = false;
  }
});
</script>
