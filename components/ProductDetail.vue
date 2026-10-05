<template>
  <div class="max-w-7xl mx-auto px-4 md:px-6">
    <div v-if="error" class="text-center p-10 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold">
      {{ error }}
    </div>

    <div v-else-if="product">
      <!-- Breadcrumb -->
      <p class="text-sm text-market-green mb-6 font-medium">
        ราคาสินค้า <span class="text-gray-400">/ {{ product.name }}</span>
      </p>

      <!-- Section 1: Overview & Chart (Card Container) -->
      <div class="bg-white rounded-3xl border border-gray-200 shadow-sm p-4 sm:p-6 md:p-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
          
          <!-- Left: Image (4 cols) -->
          <div class="lg:col-span-4 flex flex-col">
            <div class="w-full aspect-square bg-emerald-50/80 rounded-2xl flex items-center justify-center p-6 lg:p-10 border border-emerald-100 relative overflow-hidden group h-full shadow-inner">
              <img 
                :src="product.image || '/placeholder.png'" 
                :alt="product.name" 
                class="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                @error="(e) => e.target.src = '/placeholder.png'"
              />
            </div>
          </div>

          <!-- Right: Info & Chart (8 cols) -->
          <div class="lg:col-span-8 flex flex-col">
            <h1 class="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">{{ product.name }}</h1>
            
            <div class="flex flex-wrap items-center gap-3 mb-3">
              <span class="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tabular-nums tracking-tight">
                ฿{{ formatPrice(product.min_price) }} - {{ formatPrice(product.max_price) }}
              </span>
              <span class="text-gray-500 font-semibold text-base sm:text-lg">/ {{ product.unit || 'กก.' }}</span>
              
              <div 
                v-if="product.priceChange !== undefined"
                class="ml-1 sm:ml-2 px-3 py-1 rounded-full text-xs sm:text-sm font-black shadow-xs flex items-center gap-1"
                :class="product.trend === 'down' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : (product.trend === 'up' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-gray-100 text-gray-700 border border-gray-200')"
              >
                <span v-if="product.trend === 'up'">↑</span>
                <span v-else-if="product.trend === 'down'">↓</span>
                <span v-else>-</span>
                {{ Math.abs(product.priceChange).toFixed(1) }}%
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 text-xs sm:text-sm font-semibold">
              <div class="flex items-center gap-1.5 text-gray-600">
                <svg class="w-4 h-4 text-market-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>{{ product.market || 'ตลาดผักและสมุนไพร 2' }}</span>
              </div>
              <div class="flex items-center gap-1.5 text-gray-500">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>อัปเดต: {{ todayDateText }}</span>
              </div>
            </div>

            <!-- Chart Section -->
            <div class="border-t border-gray-200 pt-6 md:pt-8 flex-grow flex flex-col overflow-hidden">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <!-- Period Selectors (High-contrast solid active buttons) -->
                <div class="flex gap-2 w-full sm:w-auto">
                  <button @click="setPeriod('10d')" :class="['flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 text-xs sm:text-sm transition-all rounded-lg font-bold shadow-xs', activePeriod === '10d' ? 'bg-market-green text-white border border-market-green' : 'text-gray-600 bg-white border border-gray-300 hover:border-market-green hover:text-market-green']">10 วัน</button>
                  <button @click="setPeriod('1m')" :class="['flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 text-xs sm:text-sm transition-all rounded-lg font-bold shadow-xs', activePeriod === '1m' ? 'bg-market-green text-white border border-market-green' : 'text-gray-600 bg-white border border-gray-300 hover:border-market-green hover:text-market-green']">1 เดือน</button>
                  <button @click="setPeriod('1y')" :class="['flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 text-xs sm:text-sm transition-all rounded-lg font-bold shadow-xs', activePeriod === '1y' ? 'bg-market-green text-white border border-market-green' : 'text-gray-600 bg-white border border-gray-300 hover:border-market-green hover:text-market-green']">1 ปี</button>
                </div>

                <!-- Date Range Pill -->
                <div class="bg-gray-100 text-gray-700 border border-gray-200 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 self-start sm:self-auto">
                  {{ dateRangeText }}
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
              </div>

              <!-- Real price history chart -->
              <div class="relative w-full flex-grow min-h-[260px] overflow-hidden">
                <ProductChart 
                  :priceHistory="product.price_history || []" 
                  :selectedRange="activePeriod" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Historical Table Section (Professional Wholesale Board) -->
      <div v-if="tableData.length > 0" class="mt-8 bg-white rounded-3xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <h3 class="font-black text-gray-900 text-xl sm:text-2xl flex items-center gap-2">
            <svg class="w-6 h-6 text-market-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            ตารางราคาย้อนหลัง 7 วัน
            <span v-if="summary7Days && summary7Days.daysCount < 7" class="text-xs font-semibold text-gray-400">
              ({{ summary7Days.daysCount }} วัน)
            </span>
          </h3>
          <span class="text-[11px] sm:text-xs font-bold text-market-green bg-green-50 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-green-200 shadow-xs self-start sm:self-auto">
            อัปเดตรายวัน 06:00 น.
          </span>
        </div>

        <!-- 7-Day Summary Cards -->
        <div v-if="summary7Days" class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div class="bg-gray-50/80 rounded-2xl p-4 border border-gray-200/80 flex items-center justify-between shadow-2xs">
            <div>
              <p class="text-xs font-bold text-gray-500 mb-1">ราคาสูงสุดรอบ 7 วัน</p>
              <p class="text-xl sm:text-2xl font-black text-emerald-700 tracking-tight tabular-nums">฿{{ formatPrice(summary7Days.highest) }}</p>
            </div>
            <span class="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-100/70 text-emerald-800">MAX</span>
          </div>

          <div class="bg-gray-50/80 rounded-2xl p-4 border border-gray-200/80 flex items-center justify-between shadow-2xs">
            <div>
              <p class="text-xs font-bold text-gray-500 mb-1">ราคาต่ำสุดรอบ 7 วัน</p>
              <p class="text-xl sm:text-2xl font-black text-amber-700 tracking-tight tabular-nums">฿{{ formatPrice(summary7Days.lowest) }}</p>
            </div>
            <span class="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-100/70 text-amber-800">MIN</span>
          </div>

          <div class="bg-gray-50/80 rounded-2xl p-4 border border-gray-200/80 flex items-center justify-between shadow-2xs">
            <div>
              <p class="text-xs font-bold text-gray-500 mb-1">แนวโน้มราคา 7 วัน</p>
              <p class="text-xl sm:text-2xl font-black tracking-tight tabular-nums" :class="summary7Days.totalDiff > 0 ? 'text-rose-600' : (summary7Days.totalDiff < 0 ? 'text-emerald-700' : 'text-gray-700')">
                <span v-if="summary7Days.totalDiff > 0">↑ +{{ summary7Days.totalPercent }}%</span>
                <span v-else-if="summary7Days.totalDiff < 0">↓ {{ summary7Days.totalPercent }}%</span>
                <span v-else>คงที่ (0%)</span>
              </p>
            </div>
            <span class="text-xs font-black px-2.5 py-1 rounded-lg tabular-nums" :class="summary7Days.totalDiff > 0 ? 'bg-rose-100 text-rose-800' : (summary7Days.totalDiff < 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700')">
              {{ summary7Days.totalDiff === 0 ? '฿0' : (summary7Days.totalDiff > 0 ? '+฿' : '-฿') + formatPrice(Math.abs(summary7Days.totalDiff)) }}
            </span>
          </div>
        </div>
        
        <!-- Desktop Table with Dark Green Header -->
        <div class="hidden md:block overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
          <table class="w-full text-left border-collapse">
            <thead class="bg-[#004e38] text-white">
              <tr class="text-sm font-bold">
                <th class="py-4 px-6 tracking-wide">วันที่บันทึกราคา</th>
                <th class="py-4 px-6 text-right tracking-wide">ราคาสูงสุด</th>
                <th class="py-4 px-6 text-right tracking-wide">ราคาต่ำสุด</th>
                <th class="py-4 px-6 text-center tracking-wide">ช่วงราคา</th>
                <th class="py-4 px-6 text-right tracking-wide">การเปลี่ยนแปลง (เทียบวันก่อน)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(record, idx) in tableData" :key="record.dateStr" 
                  :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'"
                  class="border-t border-gray-100 hover:bg-green-50/40 transition-colors">
                <td class="py-4 px-6">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-gray-800">{{ record.dateStr }}</span>
                    <span v-if="record.isLatest" class="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ล่าสุด
                    </span>
                  </div>
                </td>
                <td class="py-4 px-6 text-right text-emerald-700 font-black tabular-nums text-base">฿{{ formatPrice(record.max) }}</td>
                <td class="py-4 px-6 text-right text-amber-700 font-black tabular-nums text-base">฿{{ formatPrice(record.min) }}</td>
                <td class="py-4 px-6 text-center">
                  <span class="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full tabular-nums">
                    ฿{{ formatPrice(record.min) }} – ฿{{ formatPrice(record.max) }}
                  </span>
                </td>
                <td class="py-4 px-6 text-right">
                   <div class="inline-flex items-center justify-end gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-2xs tabular-nums" 
                        :class="record.diff === 0 ? 'bg-gray-100 text-gray-600 border border-gray-200' : (record.diff > 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200')">
                     <span v-if="record.diff > 0">↑ +{{ record.diffPercent }}% (+฿{{ formatPrice(record.diff) }})</span>
                     <span v-else-if="record.diff < 0">↓ {{ record.diffPercent }}% (-฿{{ formatPrice(Math.abs(record.diff)) }})</span>
                     <span v-else>คงที่ (0%)</span>
                   </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden flex flex-col gap-3">
          <div v-for="record in tableData" :key="'mob-'+record.dateStr" class="border border-gray-200 rounded-2xl p-4 bg-gray-50/60 shadow-xs">
            <div class="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
              <div class="flex items-center gap-2">
                <span class="font-black text-gray-800">{{ record.dateStr }}</span>
                <span v-if="record.isLatest" class="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ล่าสุด
                </span>
              </div>
              <div class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tabular-nums" 
                   :class="record.diff === 0 ? 'bg-gray-100 text-gray-600' : (record.diff > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800')">
                <span v-if="record.diff > 0">↑ +{{ record.diffPercent }}% (+฿{{ formatPrice(record.diff) }})</span>
                <span v-else-if="record.diff < 0">↓ {{ record.diffPercent }}% (-฿{{ formatPrice(Math.abs(record.diff)) }})</span>
                <span v-else>คงที่ (0%)</span>
              </div>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-500 font-medium">ราคาสูงสุด</span>
              <span class="text-emerald-700 font-black text-lg tabular-nums">฿{{ formatPrice(record.max) }}</span>
            </div>
            <div class="flex justify-between items-center text-sm mt-1.5">
              <span class="text-gray-500 font-medium">ราคาต่ำสุด</span>
              <span class="text-amber-700 font-black text-lg tabular-nums">฿{{ formatPrice(record.min) }}</span>
            </div>
            <div class="flex justify-between items-center text-xs mt-2 pt-2 border-t border-gray-200/60 text-gray-500">
              <span>ช่วงราคา</span>
              <span class="font-bold text-gray-700 tabular-nums">฿{{ formatPrice(record.min) }} – ฿{{ formatPrice(record.max) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State if no history -->
      <div v-else class="mt-8 bg-white rounded-3xl border border-gray-200 p-8 text-center max-w-7xl mx-auto shadow-sm">
        <p class="text-gray-500 font-medium">กำลังสะสมข้อมูลประวัติราคาสำหรับสินค้านี้</p>
      </div>

      <!-- Section 3: Related Products Section (High-Contrast Gray Backdrop) -->
      <div v-if="relatedProducts.length > 0" class="mt-8 mb-12 bg-gray-100/80 rounded-3xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-xs">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h3 class="font-black text-gray-900 text-xl sm:text-2xl flex items-center gap-2">
            สินค้าในหมวด <span class="text-market-green">{{ product.category }}</span>
          </h3>
          <NuxtLink :to="`/price?query=${product.category}`" class="text-xs sm:text-sm font-bold text-market-green hover:underline flex items-center gap-1 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs self-start sm:self-auto">
            ดูทั้งหมดในหมวดนี้
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </NuxtLink>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <ProductCard 
            v-for="item in relatedProducts" 
            :key="item._id" 
            :product="item" 
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import ProductChart from './ProductChart.vue';
import ProductCard from './ProductCard.vue';
import { useProducts } from '~/composables/useProducts';

const props = defineProps({
  product: Object,
  loading: Boolean,
  error: String
});

const activePeriod = ref('1m');
const formatPrice = (p) => p ? Math.round(p).toLocaleString('th-TH') : '0';
const setPeriod = (p) => { activePeriod.value = p; };

const dateRangeText = computed(() => {
  if (!props.product || !props.product.price_history || props.product.price_history.length === 0) return 'ไม่มีข้อมูล';
  
  const rangeMap = { '10d': 10, '1m': 30, '1y': 365 };
  const daysAgo = rangeMap[activePeriod.value] || 30;
  
  const now = new Date();
  const cutoffDate = new Date(now.getTime()); 
  cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

  const filtered = props.product.price_history.filter(record => new Date(record.record_date) >= cutoffDate);
  if (filtered.length === 0) return 'ไม่มีข้อมูล';

  const dates = filtered.map(d => new Date(d.record_date)).sort((a, b) => a - b);
  const start = dates[0];
  const end = dates[dates.length - 1];

  const format = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  return `${format(start)} - ${format(end)}`;
});

const todayDateText = computed(() => {
  if (!props.product || !props.product.price_history || props.product.price_history.length === 0) return 'วันนี้ 06:00 น.';
  const latestDate = new Date(props.product.price_history[0].record_date);
  const format = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  return `${format(latestDate)} 06:00 น.`;
});

// Calculate Table Data (Last 7 distinct days)
const tableData = computed(() => {
  if (!props.product || !props.product.price_history) return [];
  
  // 1. Group by record_date to prevent duplicate days from morning/evening time slots
  const historyByDate = new Map();
  for (const record of props.product.price_history) {
    const d = record.record_date;
    if (!historyByDate.has(d)) {
      historyByDate.set(d, { ...record });
    } else if (record.time_slot === 'evening') {
      // Prioritize evening slot as latest price of the day
      historyByDate.set(d, { ...record });
    }
  }

  // 2. Sort descending by date
  const sortedDays = Array.from(historyByDate.values())
    .sort((a, b) => new Date(b.record_date) - new Date(a.record_date));
  
  const last7 = sortedDays.slice(0, 7);
  
  return last7.map((record, index) => {
    const d = new Date(record.record_date);
    const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    const isLatest = index === 0;
    
    // Calculate difference against previous day (index + 1)
    let diff = 0;
    let diffPercent = 0;
    if (index + 1 < sortedDays.length) {
      const prevRecord = sortedDays[index + 1];
      diff = record.min_price - prevRecord.min_price;
      if (prevRecord.min_price > 0) {
        diffPercent = Number(((diff / prevRecord.min_price) * 100).toFixed(1));
      }
    }

    return {
      dateStr,
      isLatest,
      max: record.max_price,
      min: record.min_price,
      diff,
      diffPercent
    };
  });
});

// Summary statistics for 7-day period
const summary7Days = computed(() => {
  const data = tableData.value;
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => d.max));
  const minVal = Math.min(...data.map(d => d.min));

  const latestMin = data[0].min;
  const oldestMin = data[data.length - 1].min;
  const totalDiff = latestMin - oldestMin;
  const totalPercent = oldestMin > 0 ? Number(((totalDiff / oldestMin) * 100).toFixed(1)) : 0;

  return {
    highest: maxVal,
    lowest: minVal,
    totalDiff,
    totalPercent,
    daysCount: data.length
  };
});

