<template>
  <div class="bg-white p-8 rounded-xl shadow-lg max-w-7xl mx-auto mt-10">
    <!-- Skeleton Loader -->
    <div v-if="loading" class="space-y-6">
      <div class="skeleton-text skeleton-title"></div>
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Skeleton Image Section -->
        <div class="lg:w-1/3 w-full mb-6 lg:mb-0">
          <div class="skeleton-image"></div>
        </div>

        <!-- Skeleton Product Info Section -->
        <div class="lg:w-2/3 w-full space-y-6">
          <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div class="skeleton-text skeleton-title"></div>
              <div class="skeleton-text skeleton-category"></div>
            </div>
            <div class="flex flex-col items-end">
              <div class="skeleton-text skeleton-price"></div>
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
          </div>

          <div class="flex justify-end space-x-4 mb-4">
            <button class="skeleton-button"></button>
            <button class="skeleton-button"></button>
            <button class="skeleton-button"></button>
          </div>

          <!-- Skeleton Chart -->
          <div class="h-80 bg-gray-50 p-4 rounded-xl">
            <div class="skeleton-chart"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-else-if="error" class="text-red-500 text-center p-10 bg-red-50 rounded-xl">
      <p class="text-xl mb-4">🚫 เกิดข้อผิดพลาด</p>
      <p>{{ error }}</p>
    </div>

    <!-- Actual Content -->
    <div v-else-if="product" class="flex flex-col lg:flex-row gap-8">
      <!-- Image Section -->
      <div class="lg:w-1/3 w-full mb-6 lg:mb-0">
        <div class="bg-gray-50 p-4 rounded-xl h-full flex items-center justify-center">
          <img 
            :src="product.image || placeholderImage" 
            :alt="product.name || 'รูปสินค้า'" 
            class="max-w-full max-h-[300px] object-contain rounded-lg transition-transform hover:scale-105"
            @error="handleImageError"
          >
        </div>
      </div>

      <!-- Product Info Section -->
      <div class="lg:w-2/3 w-full space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 class="text-3xl font-bold mb-2">{{ product.name || 'ชื่อสินค้า' }}</h1>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {{ product.category || 'ไม่ระบุหมวดหมู่' }}
              </span>
              <span class="text-sm text-gray-500">
                อัพเดทล่าสุด: {{ formatLastUpdateDate }}
              </span>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <div class="text-3xl font-bold text-green-600">฿{{ formatNumber(product.max_price || 0) }}</div>
            <div class="text-gray-600">ต่อ{{ product.unit || 'หน่วย' }}</div>
          </div>
        </div>

        <!-- Price Summary Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-gray-50 p-4 rounded-xl">
            <div class="text-gray-600 text-sm mb-1">ราคาปัจจุบัน</div>
            <div class="text-xl font-bold">฿{{ formatNumber(product.max_price || 0) }}</div>
            <div class="text-xs text-gray-500">{{ formatLastUpdateDate }}</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-xl">
            <div class="text-gray-600 text-sm mb-1">ราคาสูงสุด</div>
            <div class="text-xl font-bold text-green-600">฿{{ formatNumber(product.max_price || 0) }}</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-xl">
            <div class="text-gray-600 text-sm mb-1">ราคาต่ำสุด</div>
            <div class="text-xl font-bold text-red-600">฿{{ formatNumber(product.min_price || 0) }}</div>
          </div>
          <div class="bg-gray-50 p-4 rounded-xl">
            <div class="text-gray-600 text-sm mb-1">ราคาเฉลี่ย</div>
            <div class="text-xl font-bold text-blue-600">฿{{ formatNumber(averagePrice) }}</div>
          </div>
        </div>

        <!-- Time Range Selector -->
        <div class="flex justify-end space-x-4 mb-4">
          <button 
            v-for="(label, range) in timeRanges" 
            :key="range" 
            :class="[ 
              'px-4 py-2 rounded-lg font-medium', 
              selectedRange === range ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-600'
            ]"
            @click="selectedRange = range"
          >
            {{ label }}
          </button>
        </div>

        <!-- Price History Chart -->
        <ProductPriceChart 
          :price-history="product.price_history"
          :selected-range="selectedRange"
        />
      </div>
    </div>

    <!-- No Data State -->
    <div v-else class="text-center text-gray-500 p-10 bg-gray-50 rounded-xl">
      <p class="text-xl mb-2">ไม่มีข้อมูลสินค้า</p>
      <p>กรุณาลองใหม่อีกครั้งหรือตรวจสอบรหัสสินค้า</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchProductById } from '@/services/apiService';
