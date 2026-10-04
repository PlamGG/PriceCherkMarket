<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-market-green border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-500 font-bold">กำลังโหลดข้อมูลสินค้า...</p>
      </div>

      <!-- Main Detail Component -->
      <ProductDetail :product="product" :loading="loading" :error="error" v-if="!loading" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProducts } from '@/composables/useProducts'; 
import ProductDetail from '@/components/ProductDetail.vue';

const route = useRoute();
const product = ref(null);
const error = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const { fetchProductById } = useProducts();
    const productId = route.params.id;

    if (!productId) {
      throw new Error('ไม่พบรหัสสินค้า');
    }

    product.value = await fetchProductById(productId);
  } catch (err) {
    console.error('Error fetching product:', err);
    error.value = 'ไม่สามารถดึงข้อมูลสินค้าได้ อาจถูกลบ หรือเซิร์ฟเวอร์มีปัญหา';
  } finally {
    loading.value = false;
  }
});
</script>
