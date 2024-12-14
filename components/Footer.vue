<template>
  <footer class="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 w-full shadow-lg">
    <div class="w-full max-w-7xl mx-auto px-6">
      <!-- Main Grid Section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Logo and Description Section -->
        <div class="pr-4">
          <div class="flex items-center mb-5">
            <div class="h-14 w-14 mr-4 bg-teal-500 rounded-full flex items-center justify-center transform transition-transform hover:rotate-12">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 class="text-3xl font-bold text-teal-300">ตลาดรวม</h3>
          </div>
          <p class="text-sm text-gray-300 leading-relaxed opacity-90">
            เราคือแพลตฟอร์มที่นำเสนอสินค้าคุณภาพสูงและมีราคาที่เหมาะสม พร้อมการอัปเดตราคาสินค้าทุกวัน เพื่อให้คุณได้รับข้อมูลที่แม่นยำที่สุด
          </p>
        </div>

        <!-- Product Categories -->
        <div>
          <h3 class="text-xl font-semibold mb-4 text-teal-300 border-b border-gray-700 pb-2">หมวดหมู่สินค้า</h3>
          <ul class="space-y-2">
            <li v-for="category in categories" :key="category.id">
              <a
                href="#"
                @click.prevent="navigateToCategory(category)"
                class="text-gray-400 hover:text-teal-300 transition duration-300 ease-in-out pl-2 border-l-2 border-transparent hover:border-teal-500"
              >
                {{ category.name }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact Information -->
        <div>
          <h3 class="text-xl font-semibold mb-4 text-teal-300 border-b border-gray-700 pb-2">ติดต่อเรา</h3>
          <ul class="space-y-4">
            <li v-for="(contact, index) in contacts" :key="index" class="flex items-start group">
              <div class="mr-3 text-teal-500 group-hover:text-teal-300 transition">
                <svg v-html="contact.icon" class="h-5 w-5 flex-shrink-0"></svg>
              </div>
              <span class="text-sm text-gray-400 group-hover:text-white transition">{{ contact.text }}</span>
            </li>
          </ul>
        </div>

        <!-- Social and Newsletter -->
        <div>
          <h3 class="text-xl font-semibold mb-4 text-teal-300 border-b border-gray-700 pb-2">ติดตามเรา</h3>
          <div class="flex space-x-4 mb-6">
            <a 
              v-for="social in socialLinks" 
              :key="social.name" 
              :href="social.link" 
              target="_blank" 
              class="w-10 h-10 flex items-center justify-center bg-teal-500 rounded-full hover:bg-teal-400 transition-all duration-300 transform hover:scale-110"
            >
              <img :src="social.icon" :alt="social.name" class="h-5 w-5">
            </a>
          </div>
          <div>
            <h4 class="text-md font-semibold mb-2 text-teal-300">สมัครรับข่าวสาร</h4>
            <div class="flex">
              <input 
                type="email" 
                placeholder="อีเมลของคุณ" 
                class="w-full px-3 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              >
              <button 
                class="bg-teal-500 text-white px-4 py-2 rounded-r-lg hover:bg-teal-400 transition-all duration-300 hover:shadow-lg"
              >
                ส่ง
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center">
        <p class="text-sm text-gray-500 mb-4 sm:mb-0">
          &copy; {{ new Date().getFullYear() }} ชื่อบริษัท. สงวนลิขสิทธิ์.
        </p>
        <div class="flex space-x-4 text-sm text-gray-400">
          <a href="#" class="hover:text-teal-300 transition">นโยบายความเป็นส่วนตัว</a>
          <a href="#" class="hover:text-teal-300 transition">เงื่อนไขการใช้งาน</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const isLoading = ref(false);

const categories = [
  { id: 'ผลไม้', name: 'ผลไม้' },
  { id: 'ผัก', name: 'ผัก' },
  { id: 'เนื้อสัตว์', name: 'เนื้อสัตว์' },
  { id: 'ปลาและอาหารทะเล', name: 'ปลาและอาหารทะเล' },
  { id: 'ข้าวสาร', name: 'ข้าวสาร' },
  { id: 'ของแห้ง', name: 'ของแห้ง' },
  { id: 'ดอกไม้', name: 'ดอกไม้' }
];

const contacts = [
  { text: '123/45 ถนนตัวอย่าง ตำบลตัวอย่าง อำเภอตัวอย่าง จังหวัดตัวอย่าง', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>` },
  { text: 'support@example.com', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>` },
  { text: '081-234-5678', icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>` }
];

const socialLinks = [
  { 
    name: 'Facebook', 
    link: 'https://facebook.com',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg' 
  },
  { 
    name: 'Twitter', 
    link: 'https://twitter.com',
    icon: 'https://freepnglogo.com/images/all_img/1725374683twitter-x-logo.png' 
  },
  { 
    name: 'Instagram', 
    link: 'https://instagram.com',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png' 
  }
];

const router = useRouter(); 

// ฟังก์ชันนำทางไปยังหน้า category
const navigateToCategory = async (category) => {
  try {
    isLoading.value = true;
    await router.push({
      path: `/category/${category.id}`,
      query: {
        name: category.name,
        description: category.description
      }
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการนำทาง:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>