import ProductPriceChart from '@/components/ProductChart.vue';

const route = useRoute();
const placeholderImage = 'https://cdn-icons-png.flaticon.com/512/10132/10132307.png';

// Default product state with fallback values
const product = ref({
  name: '',
  category: '',
  unit: 'หน่วย',
  max_price: 0,
  min_price: 0,
  price_history: [],
  image: placeholderImage
});

const loading = ref(true);
const error = ref(null);

// ฟังก์ชันจัดการเมื่อภาพโหลดไม่สำเร็จ
const handleImageError = (event) => {
  event.target.src = placeholderImage;
  event.target.alt = 'รูปภาพสินค้าไม่พร้อมใช้งาน';
};

// ดึงข้อมูลสินค้าโดยใช้ ID
onMounted(async () => {
  try {
    const productId = route.params.id;
    
    // เพิ่มการตรวจสอบ productId
    if (!productId) {
      throw new Error('ไม่พบรหัสสินค้า');
    }
    
    const fetchedProduct = await fetchProductById(productId);
    
    // เพิ่มการตรวจสอบข้อมูลสินค้า
    if (!fetchedProduct) {
      throw new Error('ไม่พบข้อมูลสินค้า');
    }
    
    product.value = fetchedProduct;
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล:', err);
    error.value = err.message || 'ไม่สามารถโหลดข้อมูลสินค้าได้';
  } finally {
    loading.value = false;
  }
});

// คำนวณราคาเฉลี่ย และข้อมูลอื่น ๆ
const averagePrice = computed(() => {
  if (!product.value?.price_history?.length) return 0;
  
  const total = product.value.price_history.reduce((sum, record) => {
    return sum + ((record.max_price || 0) + (record.min_price || 0)) / 2;
  }, 0);
  
  return Math.round(total / product.value.price_history.length);
});

const formatLastUpdateDate = computed(() => {
  if (!product.value?.price_history?.length) return '';
  
  const latest = product.value.price_history[product.value.price_history.length - 1];
  return latest?.date 
    ? new Date(latest.date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';
});

const formatNumber = (num) => {
  return new Intl.NumberFormat('th-TH').format(num || 0);
};

// ข้อมูลสำหรับกราฟ
const selectedRange = ref('1m'); // ค่าเริ่มต้น: 1 เดือน
const timeRanges = {
  '1w': '1 สัปดาห์',
  '1m': '1 เดือน',
  '1y': '1 ปี',
};
</script>

<style scoped>
/* สไตล์เดิมทั้งหมดคงเดิม */
.skeleton-text {
  background-color: #e0e0e0;
  height: 20px;
  width: 80%;
  margin-bottom: 8px;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}
/* ... (สไตล์อื่นๆ คงเดิม) */
</style>

<style scoped>
.skeleton-text {
  background-color: #e0e0e0;
  height: 20px;
  width: 80%;
  margin-bottom: 8px;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}
.skeleton-title {
  height: 40px;
  width: 50%;
}
.skeleton-category {
  height: 16px;
  width: 40%;
}
.skeleton-image {
  background-color: #e0e0e0;
  height: 200px;
  width: 100%;
  border-radius: 8px;
  animation: pulse 1.5s infinite;
}
.skeleton-card {
  background-color: #e0e0e0;
  height: 100px;
  border-radius: 8px;
  animation: pulse 1.5s infinite;
}
.skeleton-button {
  background-color: #e0e0e0;
  height: 40px;
  width: 100px;
  border-radius: 8px;
  animation: pulse 1.5s infinite;
}
.skeleton-chart {
  background-color: #e0e0e0;
  height: 100%;
  border-radius: 8px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>