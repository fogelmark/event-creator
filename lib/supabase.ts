import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Note: ANON_KEY is the same as the "publishable" key - safe to use in browser with RLS enabled
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
