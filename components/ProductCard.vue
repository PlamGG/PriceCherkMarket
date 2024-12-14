<template>
  <NuxtLink :to="`/product/${product._id}`" class="block">
    <div
      class="bg-white border-2 border-transparent rounded-xl shadow-lg hover:border-green-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
      @click="onClick"
    >
      <!-- Product Image (Skeleton Loading) -->
      <div class="relative overflow-hidden rounded-t-xl h-48 md:h-64 w-full">
        <div v-if="loading" class="skeleton-image"></div>
        <img
          v-else
          :src="product.image || placeholderImage"
          :alt="product.name"
          class="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
          @error="handleImageError"
        />
      </div>

      <!-- Product Details (Skeleton Loading) -->
      <div class="p-4 space-y-3">
        <div v-if="loading" class="skeleton-text skeleton-title"></div>
        <div v-if="loading" class="skeleton-text skeleton-category"></div>
        <div v-else>
          <!-- Product Name -->
          <h3 class="font-bold text-base md:text-lg text-gray-800 line-clamp-2">{{ product.name }}</h3>
          <p class="text-gray-500 text-xs md:text-sm mt-1">{{ product.category || 'ไม่ระบุหมวดหมู่' }}</p>
        </div>

        <div v-if="loading" class="skeleton-price"></div>
        <div v-else class="flex justify-between items-center">
          <!-- Price -->
          <div class="text-lg md:text-xl font-bold text-green-600">
            ฿{{ product.max_price ? product.max_price.toFixed(2) : 'ไม่ระบุ' }}/{{ product.unit || 'หน่วย' }}
          </div>

          <!-- Price Change Indicator -->
          <div
            :class="[ 
              'px-2 py-1 rounded-full text-xs md:text-sm font-bold transition-colors', 
              product.priceChange >= 0
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            ]"
          >
            {{ product.priceChange >= 0 ? '↑' : '↓' }} 
            {{ Math.abs(product.priceChange || 0).toFixed(2) }}%
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      placeholderImage: 'https://cdn-icons-png.flaticon.com/512/10132/10132307.png', // Placeholder Image URL
      loading: true, // เพิ่มตัวแปรสำหรับการโหลด
    };
  },
  methods: {
    handleImageError(event) {
      event.target.src = this.placeholderImage;
    },
    onClick() {
      console.log('Product clicked:', this.product._id);
    },
    simulateLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 3000);
    },
  },
  mounted() {
    this.simulateLoading();
  }
};
</script>

<style scoped>
/* Skeleton Styles */
.skeleton-image {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite linear;
  width: 100%;
  height: 100%;
  border-radius: 0.75rem;
}

.skeleton-text {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite linear;
  height: 16px;
  margin-bottom: 8px;
  border-radius: 4px;
}

.skeleton-title {
  width: 70%;
}

.skeleton-category {
  width: 40%;
}

.skeleton-price {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite linear;
  height: 24px;
  margin-top: 16px;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
