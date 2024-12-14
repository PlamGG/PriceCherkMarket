<template>
  <div class="h-80 bg-gray-50 p-4 rounded-xl">
    <Line 
      v-if="chartData.datasets[0]?.data.length > 0"
      :data="chartData" 
      :options="chartOptions" 
    />
    <div 
      v-else 
      class="h-full flex items-center justify-center text-gray-500"
    >
      ไม่มีข้อมูลในช่วงเวลาที่เลือก
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Props definition
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

// Time range mapping
const rangeMap = {
  '1w': 7,   // 7 วัน
  '1m': 30,  // 30 วัน
  '1y': 365  // 365 วัน
};

// Filtered Price History
const filteredPriceHistory = computed(() => {
  if (!props.priceHistory?.length) return [];
  
  const now = new Date();
  const daysAgo = rangeMap[props.selectedRange];
  const cutoffDate = new Date(now.getTime()); 
  cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

  const filteredData = props.priceHistory.filter(record => new Date(record.date) >= cutoffDate);

  // Group data by date and check for price changes in the same day
  const groupedData = filteredData.reduce((acc, record) => {
    const dateStr = new Date(record.date).toLocaleDateString('th-TH');
    if (!acc[dateStr]) {
      acc[dateStr] = {
        date: dateStr,
        max_price: record.max_price,
        min_price: record.min_price,
      };
    } else {
      // Update max and min prices if changed on the same day
      if (record.max_price > acc[dateStr].max_price) {
        acc[dateStr].max_price = record.max_price;
      }
      if (record.min_price < acc[dateStr].min_price) {
        acc[dateStr].min_price = record.min_price;
      }
    }
    return acc;
  }, {});

  // Convert the grouped data back to an array and sort by date from past to present (oldest first)
  return Object.values(groupedData)
    .sort((a, b) => new Date(a.date) - new Date(b.date));  // Sort dates from past to present
});

// Chart Data
const chartData = computed(() => {
  if (!filteredPriceHistory.value.length) return { labels: [], datasets: [] };

  // Reversing the data so that past dates are on the right and future dates are on the left
  const reversedData = filteredPriceHistory.value.reverse();

  const labels = reversedData.map(record => record.date);

  const maxPrices = reversedData.map(record => record.max_price || 0);
  const minPrices = reversedData.map(record => record.min_price || 0);

  return {
    labels: labels,
    datasets: [
      {
        label: 'ราคาสูงสุด',
        data: maxPrices,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'ราคาต่ำสุด',
        data: minPrices,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        fill: true,
        tension: 0.4,
      }
    ]
  };
});

// Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function(tooltipItem) {
          return `฿${tooltipItem.raw.toFixed(2)}`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        tickColor: 'rgba(0, 0, 0, 0.1)'
      }
    },
    x: {
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        maxRotation: 45,
        minRotation: 45
      }
    }
  }
};
</script>
