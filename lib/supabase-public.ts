import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let publicInstance: SupabaseClient | null = null

// Server-side anonymous client. It uses the public API key without attaching a
// user's session, so all access is constrained to the anon role and its RLS
// policies, grants, and narrowly scoped database functions.
export function getSupabasePublic() {
  if (publicInstance) return publicInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Missing Supabase environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set.",
    )
  }

  publicInstance = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  return publicInstance
}
