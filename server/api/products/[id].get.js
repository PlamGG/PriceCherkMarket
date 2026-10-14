import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required',
    })
  }

  const client = await serverSupabaseClient(event)

  try {
    const { data, error } = await client
      .from('products')
      .select(`
        *,
        price_records (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found',
      })
    }

    return data
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า',
    })
  }
})