// Fetch Related Products (Smart Match + Shuffled Variety)
const { getProductsByCategory } = useProducts();
const relatedProducts = ref([]);

watchEffect(async () => {
  if (props.product && props.product.category) {
    try {
      const allInCategory = await getProductsByCategory(props.product.category);
      const currentName = props.product.name || '';
      const currentId = props.product._id;

      // Extract significant head keyword (e.g. "หมู", "กล้วย", "พริก")
      const baseWord = currentName
        .replace(/^[-–\s]+/, '')
        .split(/[\s–\-()]+/)[0]
        .replace(/[0-9]+/, '')
        .trim();

      const candidatePool = allInCategory.filter(p => p._id !== currentId);

      // 1. First priority: products sharing base keyword
      const similar = (baseWord && baseWord.length >= 2)
        ? candidatePool.filter(p => p.name && p.name.includes(baseWord))
        : [];

      // 2. Second priority: other products in category shuffled for variety
      const others = candidatePool
        .filter(p => !similar.some(s => s._id === p._id))
        .sort(() => 0.5 - Math.random());

      // Combine up to 6 items (balances 2 cols on mobile, 3 on tablet, 6 on desktop)
      relatedProducts.value = [...similar, ...others].slice(0, 6);
    } catch (e) {
      console.error('Failed to load related products', e);
    }
  }
});

watchEffect(() => {
  if (props.product && props.product.name) {
    useHead({
      title: `ราคา ${props.product.name} วันนี้ - ตลาดไท`,
      meta: [
        { name: 'description', content: `เช็คราคา${props.product.name}ล่าสุด อัปเดตรายวันจากตลาดไท พร้อมกราฟแนวโน้มราคาย้อนหลัง` }
      ]
    })
  }
});

</script>
