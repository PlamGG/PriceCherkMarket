<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
    <div class="container mx-auto  py-8 ">
      <!-- ส่วนหัว -->
      <header class="mb-8 md:mb-12 flex items-center justify-between">
        <h2 class="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-green-500 to-teal-500 text-transparent bg-clip-text">
          รายการสินค้า
        </h2>
        <div v-if="error" class="text-red-500 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{{ error }}</span>
        </div>
      </header>

      <!-- ส่วนการค้นหาและตัวกรอง -->
      <div class="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
        <select
          class="border-2 border-green-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-400 transition duration-300"
          v-model="selectedCategory"
          @change="handleCategoryChange"
        >
          <option value="all">ทุกหมวดหมู่</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>

        <div class="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            class="w-full border-2 border-green-300 rounded-xl px-4 py-2 pl-10 focus:ring-2 focus:ring-green-400 transition duration-300"
            v-model="searchTerm"
            @input="handleSearch"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- ส่วนการ์ดสินค้า -->
      <transition-group 
        tag="div" 
        name="product-list" 
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <ProductCard
          v-for="product in filteredProducts"
          :key="product._id"
          :product="product"
          :onClick="() => goToDetail(product._id)"
        />
      </transition-group>

      <!-- ข้อความเมื่อไม่มีสินค้า -->
      <div v-if="filteredProducts.length === 0" class="text-center py-16">
        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" class="w-24 h-24 mx-auto mb-4" alt="ไม่พบสินค้า">
        <p class="text-gray-500 text-xl font-semibold">ไม่พบสินค้า</p>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchProducts } from '@/services/apiService';
import ProductCard from '@/components/ProductCard.vue';

export default {
  components: {
    ProductCard,
  },
  setup() {
    const router = useRouter();
    const products = ref([]);
    const searchTerm = ref('');
    const selectedCategory = ref('all');
    const error = ref(null);

    const categories = ['ผลไม้', 'ผัก', 'เนื้อสัตว์', 'ปลาและอาหารทะเล', 'ข้าวสาร', 'ของแห้ง', 'ดอกไม้'];

    onMounted(async () => {
      try {
        const allProducts = await fetchProducts();
        products.value = allProducts.map(product => {
          const latestHistory = product.price_history[product.price_history.length - 1];
          const previousHistory = product.price_history[product.price_history.length - 2];

          let priceChange = 0;
          if (latestHistory && previousHistory) {
            const maxPriceNow = latestHistory.max_price;
            const maxPricePrev = previousHistory.max_price;

            priceChange = ((maxPriceNow - maxPricePrev) / maxPricePrev) * 100;
          }

          return {
            ...product,
            priceChange: priceChange,
          };
        });
      } catch (err) {
        error.value = 'ไม่สามารถโหลดข้อมูลสินค้าได้';
        console.error(err);
      }
    });

    const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const categoryMatch = selectedCategory.value === 'all' || product.category === selectedCategory.value;
    // ใช้ startsWith เพื่อให้กรองสินค้าที่ชื่อเริ่มต้นด้วยคำที่พิมพ์
    const searchMatch = product.name.toLowerCase().startsWith(searchTerm.value.toLowerCase());
    return categoryMatch && searchMatch;
  });
});


    const handleSearch = (event) => {
      searchTerm.value = event.target.value;
    };

    const handleCategoryChange = (event) => {
      selectedCategory.value = event.target.value;
    };

    const goToDetail = (id) => {
      router.push(`/product/${id}`);
    };

    return {
      products,
      searchTerm,
      selectedCategory,
      error,
      filteredProducts,
      handleSearch,
      handleCategoryChange,
      goToDetail,
      categories,
    };
  },
};
</script>
