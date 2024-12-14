<template>
  <div class="container mx-auto px-4 py-4  md:py-8">
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-4">
      <h2 class="text-2xl font-bold mb-4 text-center text-emerald-700">
        📈 แนวโน้มราคา
      </h2>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div 
          v-for="category in categories" 
          :key="category.id" 
          class="bg-gray-100 rounded-xl p-3 transition-all duration-200 hover:bg-gray-200"
        >
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-bold text-gray-800 truncate">
              {{ category.name }}
            </span>
            <span 
              class="text-xs px-1.5 py-0.5 rounded-full"
              :class="[ 
                category.priceTrend > 0 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-red-100 text-red-700'
              ]"
            >
              {{ category.priceTrend > 0 ? '🔼' : '🔽' }} 
              {{ Math.abs(category.priceTrend) }}%
            </span>
          </div>

          <div class="h-1.5 w-full bg-gray-300 rounded-full overflow-hidden mb-2">
            <div 
              :style="{ 
                width: `${Math.min(Math.abs(category.priceTrend), 100)}%`, 
                backgroundColor: category.priceTrend > 0 ? '#10b981' : '#ef4444' 
              }" 
              class="h-full rounded-full transition-all duration-300"
            ></div>
          </div>

          <div class="flex justify-between text-xs">
            <div>
              <span class="font-semibold text-gray-700">ราคา</span>
              <p class="font-bold text-emerald-600">
                {{ category.avgPrice }} ฿
              </p>
            </div>
            <div>
              <span class="font-semibold text-gray-700">สินค้า</span>
              <p class="font-bold text-blue-600 text-right">
                {{ category.totalProducts }} 🛒
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: {
    type: Array,
    required: true,
    validator: (value) => value.every(category => 
      category.id && 
      category.name && 
      category.priceTrend !== undefined && 
      category.avgPrice && 
      category.totalProducts !== undefined
    )
  }
})
</script>