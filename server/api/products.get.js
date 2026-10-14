import { useServerSupabase } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category

  try {
    const client = useServerSupabase()

    let q = client
      .from('products')
      .select('*, price_records(min_price, max_price, record_date)')
      .eq('is_active', true)
      .order('name', { ascending: true })
      .order('record_date', { ascending: false, foreignTable: 'price_records' })
      .limit(2, { foreignTable: 'price_records' })

    if (category) {
      q = q.eq('category', category)
    }

    const { data, error } = await q

    if (error) throw error
    return data

  } catch (error) {
    console.error('Server error in /api/products:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า',
    })
  }
})