<template>
  <div class="relative w-full h-full min-h-[320px] font-sans pb-8" ref="containerRef" @mousemove="onInteraction" @mouseleave="onLeave" @touchstart.passive="onTouchStart" @touchmove.passive="onTouchMove" @touchend="onLeave" @touchcancel="onLeave">
    
    <svg v-if="processedData.length > 1 && width > 0" class="w-full h-full overflow-visible absolute inset-0">
      <defs>
        <filter id="glow-max" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-min" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Grid Lines -->
      <g class="text-gray-100" stroke="currentColor" stroke-width="1">
        <line v-for="grid in gridLines" :key="'gl'+grid.y" :x1="padding.left" :y1="grid.y" :x2="width - padding.right" :y2="grid.y" />
      </g>
      
      <!-- Y-Axis Labels (Right Side) -->
      <g class="text-gray-500 text-[11px]" fill="currentColor">
        <text v-for="grid in gridLines" :key="'gy'+grid.y" :x="width - padding.right + 10" :y="grid.y + 4" text-anchor="start">{{ Math.round(grid.val) }}</text>
      </g>
      
      <!-- X-Axis Labels (Rotated) -->
      <g class="text-gray-500 text-[11px]" fill="currentColor">
        <text v-for="label in xLabels" :key="'gx'+label.x" :x="label.x" :y="height - padding.bottom + 15" text-anchor="end" :transform="`rotate(-40, ${label.x}, ${height - padding.bottom + 15})`">{{ label.text }}</text>
      </g>

      <!-- Data Visuals (Lines Only) -->
      <g>
        <path :d="maxPath" class="transition-all duration-500 ease-in-out" fill="none" stroke="#10b981" stroke-width="3" filter="url(#glow-max)"></path>
        <path :d="minPath" class="transition-all duration-500 ease-in-out" fill="none" stroke="#facc15" stroke-width="3" filter="url(#glow-min)"></path>
      </g>
    </svg>

    <!-- Legend -->
    <div v-if="processedData.length > 1" class="absolute bottom-0 left-0 right-0 flex items-center justify-start pl-[35px] gap-6 text-[11px] font-medium text-gray-500 pointer-events-none">
      <div class="flex items-center gap-1.5"><div class="w-4 h-0.5 bg-[#10b981] rounded-full"></div> ราคาสูงสุด</div>
      <div class="flex items-center gap-1.5"><div class="w-4 h-0.5 bg-[#facc15] rounded-full"></div> ราคาต่ำสุด</div>
    </div>

    <!-- Empty State -->
    <div v-if="processedData.length <= 1" class="absolute inset-0 flex items-center justify-center text-gray-400 font-semibold border-2 border-dashed border-gray-200 rounded-2xl">
      ไม่มีข้อมูลย้อนหลังในช่วงเวลานี้
    </div>

    <!-- Hover UI -->
    <div v-if="hoveredPoint" class="absolute inset-0 pointer-events-none z-20">
      <div class="absolute top-0 bottom-8 w-px bg-gray-400/30 transition-all duration-75" :style="{ left: hoveredPoint.x + 'px' }"></div>
      <div class="absolute w-4 h-4 bg-white border-[3px] border-[#10b981] rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all duration-75" :style="{ left: hoveredPoint.x + 'px', top: hoveredPoint.yMax + 'px' }"></div>
      <div class="absolute w-4 h-4 bg-white border-[3px] border-[#facc15] rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(250,204,21,0.8)] transition-all duration-75" :style="{ left: hoveredPoint.x + 'px', top: hoveredPoint.yMin + 'px' }"></div>
      
      <div class="absolute glass-tooltip rounded-xl p-3 transform -translate-x-1/2 mt-3 z-30 min-w-[140px] transition-all duration-100" 
           :style="{ left: hoveredPoint.x + 'px', top: (hoveredPoint.yMax - 85 < 0 ? hoveredPoint.yMax + 20 : hoveredPoint.yMax - 85) + 'px' }">
        <div class="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 text-center border-b border-gray-100 pb-1">{{ hoveredPoint.data.date }}</div>
        <div class="flex justify-between items-center text-sm mb-1">
          <span class="text-emerald-600 font-bold flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span> สูงสุด</span>
          <span class="font-black text-gray-800">฿{{ hoveredPoint.data.max_price }}</span>
        </div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-yellow-500 font-bold flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-[#facc15]"></span> ต่ำสุด</span>
          <span class="font-black text-gray-800">฿{{ hoveredPoint.data.min_price }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  priceHistory: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedRange: {
    type: String,
    default: '1m'
  }
});

const containerRef = ref(null);
const width = ref(0);
const height = ref(0);
// Adjusted padding: right padding increased for Y labels, bottom padding increased for rotated dates and legend
const padding = { top: 20, right: 35, bottom: 60, left: 10 };

let resizeObserver;
onMounted(() => {
  resizeObserver = new ResizeObserver(entries => {
    if (entries.length > 0) {
      width.value = entries[0].contentRect.width;
      height.value = entries[0].contentRect.height;
    }
  });
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
    width.value = containerRef.value.clientWidth;
    height.value = containerRef.value.clientHeight;
  }
});
onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect();
});

const rangeMap = { '10d': 10, '1m': 30, '1y': 365 };

