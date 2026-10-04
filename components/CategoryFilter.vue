<template>
  <div class="w-full">
    <!-- Category Cards Layout - Grid for Desktop, Grid/Scroll for Mobile -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 w-full">
      <NuxtLink 
        v-for="cat in categories" 
        :key="cat.name"
        :to="`/price?query=${cat.name}`"
        class="relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group aspect-[4/5] md:aspect-square"
      >
        <!-- Background Image -->
        <img 
          :src="cat.image" 
          :alt="cat.name"
          class="w-full h-[65%] object-cover group-hover:scale-110 transition-transform duration-700"
          @error="(e) => e.target.src = '/placeholder.png'"
        />
        
        <!-- Overlay / Card Bottom -->
        <div 
          class="absolute bottom-0 left-0 right-0 h-1/2 flex items-end justify-center p-4 transition-colors"
          :class="cat.colorClass"
        >
          <!-- Curve overlay to match the original design's clip path style -->
          <div class="absolute -top-6 left-0 right-0 h-12 clip-path-curve" :class="cat.colorClass"></div>
          <h3 class="relative z-10 text-white font-black text-lg md:text-xl text-center mb-1 drop-shadow-md">
            {{ cat.title }}
          </h3>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// ลบ Filter tabs แบบเก่าออกทั้งหมด เหลือแค่ Card ใหญ่ 5 ใบ
const categories = [
  { 
    name: 'ผักสด', 
    title: 'ตลาดผักสด', 
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
    colorClass: 'bg-[#1b7b3b]' // Green
  },
  { 
    name: 'ผลไม้', 
    title: 'ตลาดผลไม้', 
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80',
    colorClass: 'bg-[#f47f20]' // Orange
  },
  { 
    name: 'เนื้อสัตว์และอาหารทะเล', 
    title: 'ตลาดเนื้อสัตว์', 
    image: 'https://png.pngtree.com/png-clipart/20240923/original/pngtree-fresh-pork-meat-freshness-png-image_16079866.png',
    colorClass: 'bg-[#da291c]' // Red
  },
  { 
    name: 'ดอกไม้',
    title: 'ตลาดดอกไม้', 
    image: 'https://images.pexels.com/photos/30458590/pexels-photo-30458590.jpeg?cs=srgb&dl=pexels-casnafu-30458590.jpg&fm=jpg',
    colorClass: 'bg-[#e11d48]' // Rose
  },
  { 
    name: 'ของแห้งและอื่นๆ', 
    title: 'ตลาดของแห้ง', 
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
    colorClass: 'bg-[#c58b10]' // Yellow/Brown
  }
];
</script>

<style scoped>
.clip-path-curve {
  clip-path: ellipse(150% 100% at 50% 100%);
}
</style>