import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing. Ensure you have set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.");
}

// We provide empty strings as fallbacks so the createClient function doesn't throw a type error immediately,
// but the client will fail to connect if the environment variables are genuinely missing.
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
