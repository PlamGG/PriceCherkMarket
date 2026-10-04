<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-market-green-light selection:text-market-green">
    <NavBar />
    <main class="flex-grow w-full pb-16 md:pb-0">
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<style>
/* Custom Scrollbar for Wholesale Data Density Theme */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #f9fafb; 
}
::-webkit-scrollbar-thumb {
  background: #d1d5db; 
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #007752; 
}

/* Tabular Numerals for all prices */
.tabular-nums {
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
}

/* Horizontal hide scrollbar */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>