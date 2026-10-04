<template>
  <section class="bg-white py-2 mt-4 border-y border-gray-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex items-center gap-2 mb-8 text-market-green">
        <svg class="w-6 h-6 text-market-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
        <h2 class="text-2xl font-bold text-market-green">แนวโน้มราคาเฉลี่ยตามหมวดหมู่</h2>
      </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
      <div v-for="n in 5" :key="n" class="bg-white border border-gray-100 rounded-2xl p-4 w-[240px] lg:flex-1 flex-shrink-0 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div class="h-16 bg-gray-100 rounded w-full mb-4"></div>
        <div class="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>

    <!-- Category Cards -->
    <div v-else class="flex gap-4 overflow-x-auto hide-scrollbar pb-6 px-1">
      <div 
        v-for="cat in categoryTrends" 
        :key="cat.name" 
        class="bg-white border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-300 rounded-2xl p-5 w-[240px] lg:flex-1 flex-shrink-0 relative overflow-hidden group cursor-pointer"
      >
        <div class="flex justify-between items-start mb-4 relative z-10">
          <h3 class="font-bold text-gray-900 text-lg">{{ cat.name }}</h3>
          
          <div v-if="cat.trend !== 'same'" 
            class="text-xs font-bold px-2 py-1 rounded-md border flex items-center gap-1"
            :class="cat.trend === 'up' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'"
          >
            <span>{{ cat.trend === 'up' ? 'แพงขึ้น' : 'ถูกลง' }}</span>
            <span>{{ Math.abs(cat.averageChange).toFixed(1) }}%</span>
          </div>
          <div v-else class="text-xs font-bold px-2 py-1 rounded-md border bg-gray-50 text-gray-500 border-gray-200">
            ทรงตัว
          </div>
        </div>

        <!-- Real Sparkline Graph -->
        <div class="h-20 w-full relative z-10 flex items-end mb-3">
          <svg v-if="cat.points && cat.points.length > 1" class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            <!-- Line -->
            <path :d="cat.linePath" fill="none" :stroke="cat.trend === 'down' ? '#10B981' : (cat.trend === 'up' ? '#EF4444' : '#9CA3AF')" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div v-else class="w-full h-full flex items-center justify-center text-xs text-gray-400">ไม่มีข้อมูลย้อนหลังเพียงพอ</div>
        </div>

        <!-- Key Driver (สินค้าตัวการ) -->
        <div v-if="cat.keyDriver" class="relative z-10 text-[11px] font-medium text-gray-500 bg-gray-50 p-2 rounded-lg flex items-center justify-between group-hover:bg-gray-100 transition-colors">
           <span class="flex items-center gap-1">
             <span class="w-1.5 h-1.5 rounded-full" :class="cat.trend === 'down' ? 'bg-green-500' : 'bg-red-500'"></span>
             ตัวการหลัก: <strong class="text-gray-800 ml-0.5 truncate max-w-[90px]">{{ cat.keyDriver.name }}</strong>
           </span>
           <span :class="cat.keyDriver.change > 0 ? 'text-red-500' : 'text-green-500'">
             {{ cat.keyDriver.change > 0 ? '+' : '' }}{{ cat.keyDriver.change.toFixed(1) }}%
           </span>
        </div>
      </div>
    </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProducts } from '@/composables/useProducts';

const { fetchProducts } = useProducts();
const loading = ref(true);
const categoryTrends = ref([]);

// จัดกลุ่มตาม 5 หมวดหมู่หลัก
const macroCategories = ['ผักสด', 'ผลไม้', 'เนื้อสัตว์และอาหารทะเล', 'ดอกไม้', 'ของแห้งและอื่นๆ'];

onMounted(async () => {
  try {
    const products = await fetchProducts();
    
    // คำนวณค่าเฉลี่ยแบบกลุ่ม และดึง historical records
    const grouped = macroCategories.map(catName => {
      const catProducts = products.filter(p => p.category === catName);
      if (catProducts.length === 0) return null;

      // หาสินค้าที่ผันผวนมากที่สุดในหมวดหมู่นี้เพื่อเป็น Key Driver
      let keyDriver = null;
      let maxAbsChange = -1;
      
      // หาแนวโน้มราคาเฉลี่ยรวมของหมวดหมู่ในรอบ 7 วัน
      const dailyAverages = {}; // { '2023-10-01': [100, 50, ...], ... }
      
      catProducts.forEach(p => {
        if (p.priceChange !== undefined && Math.abs(p.priceChange) > maxAbsChange) {
          maxAbsChange = Math.abs(p.priceChange);
          keyDriver = { name: p.name, change: p.priceChange };
        }

        // ดึง price_records จาก raw_data 
        if (p.raw_data && p.raw_data.price_records) {
          p.raw_data.price_records.forEach(record => {
            const date = record.record_date.split('T')[0];
            if (!dailyAverages[date]) dailyAverages[date] = [];
            dailyAverages[date].push((record.min_price + record.max_price) / 2);
          });
        }
      });

      // สรุปค่าเฉลี่ยรายวัน
      const sortedDates = Object.keys(dailyAverages).sort(); // เรียงจากเก่าไปใหม่
      // เอาแค่ 7 วันล่าสุด
      const last7Dates = sortedDates.slice(-7);
      
      const chartPoints = last7Dates.map(date => {
        const prices = dailyAverages[date];
        const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
        return avg;
      });

      // หา % เปลี่ยนแปลงรวมของหมวดนี้ (เทียบวันล่าสุดกับวันก่อนหน้า)
      let trend = 'same';
      let averageChange = 0;
      if (chartPoints.length >= 2) {
        const todayAvg = chartPoints[chartPoints.length - 1];
        const ytdAvg = chartPoints[chartPoints.length - 2];
        averageChange = ((todayAvg - ytdAvg) / ytdAvg) * 100;
        if (averageChange > 0.1) trend = 'up';
        else if (averageChange < -0.1) trend = 'down';
      }

      // วาดกราฟ SVG Path
      let linePath = '';
      let fillPath = '';
      if (chartPoints.length > 1) {
        const minVal = Math.min(...chartPoints);
        const maxVal = Math.max(...chartPoints);
        const range = maxVal - minVal || 1; // กันหาร 0
        
        // normalize points to 0-100 x/y
        const w = 100;
        const h = 100;
        const stepX = w / (chartPoints.length - 1);
        
        const coords = chartPoints.map((val, i) => {
          const x = i * stepX;
          // Invert Y axis because SVG 0,0 is top left. Leave 10% padding
          const normalizedY = ((val - minVal) / range);
          const y = h - (normalizedY * h * 0.8) - (h * 0.1); 
          return { x, y };
        });

        linePath = `M ${coords[0].x} ${coords[0].y} ` + coords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ');
        fillPath = linePath + ` L ${coords[coords.length-1].x} 100 L 0 100 Z`;
      }

      return {
        name: catName,
        averageChange,
        trend,
        keyDriver,
        points: chartPoints,
        linePath,
        fillPath
      };
    }).filter(Boolean); // ลบ null

    categoryTrends.value = grouped;
  } catch (error) {
    console.error("Error loading category trends:", error);
  } finally {
    loading.value = false;
  }
});
</script>
