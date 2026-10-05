export const useProducts = () => {
  const supabase = useSupabaseClient()

  const getMacroCategory = (rawCat = '', name = '') => {
    const rc = (rawCat || '').trim()
    const n = (name || '').replace(/^[-–\s]+/, '')

    // 0. ถ้าเป็น 5 หมวดหลักอยู่แล้ว ให้ใช้ได้เลย
    const standardCategories = ['ผักสด', 'ผลไม้', 'เนื้อสัตว์และอาหารทะเล', 'ดอกไม้', 'ของแห้งและอื่นๆ']
    if (standardCategories.includes(rc)) {
      return rc
    }

    // ข้อยกเว้นเฉพาะทาง
    if (n.startsWith('ผักชีฝรั่ง')) return 'ผักสด'
    if (n.startsWith('มะม่วงน้ำดอกไม้')) return 'ผลไม้'
    if ('ข้าวหอมมะลิ'.includes(n) || n.startsWith('ข้าว')) {
      if (!n.startsWith('ข้าวโพด')) return 'ของแห้งและอื่นๆ'
    }

    // 1. เช็คจากชื่อหมวดหมู่เดิม/โซนตลาดไท
    if (rc.includes('ดอกไม้')) return 'ดอกไม้'
    if (rc.includes('ผลไม้') || rc.includes('ส้ม')) return 'ผลไม้'
    if (rc.includes('โปรตีน')) return 'เนื้อสัตว์และอาหารทะเล'
    if (rc.includes('ผัก') || rc.includes('สมุนไพร') || rc.includes('พืชไร่')) return 'ผักสด'

    const meatWords = [
      'ปลา', 'กุ้ง', 'หมึก', 'หอย', 'ปู', 'หมู', 'ไก่', 'เป็ด', 'เนื้อ', 'ไข่', 'กบ', 'วัว',
      'สันนอก', 'สันใน', 'สามชั้น', 'ซี่โครง', 'สะโพก', 'น่อง', 'เครื่องใน', 'ตับ', 'ม้าม',
      'กั้ง', 'ลูกชิ้น', 'แหนม', 'เบคอน', 'ไส้กรอก', 'เศษเนื้อ', 'แซลมอน', 'ดุก', 'เอ็น',
      'เซ่งจี๊', 'เพรียง', 'ขอบกระด้ง', 'ผ้าขี้ริ้ว', 'สวาหมู', 'กระเพาะหมู', 'ไส้อ่อน',
      'ไส้ใหญ่', 'ปอด', 'หัวใจ', 'ขั้วตับ', 'คอหมู', 'คางหมู', 'หมูบด', 'หมูสับ', 'ไก่บด'
    ]

    const fruitWords = [
      'แอปเปิล', 'แอปเปิ้ล', 'ส้ม', 'องุ่น', 'สาลี่', 'เงาะ', 'มังคุด', 'ทุเรียน', 'เมล่อน',
      'แคนตาลูป', 'กล้วย', 'สับปะรด', 'ละมุด', 'แตงไทย', 'พลับ', 'ทับทิม', 'มะขาม', 'ฝรั่ง',
      'มะม่วง', 'สตรอว์เบอร์รี', 'สตรอเบอรี่', 'สตรอเบอร์รี่', 'ลิ้นจี่', 'ลำไย', 'มะละกอ',
      'กีวี', 'กีวี่', 'ลองกอง', 'มะพร้าว', 'อินทผลัม', 'ชมพู่', 'ส้มโอ', 'พุทรา', 'เสาวรส',
      'อโวคาโด', 'อะโวคาโด', 'แก้วมังกร', 'แตงโม', 'เชอร์รี่', 'สละ', 'ระกำ', 'กระท้อน',
      'น้อยหน่า', 'ลางสาด', 'มะไฟ', 'มะยงชิด', 'ลูกไหน', 'ราสเบอร์รี่', 'ละไม', 'บลูเบอร์รี่',
      'พีช', 'พลัม', 'ลูกแพร์', 'ลูกพลับ', 'มะดัน', 'มะปราง', 'มะกอกป่า', 'หยางเหมย'
    ]

    const vegWords = [
      'ผัก', 'กวางตุ้ง', 'กะหล่ำ', 'คะน้า', 'ผักชี', 'ผักบุ้ง', 'ผักกาด', 'ตำลึง', 'ชะอม',
      'กระเพรา', 'กะเพรา', 'โหระพา', 'แมงลัก', 'สะระแหน่', 'ขึ้นฉ่าย', 'คื่นฉ่าย', 'คึ่นช่าย',
      'ตั้งโอ๋', 'ต้นหอม', 'หอมแดง', 'หอมหัวใหญ่', 'หอมแขก', 'หอมพม่า', 'กระเทียม', 'พริก',
      'มะเขือ', 'แตงกวา', 'ฟักทอง', 'ฟัก', 'แฟง', 'บวบ', 'มะระ', 'ถั่วฝักยาว', 'ถั่วแขก',
      'ถั่วลันเตา', 'ถั่วงอก', 'โต้วเหมี่ยว', 'ทานตะวัน', 'หน่อไม้', 'ข้าวโพด', 'แครอท',
      'หัวไชเท้า', 'ไชเท้า', 'กระเจี๊ยบ', 'กระจับ', 'บร็อคโคลี่', 'บล็อคโคลี่', 'เห็ด',
      'ขิง', 'ข่า', 'ตะไคร้', 'ใบมะกรูด', 'กระชาย', 'ขมิ้น', 'มะนาว', 'มะกรูด', 'สะตอ',
      'ยอดฟักแม้ว', 'มันแกว', 'มันเทศ', 'เผือก', 'รากบัว', 'ใบบัวบก', 'ใบชะพลู', 'ผักหวาน',
      'ผักแพว', 'ผักติ้ว', 'ผักหนาม', 'มะรุม', 'ผักแขยง', 'ชะพลู', 'ขจร', 'ดอกแค', 'ผักสลัด',
      'กรีนโอ๊ค', 'เรดโอ๊ค', 'คอส', 'ผักเสี้ยน', 'หน่อไม้ฝรั่ง', 'พริกหวาน', 'พริกไทยอ่อน',
      'ยอดมะพร้าว', 'ซูกินี', 'กุ่ยช่าย', 'กุยช่าย', 'บีทรูท', 'บัตเตอร์เฮด', 'มะระขี้นก',
      'ฟักเขียว', 'สายบัว', 'โสน', 'ใบขี้เหล็ก', 'ขี้เหล็ก', 'ยอดฟักทอง', 'ต้นทานตะวัน',
      'ใบยี่หร่า', 'น้ำเต้า', 'ใบเตย', 'แห้ว', 'มัน'
    ]

    const flowerWords = [
      'ดอก', 'กุหลาบ', 'กล้วยไม้', 'เบญจมาศ', 'คัตเตอร์', 'เยอบีร่า', 'เยอเบียร่า', 'ลิลลี่',
      'ดาวเรือง', 'บัว', 'มะลิ', 'พวงมาลัย', 'ใบตอง', 'หมาก', 'พลู', 'แวนด้า', 'มัม',
      'บานไม่รู้โรย', 'ซ่อนกลิ่น', 'ทานตะวันตัดดอก', 'หน้าวัว', 'สร้อยทอง', 'ใบพลู'
    ]

    const dryWords = [
      'ข้าว', 'น้ำตาล', 'เกลือ', 'น้ำปลา', 'ซีอิ๊ว', 'น้ำมัน', 'กะปิ', 'ซอส', 'เส้น', 'วุ้นเส้น',
      'ขนมจีน', 'แป้ง', 'ถั่วเขียว', 'ถั่วแดง', 'ถั่วเหลือง', 'ถั่วดำ', 'งาขาว', 'งาดำ',
      'พริกไทยดำ', 'พริกไทยป่น', 'เห็ดหอมแห้ง', 'กุ้งแห้ง', 'ปลาหมึกแห้ง', 'บะหมี่', 'ถั่วลิสง'
    ]

    // 1. เช็คคำขึ้นต้น (Head Noun) มีความสำคัญสูงสุด
    if (meatWords.some(p => n.startsWith(p))) return 'เนื้อสัตว์และอาหารทะเล'
    if (fruitWords.some(p => n.startsWith(p))) return 'ผลไม้'
    if (vegWords.some(p => n.startsWith(p))) return 'ผักสด'
    if (flowerWords.some(p => n.startsWith(p))) return 'ดอกไม้'
    if (dryWords.some(p => n.startsWith(p))) return 'ของแห้งและอื่นๆ'

    // 2. เช็คคำที่ปรากฏในชื่อ
    if (flowerWords.some(k => n.includes(k))) return 'ดอกไม้'
    if (meatWords.some(k => n.includes(k))) return 'เนื้อสัตว์และอาหารทะเล'
    if (fruitWords.some(k => n.includes(k))) return 'ผลไม้'
    if (vegWords.some(k => n.includes(k))) return 'ผักสด'
    if (dryWords.some(k => n.includes(k))) return 'ของแห้งและอื่นๆ'

    // Fallback เช็คคำในหมวดดิบ
    if (['เนื้อ', 'ปลา', 'ทะเล'].some(k => rc.includes(k))) return 'เนื้อสัตว์และอาหารทะเล'
    return 'ของแห้งและอื่นๆ'
  }

  const formatProductData = (p) => {
    const records = p.price_records || []
    const todayRecord = records.length > 0 ? records[0] : { min_price: 0, max_price: 0 }
    const yesterdayRecord = records.length > 1 ? records[1] : todayRecord

    const todayPrice = todayRecord.max_price || todayRecord.min_price || 0
    const yesterdayPrice = yesterdayRecord.max_price || yesterdayRecord.min_price || 0

    const priceDiff = todayPrice - yesterdayPrice
    let trend = 'same'
    if (priceDiff < 0) trend = 'down'
    if (priceDiff > 0) trend = 'up'

    let priceChange = 0
    if (yesterdayPrice > 0) {
      priceChange = Number((((todayPrice - yesterdayPrice) / yesterdayPrice) * 100).toFixed(1))
    }

    const rawImage = p.default_image_url
    const isDeadHost = !rawImage || rawImage.includes('mgt-backend.talaadthai.com')
    const safeImage = isDeadHost ? null : rawImage

    return {
      _id: p.id,
      name: p.name.replace(/^[-–\s]+/, ''),
      category: getMacroCategory(p.category, p.name),
      unit: p.unit,
      image: safeImage,
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
