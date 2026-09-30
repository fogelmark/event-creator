import { getSupabase } from "./supabase"

export async function signUp(email: string, password: string) {
  const supabase = getSupabase()
  return supabase.auth.signUp({
    email,
    password,
  })
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabase()
  return supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signOut() {
  const supabase = getSupabase()
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const supabase = getSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const supabase = getSupabase()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}
