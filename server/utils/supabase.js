import { createClient } from '@supabase/supabase-js'

let supabaseInstance = null

export const useServerSupabase = () => {
  if (supabaseInstance) return supabaseInstance

  const config = useRuntimeConfig()
  const url = process.env.SUPABASE_URL || config.supabaseUrl
  const key = process.env.SUPABASE_KEY || config.supabaseKey

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in environment')
  }

  supabaseInstance = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  })

  return supabaseInstance
}
