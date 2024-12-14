import { createRouter, createWebHistory } from 'vue-router';
import ProductDetail from '@/views/ProductDetail.vue';  // อ้างอิงไฟล์ที่ใช้แสดงรายละเอียดสินค้า
import CategoryDetail from '@/views/CategoryDetail.vue'


const routes = [
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,  // คอมโพเนนต์สำหรับแสดงรายละเอียดสินค้า
    props: true,  // ส่ง props สำหรับ product id ไปที่คอมโพเนนต์
  },
  {
    path: '/category/:id',
    name: 'CategoryDetail',
    component: CategoryDetail,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
