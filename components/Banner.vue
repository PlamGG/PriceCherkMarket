<template>
    <div class="bg-black p-8 rounded-xl text-white shadow-lg">
      <h1 class="text-3xl font-bold mb-6 text-center">
        ทำไม <span class="text-yellow-300">ตลาดกลาง</span> ถึงเป็น <span class="text-yellow-400 highlight">อันดับหนึ่ง</span> ในการเช็คราคาสินค้า
      </h1>
      <div class="flex justify-around">
        <div class="text-center">
          <div class="text-6xl font-extrabold text-yellow-300 counter" data-count="50000">0</div>
          <p class="text-lg text-gray-200 mt-2">ผู้ใช้ที่เช็คราคา</p>
        </div>
        <div class="text-center">
          <div class="text-6xl font-extrabold text-yellow-300 counter" data-count="100000">0</div>
          <p class="text-lg text-gray-200 mt-2">รายการที่อัปเดท</p>
        </div>
        <div class="text-center">
          <div class="text-6xl font-extrabold text-yellow-300 counter" data-count="20000">0</div>
          <p class="text-lg text-gray-200 mt-2">การประหยัดที่ได้รับ</p>
        </div>
      </div>
      <p class="mt-6 text-center text-lg font-semibold text-yellow-300">สถิติที่น่าทึ่งของเรา</p>
    </div>
  </template>
  
  <script>
  export default {
    mounted() {
      const counters = document.querySelectorAll('.counter');
      counters.forEach(counter => {
        const updateCount = () => {
          const target = +counter.getAttribute('data-count');
          const count = +counter.innerText;
          const increment = target / 100;
  
          if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(updateCount, 20);
          } else {
            counter.innerText = target;
          }
        };
        updateCount();
      });
    }
  };
  </script>
  
  <style scoped>
  .counter {
    font-size: 5rem;
    font-weight: 800;
    color: #FBBF24;  /* สีเหลือง */
    animation: fadeIn 2s ease-in-out;
  }
  
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(50px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* ปรับแอนิเมชันสำหรับคำว่า "อันดับหนึ่ง" */
  .highlight {
    font-size: 1.5rem;
    font-weight: bold;
    color: #fbbf24;
    animation: highlightAnimation 1.5s ease infinite;
  }
  
  @keyframes highlightAnimation {
    0% {
      transform: scale(1);
      color: #fbbf24;
    }
    50% {
      transform: scale(1.2);
      color: #f59e0b;
    }
    100% {
      transform: scale(1);
      color: #fbbf24;
    }
  }
  
  /* ปรับสไตล์พื้นหลังเป็นสีดำ */
  .bg-black {
    background-color: #000;
  }
  
  /* ปรับข้อความ "อันดับหนึ่ง" ให้เคลื่อนไหว */
  .text-yellow-400 {
    color: #fbbf24;
    animation: pulse 2s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
  </style>
  