import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let supabaseInstance: SupabaseClient | null = null

// Client-side Supabase instance (for use in client components)
export function getSupabase() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Missing Supabase environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set.",
    )
  }

  supabaseInstance = createBrowserClient(supabaseUrl, supabasePublishableKey)
  return supabaseInstance
}

// Temporary backwards-compatible wrapper. Remove after its call sites migrate.
export const supabase = {
  get client() {
    return getSupabase()
  },
  from: (table: string) => getSupabase().from(table),
}
