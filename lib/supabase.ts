import { createClient, SupabaseClient } from "@supabase/supabase-js"

let supabaseInstance: SupabaseClient | null = null

// Client-side Supabase instance (for use in client components)
export function getSupabase() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Missing Supabase environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
    )
  }

  // Note: ANON_KEY is the same as the "publishable" key - safe to use in browser with RLS enabled
  supabaseInstance = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
  return supabaseInstance
}

// Export for convenience (backwards compatibility)
export const supabase = {
  get client() {
    return getSupabase()
  },
  from: (table: string) => getSupabase().from(table),
}
