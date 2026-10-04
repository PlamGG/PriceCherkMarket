<template>
  <footer class="bg-gray-900 pt-16 pb-8 border-t-4 border-green-500 font-sans mt-auto">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
      <!-- Brand & About -->
      <div>
        <span class="text-2xl font-black tracking-tight text-white mb-4 block flex items-center">
          Market <span class="text-green-500 ml-2">Price</span>
        </span>
        <p class="text-gray-400 text-sm leading-relaxed">
          แพลตฟอร์มตรวจสอบราคาสินค้าตลาดสด อัปเดตราคาแบบเรียลไทม์เพื่อพ่อค้าแม่ค้าและผู้ประกอบการ ให้คุณไม่พลาดทุกความเคลื่อนไหวของตลาด
        </p>
      </div>
      
      <!-- Services -->
      <div>
        <h4 class="text-white font-bold mb-4 flex items-center">
          <span class="w-1.5 h-4 bg-green-500 rounded-full mr-2"></span>
          บริการของเรา
        </h4>
        <ul class="space-y-2 text-gray-400 text-sm">
          <li><NuxtLink to="/price" class="hover:text-green-400 transition-colors">เช็คราคาสินค้าวันนี้</NuxtLink></li>
          <li><NuxtLink to="/search" class="hover:text-green-400 transition-colors">ค้นหาสินค้าทั้งหมด</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:text-green-400 transition-colors">ดูสินค้ายอดฮิต</NuxtLink></li>
        </ul>
      </div>
      
      <!-- Help & Support -->
      <div>
        <h4 class="text-white font-bold mb-4 flex items-center">
          <span class="w-1.5 h-4 bg-green-500 rounded-full mr-2"></span>
          ช่วยเหลือ
        </h4>
        <ul class="space-y-2 text-gray-400 text-sm">
          <li><a href="#" class="hover:text-green-400 transition-colors">วิธีใช้งานแพลตฟอร์ม</a></li>
          <li><a href="#" class="hover:text-green-400 transition-colors">คำถามที่พบบ่อย (FAQ)</a></li>
          <li><a href="#" class="hover:text-green-400 transition-colors">แจ้งราคาสินค้าผิดพลาด</a></li>
        </ul>
      </div>
      
      <!-- Contact -->
      <div>
        <h4 class="text-white font-bold mb-4 flex items-center">
          <span class="w-1.5 h-4 bg-green-500 rounded-full mr-2"></span>
          ติดต่อเรา
        </h4>
        <ul class="space-y-3 text-gray-400 text-sm">
          <li class="flex items-center">
            <span class="mr-2 text-green-500">LINE:</span> 
            <a href="#" class="hover:text-green-400 transition-colors font-bold">@marketprice</a>
          </li>
          <li class="flex items-center">
            <span class="mr-2 text-blue-500">FB:</span> 
            <a href="#" class="hover:text-green-400 transition-colors font-bold">Market Price TH</a>
          </li>
          <li class="flex items-center">
            <span class="mr-2 text-red-500">Email:</span> 
            <a href="mailto:support@marketprice.com" class="hover:text-green-400 transition-colors">support@marketprice.com</a>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Copyright -->
    <div class="max-w-7xl mx-auto px-6 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
      <p>&copy; {{ new Date().getFullYear() }} Market Price. สงวนลิขสิทธิ์.</p>
      <div class="flex space-x-4 mt-4 md:mt-0">
        <a href="#" class="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</a>
        <a href="#" class="hover:text-white transition-colors">เงื่อนไขการให้บริการ</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer logic if any
</script>