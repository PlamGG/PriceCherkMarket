import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category

  const client = await serverSupabaseClient(event)

  try {
    let q = client
      .from('products')
      .select('*, price_records(min_price, max_price, record_date)')
      .eq('is_active', true)
      .order('name', { ascending: true })
      .order('record_date', { ascending: false, foreignTable: 'price_records' })

    if (category) {
      q = q.eq('category', category)
    }

    const { data, error } = await q

    if (error) throw error
    return data

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า',
    })
  }
})