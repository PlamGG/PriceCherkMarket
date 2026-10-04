// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],
  routeRules: {
    '/search': { redirect: '/price' }
  },
  supabase: {
    redirect: false // ปิดระบบบังคับ Login สำหรับหน้าแรก
  },
  app: {
    head: {
      title: 'ตลาดรวม - เช็คราคาสินค้าเกษตร',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'เช็คราคาสินค้าเกษตร ผัก ผลไม้ เนื้อสัตว์ อัปเดตรายวันจากตลาดไท' },
        { property: 'og:title', content: 'ตลาดรวม - เช็คราคาสินค้าเกษตร' },
        { property: 'og:description', content: 'เช็คราคาสินค้าเกษตร ผัก ผลไม้ เนื้อสัตว์ อัปเดตรายวันจากตลาดไท' },
        { property: 'og:type', content: 'website' },
      ]
    }
  }
})