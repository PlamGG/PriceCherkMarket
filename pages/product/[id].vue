<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- ถ้ากำลังโหลดข้อมูล -->
      <p v-if="loading">กำลังโหลดข้อมูล...</p>

      <!-- แสดงรายละเอียดของสินค้า -->
      <ProductDetail :product="product" v-if="product" />

      <!-- ถ้าไม่พบข้อมูลสินค้า -->
      <p v-else-if="!loading && !error">ไม่พบข้อมูลสินค้านี้</p>

      <!-- แสดงข้อผิดพลาด -->
      <p v-else-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchProductById } from '@/services/apiService';
import ProductDetail from '@/components/ProductDetail.vue';

const route = useRoute();
const product = ref(null);  // เก็บข้อมูลสินค้า
const error = ref(null);    // เก็บข้อผิดพลาด
const loading = ref(true);  // ตัวแปรสำหรับการโหลดข้อมูล

// เมื่อคอมโพเนนต์ถูกติดตั้งแล้ว
onMounted(async () => {
  try {
    const productId = route.params.id;

    if (!productId) {
      throw new Error('Invalid product ID');  // ตรวจสอบว่า productId มีค่าหรือไม่
    }

    product.value = await fetchProductById(productId); // ดึงข้อมูลสินค้า

    // ถ้าไม่ได้ข้อมูลสินค้า
    if (!product.value) {
      throw new Error('Product not found');
    }

  } catch (err) {
    error.value = err.message || 'ไม่สามารถโหลดข้อมูลสินค้าได้';  // หากเกิดข้อผิดพลาด
    console.error(err);
  } finally {
    loading.value = false;  // หลังจากโหลดเสร็จแล้วไม่ว่าผลจะเป็นอะไร
  }
});
</script>