const processedData = computed(() => {
  if (!props.priceHistory || props.priceHistory.length === 0) return [];
  
  const now = new Date();
  const daysAgo = rangeMap[props.selectedRange] || 30;
  const cutoffDate = new Date(now.getTime()); 
  cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

  const filteredData = props.priceHistory.filter(record => new Date(record.record_date) >= cutoffDate);

  const groupedData = filteredData.reduce((acc, record) => {
    const dateObj = new Date(record.record_date);
    // Format as DD/MM/YYYY
    const d = String(dateObj.getDate()).padStart(2, '0');
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const y = dateObj.getFullYear();
    const dateStr = `${d}/${m}/${y}`;
    
    if (!acc[dateStr]) {
      acc[dateStr] = {
        date: dateStr,
        fullDate: record.record_date,
        max_price: record.max_price,
        min_price: record.min_price,
      };
    } else {
      if (record.max_price > acc[dateStr].max_price) acc[dateStr].max_price = record.max_price;
      if (record.min_price < acc[dateStr].min_price) acc[dateStr].min_price = record.min_price;
    }
    return acc;
  }, {});

  return Object.values(groupedData).sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));
});

// Chart Math
const bounds = computed(() => {
  const data = processedData.value;
  if (data.length === 0) return { min: 0, max: 100, range: 100 };
  const allMins = data.map(d => d.min_price);
  const allMaxs = data.map(d => d.max_price);
  const minVal = Math.max(0, Math.min(...allMins) - (Math.min(...allMins) * 0.05)); // 5% padding bottom
  const maxVal = Math.max(...allMaxs) + (Math.max(...allMaxs) * 0.05); // 5% padding top
  return { min: minVal, max: maxVal, range: maxVal - minVal || 1 };
});

const pointCoords = computed(() => {
  const data = processedData.value;
  if (data.length === 0 || width.value === 0) return [];
  
  const w = width.value - padding.left - padding.right;
  const h = height.value - padding.top - padding.bottom;
  const { min, range } = bounds.value;

  return data.map((d, i) => {
    const x = padding.left + (i / Math.max(1, data.length - 1)) * w;
    const yMin = padding.top + h - ((d.min_price - min) / range) * h;
    const yMax = padding.top + h - ((d.max_price - min) / range) * h;
    return { x, yMin, yMax, data: d };
  });
});

// Path Generators
const createSmoothPath = (points, key) => {
  if (points.length === 0) return '';
  let d = `M ${points[0].x} ${points[0][key]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i], next = points[i + 1];
    const cpX = (curr.x + next.x) / 2;
    d += ` C ${cpX} ${curr[key]}, ${cpX} ${next[key]}, ${next.x} ${next[key]}`;
  }
  return d;
};

const maxPath = computed(() => createSmoothPath(pointCoords.value, 'yMax'));
const minPath = computed(() => createSmoothPath(pointCoords.value, 'yMin'));

const spreadPath = computed(() => {
  const pts = pointCoords.value;
  if (pts.length === 0) return '';
  let d = createSmoothPath(pts, 'yMax');
  d += ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].yMin}`;
  for (let i = pts.length - 1; i > 0; i--) {
    const curr = pts[i], prev = pts[i - 1];
    const cpX = (curr.x + prev.x) / 2;
    d += ` C ${cpX} ${curr.yMin}, ${cpX} ${prev.yMin}, ${prev.x} ${prev.yMin}`;
  }
  d += ' Z';
  return d;
});

const bottomPath = computed(() => {
  const pts = pointCoords.value;
  if (pts.length === 0) return '';
  const h = height.value - padding.bottom;
  let d = createSmoothPath(pts, 'yMin');
  d += ` L ${pts[pts.length - 1].x} ${h} L ${pts[0].x} ${h} Z`;
  return d;
});

// Grids & Labels
const gridLines = computed(() => {
  if (height.value === 0) return [];
  const h = height.value - padding.top - padding.bottom;
  const steps = 4;
  const lines = [];
  for (let i = 0; i <= steps; i++) {
    const y = padding.top + (h / steps) * i;
    const val = bounds.value.max - (bounds.value.range / steps) * i;
    lines.push({ y, val });
  }
  return lines;
});

const xLabels = computed(() => {
  const pts = pointCoords.value;
  const labels = [];
  pts.forEach((pt, i) => {
    // Hide some labels to prevent crowding if there are many points
    if (pts.length > 10 && i % Math.ceil(pts.length / 7) !== 0 && i !== pts.length - 1 && i !== 0) return;
    labels.push({ x: pt.x, text: pt.data.date });
  });
  return labels;
});

// Interactivity
const hoveredPoint = ref(null);

const handlePointer = (clientX) => {
  if (pointCoords.value.length === 0) return;
  const rect = containerRef.value.getBoundingClientRect();
  const mouseX = clientX - rect.left;
  
  let closest = pointCoords.value[0];
  let minDiff = Math.abs(mouseX - closest.x);
  for (let i = 1; i < pointCoords.value.length; i++) {
    const diff = Math.abs(mouseX - pointCoords.value[i].x);
    if (diff < minDiff) { 
      minDiff = diff; 
      closest = pointCoords.value[i]; 
    }
  }
  hoveredPoint.value = closest;
};

const onInteraction = (e) => handlePointer(e.clientX);
const onTouchStart = (e) => handlePointer(e.touches[0].clientX);
const onTouchMove = (e) => handlePointer(e.touches[0].clientX);
const onLeave = () => { hoveredPoint.value = null; };

</script>

<style scoped>
.glass-tooltip {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
