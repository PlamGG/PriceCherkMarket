<template>
  <footer class="bg-gray-900 pt-16 pb-24 md:pb-10 border-t-4 border-market-green font-sans mt-auto relative">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
      <!-- Brand & About -->
      <div>
        <NuxtLink to="/" class="text-2xl font-black tracking-tight text-white mb-4 block flex items-center">
          Market <span class="text-market-green ml-2">Price</span>
        </NuxtLink>
        <p class="text-gray-400 text-sm leading-relaxed mb-4">
          แพลตฟอร์มตรวจสอบราคาสินค้าตลาดสด อัปเดตราคาแบบเรียลไทม์เพื่อพ่อค้าแม่ค้าและผู้ประกอบการ ให้คุณไม่พลาดทุกความเคลื่อนไหวของตลาด
        </p>
        <button 
          @click="scrollToTop" 
          class="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4 text-market-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
          <span>กลับขึ้นด้านบน</span>
        </button>
      </div>
      
      <!-- Services & Navigation -->
      <div>
        <h4 class="text-white font-bold mb-4 flex items-center">
          <span class="w-1.5 h-4 bg-market-green rounded-full mr-2"></span>
          เมนูลัด
        </h4>
        <ul class="space-y-2 text-gray-400 text-sm">
          <li><NuxtLink to="/" class="hover:text-market-green transition-colors">หน้าแรก</NuxtLink></li>
          <li><NuxtLink to="/price" class="hover:text-market-green transition-colors">เช็คราคาสินค้าวันนี้</NuxtLink></li>
          <li><NuxtLink to="/watchlist" class="hover:text-market-green transition-colors">รายการที่ติดตาม</NuxtLink></li>
        </ul>
      </div>

      <!-- Categories Shortcuts -->
      <div>
        <h4 class="text-white font-bold mb-4 flex items-center">
          <span class="w-1.5 h-4 bg-market-green rounded-full mr-2"></span>
          หมวดหมู่สินค้า
        </h4>
        <ul class="space-y-2 text-gray-400 text-sm">
          <li><NuxtLink to="/price?query=ผักสด" class="hover:text-market-green transition-colors">ผักสด</NuxtLink></li>
          <li><NuxtLink to="/price?query=ผลไม้" class="hover:text-market-green transition-colors">ผลไม้</NuxtLink></li>
          <li><NuxtLink to="/price?query=เนื้อสัตว์และอาหารทะเล" class="hover:text-market-green transition-colors">เนื้อสัตว์และอาหารทะเล</NuxtLink></li>
          <li><NuxtLink to="/price?query=ดอกไม้" class="hover:text-market-green transition-colors">ดอกไม้</NuxtLink></li>
          <li><NuxtLink to="/price?query=ของแห้งและอื่นๆ" class="hover:text-market-green transition-colors">ของแห้งและอื่นๆ</NuxtLink></li>
        </ul>
      </div>
      
      <!-- Contact -->
      <div>
        <h4 class="text-white font-bold mb-4 flex items-center">
          <span class="w-1.5 h-4 bg-market-green rounded-full mr-2"></span>
          ติดต่อเรา
        </h4>
        <ul class="space-y-3 text-gray-400 text-sm">
          <li class="flex items-center">
            <span class="mr-2 text-market-green font-bold">LINE:</span> 
            <span class="text-gray-300 font-medium">@marketprice</span>
          </li>
          <li class="flex items-center">
            <span class="mr-2 text-blue-400 font-bold">FB:</span> 
            <span class="text-gray-300 font-medium">Market Price TH</span>
          </li>
          <li class="flex items-center">
            <span class="mr-2 text-amber-400 font-bold">Email:</span> 
            <a href="mailto:support@marketprice.com" class="hover:text-market-green transition-colors">support@marketprice.com</a>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Copyright -->
    <div class="max-w-7xl mx-auto px-6 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
      <p>&copy; {{ currentYear }} Market Price. สงวนลิขสิทธิ์.</p>
      <div class="flex space-x-6 mt-4 md:mt-0">
        <NuxtLink to="/price" class="hover:text-white transition-colors">เช็คราคา</NuxtLink>
        <NuxtLink to="/watchlist" class="hover:text-white transition-colors">รายการที่ติดตาม</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();

const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>