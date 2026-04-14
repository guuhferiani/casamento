import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://swqkshcgwrhybgnjykhc.supabase.co'
const supabaseAnonKey = 'sb_publishable_VbD4t0ObBrFaj4fNqg5jSg_6IjojbI2'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
