import { getSupabase } from "./supabase"

export async function signUp(email: string, password: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  // If successful and session exists, store in cookies
  if (data.session) {
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      }),
    })
  }

  return { data, error }
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // If successful, store session in cookies
  if (data.session) {
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      }),
    })
  }

  return { data, error }
}

export async function signOut() {
  const supabase = getSupabase()
  const { error } = await supabase.auth.signOut()

  // Clear session cookies
  await fetch("/api/auth/session", {
    method: "DELETE",
  })

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
