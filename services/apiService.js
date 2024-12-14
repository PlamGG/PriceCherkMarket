import axios from 'axios';

const BASE_URL = 'https://api-market-ncps.onrender.com'; // URL ของ API

// สร้าง axios instance เพื่อใช้ URL แบบเดียวกันและกำหนดค่าพื้นฐาน
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000, // ตั้งเวลาการหมดอายุ (optional)
});

// ฟังก์ชันสำหรับดึงข้อมูลสินค้า
export const fetchProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error.response?.data || error.message);
    throw new Error('Failed to fetch products');
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลสินค้าเฉพาะตาม ID
export const fetchProductById = async (productId) => {
  if (!productId) {
    console.error('Invalid productId:', productId);
    return null; // คืนค่า null เมื่อ productId ไม่ถูกต้อง
  }

  try {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error.response?.data || error.message);
    throw new Error(`Failed to fetch product with ID ${productId}`);
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลหมวดหมู่สินค้า
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data; // คาดว่า API จะคืนค่ารูปแบบ { id, name, description, image }
  } catch (error) {
    console.error('Error fetching categories:', error.response?.data || error.message);
    throw new Error('Failed to fetch categories');
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลสินค้าตามหมวดหมู่ (ชื่อฟังก์ชันที่ใช้ใน [categoryId].vue)
export const getProductsByCategory = async (categoryId) => {
  if (!categoryId) {
    throw new Error('categoryId is required'); // โยนข้อผิดพลาดหากไม่มี categoryId
  }

  try {
    const response = await api.get(`/categories/${categoryId}/products`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error.response?.data || error.message);
    throw new Error(`Failed to fetch products for category ${categoryId}`);
  }
};
