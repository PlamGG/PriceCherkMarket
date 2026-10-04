export const useProducts = () => {
  const supabase = useSupabaseClient()

  const getMacroCategory = (rawCat, name = '') => {
    const n = name

    // 1. Override by product name keywords (ไม่สนใจหมวดจากตลาดไท)
    if (['กบ','ไก่','หมู','เป็ด','ปลา','กุ้ง','หอย','ปู','เนื้อ','แซลมอน','วัว','สันนอก','เครื่องใน','หมึก','ดุก','ไข่'].some(k => n.includes(k))) {
      return 'เนื้อสัตว์และอาหารทะเล'
    }
    if (['แอปเปิล','แอปเปิ้ล','ส้ม','องุ่น','สาลี่','เงาะ','มังคุด','ทุเรียน','เมล่อน','แคนตาลูป','กล้วย','สับปะรด','ละมุด','แตงไทย','พลับ','ทับทิม','มะขาม','ฝรั่ง','มะม่วง','สตรอว์เบอร์รี','ลิ้นจี่','ลำไย','มะละกอ','กีวี่'].some(k => n.includes(k))) {
      return 'ผลไม้'
    }
    if (['กระเจี๊ยบ','กระจับ','พริก','ข้าวโพด','แครอท','หน่อไม้','กะหล่ำ','ถั่วแขก','แตงกวา','ฟักทอง'].some(k => n.includes(k))) {
      return 'ผักสด'
    }
    if (['ข้าว','น้ำตาล','เกลือ'].some(k => n.includes(k))) {
      return 'ของแห้งและอื่นๆ'
    }

    // 2. Fallback: ใช้หมวดหมู่ทางการจากตลาดไท
    if (!rawCat) return 'ของแห้งและอื่นๆ'
    if (rawCat.includes('ผัก') || rawCat.includes('พืชไร่')) return 'ผักสด'
    if (rawCat.includes('ผลไม้')) return 'ผลไม้'
    if (rawCat.includes('เนื้อ') || rawCat.includes('ปลา') || rawCat.includes('ทะเล')) return 'เนื้อสัตว์และอาหารทะเล'
    if (rawCat.includes('ดอกไม้')) return 'ดอกไม้'
    return 'ของแห้งและอื่นๆ'
  }

  const formatProductData = (p) => {
    const records = p.price_records || []
    const todayRecord = records.length > 0 ? records[0] : { min_price: 0, max_price: 0 }
    const yesterdayRecord = records.length > 1 ? records[1] : todayRecord

    const priceDiff = todayRecord.min_price - yesterdayRecord.min_price
    let trend = 'same'
    if (priceDiff < 0) trend = 'down'
    if (priceDiff > 0) trend = 'up'

    let priceChange = 0
    if (yesterdayRecord.min_price > 0) {
      priceChange = ((todayRecord.min_price - yesterdayRecord.min_price) / yesterdayRecord.min_price) * 100
    }

    return {
      _id: p.id,
      name: p.name.replace(/^[-–\s]+/, ''),
      category: getMacroCategory(p.category, p.name),
      unit: p.unit,
      image: p.default_image_url,
      min_price: todayRecord.min_price,
      max_price: todayRecord.max_price,
      price_diff: Number(Math.abs(priceDiff).toFixed(2)),
      priceChange: priceChange,
      trend: trend,
      raw_data: p,
      watched: false
    }
  }

  const fetchProducts = async () => {
    const cachedProducts = useState('cached_products', () => null)
    
    if (cachedProducts.value) {
      return cachedProducts.value
    }

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        price_records (min_price, max_price, record_date)
      `)
      .eq('is_active', true)
      .order('name', { ascending: true })
      .order('record_date', { ascending: false, foreignTable: 'price_records' })
      .limit(2, { foreignTable: 'price_records' })

    if (error) {
      console.error('Error fetching products:', error)
      throw error
    }

    const formatted = data.map(formatProductData)
    cachedProducts.value = formatted
    return formatted
  }

  const fetchCategories = async () => {
    return [
      { id: 'ผักสด', name: 'ผักสด', image: '/placeholder.png' },
      { id: 'ผลไม้', name: 'ผลไม้', image: '/placeholder.png' },
      { id: 'เนื้อสัตว์และอาหารทะเล', name: 'เนื้อสัตว์และอาหารทะเล', image: '/placeholder.png' },
      { id: 'ดอกไม้', name: 'ดอกไม้', image: '/placeholder.png' },
      { id: 'ของแห้งและอื่นๆ', name: 'ของแห้งและอื่นๆ', image: '/placeholder.png' }
    ]
  }

  const getProductsByCategory = async (categoryName) => {
    const all = await fetchProducts()
    return all.filter(p => p.category === categoryName)
  }

  const fetchProductById = async (productId) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        price_records (*)
      `)
      .eq('id', productId)
      .single()

    if (error) {
      console.error('Error fetching product details:', error)
      throw error
    }

    const formatted = formatProductData(data)
    formatted.price_history = data.price_records || []
    return formatted
  }

  return {
    fetchProducts,
    fetchCategories,
    getProductsByCategory,
    fetchProductById
  }
}
