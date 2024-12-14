<script setup>
const props = defineProps({
  category: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['navigate'])

const handleNavigate = () => {
  emit('navigate', props.category)
}

const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/400x300?text=No+Image'
}

const formattedTotalProducts = computed(() => {
  const total = props.category.totalProducts ?? 0
  if (total >= 1000) {
    return `${(total / 1000).toFixed(1)}K`
  }
  return total.toLocaleString('th-TH')
})

const formattedAvgPrice = computed(() => {
  const price = props.category.avgPrice ?? 0
  return price.toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
    <div class="relative h-56 overflow-hidden">
      <img 
        :src="category.image" 
        :alt="category.name" 
        loading="lazy"
        @error="handleImageError"
        class="w-full h-full object-cover absolute inset-0 transform transition-transform duration-300 group-hover:scale-110"
      />
      <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h2 class="text-2xl font-bold mb-2">{{ category.name }}</h2>
        <p class="text-sm opacity-80">{{ category.description }}</p>
      </div>
    </div>
    
    <div class="p-6">
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-100 rounded-lg p-4 text-center">
          <span class="block text-lg font-semibold text-green-600">
            {{ formattedTotalProducts }}
          </span>
          <span class="text-xs text-gray-600">
            {{ formattedTotalProducts === '0' ? 'ไม่มีสินค้า' : 'สินค้าทั้งหมด' }}
          </span>
        </div>
        <div class="bg-gray-100 rounded-lg p-4 text-center">
          <span class="block text-lg font-semibold text-blue-600">
            {{ formattedAvgPrice }} ฿
          </span>
          <span class="text-xs text-gray-600">ราคาเฉลี่ย</span>
        </div>
      </div>
      <button 
        @click="handleNavigate" 
        class="w-full mt-6 bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-colors"
      >
        ดูสินค้าทั้งหมด
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template> 