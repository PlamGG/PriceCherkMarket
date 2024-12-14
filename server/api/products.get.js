export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category

  try {
    // ดึงข้อมูลจาก MongoDB หรือฐานข้อมูลที่ใช้
    const products = await Product.find({ 
      category: category 
    }).sort({ updated_at: -1 })

    return products

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า',
    })
  }
}) 