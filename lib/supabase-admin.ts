import { createClient, SupabaseClient } from "@supabase/supabase-js"

let adminInstance: SupabaseClient | null = null

// Service-role client — bypasses RLS, so it must only ever run on the server,
// and only after verifying user authentication.
// SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix, so it is undefined in
// the browser bundle and importing this from a client component will throw.
export function getSupabaseAdmin() {
  if (adminInstance) {
    return adminInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase admin environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.",
    )
  }

  adminInstance = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return adminInstance
}
