import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Server-side Supabase instance (for use in server components and API routes)
export async function getSupabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Missing Supabase environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
    )
  }

  const cookieStore = await cookies()

  // Get all Supabase auth cookies
  const authToken = cookieStore.get("sb-access-token")?.value
  const refreshToken = cookieStore.get("sb-refresh-token")?.value

  // Create client with auth token in global headers
  const supabase = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: authToken
        ? {
            Authorization: `Bearer ${authToken}`,
          }
        : {},
    },
  })

  // Also set the session for RLS to work properly
  if (authToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: authToken,
      refresh_token: refreshToken,
    })

    if (error) {
      console.error("Error setting session:", error)
    }
  }

  return supabase
}
