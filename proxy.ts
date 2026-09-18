import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const CACHE_HEADERS = ["cache-control", "expires", "pragma"] as const

function responseWithSessionCookies(
  response: NextResponse,
  supabaseResponse: NextResponse,
) {
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie)
  })

  CACHE_HEADERS.forEach((header) => {
    const value = supabaseResponse.headers.get(header)
    if (value) response.headers.set(header, value)
  })

  return response
}

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabasePublishableKey) {
    console.error("Missing Supabase environment variables")
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })

        supabaseResponse = NextResponse.next({ request })

        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options)
        })

        Object.entries(headers).forEach(([name, value]) => {
          supabaseResponse.headers.set(name, value)
        })
      },
    },
  })

  // getClaims verifies the JWT and refreshes it when necessary. Do not replace
  // this with getSession, which only reads unverified cookie contents.
  const { data } = await supabase.auth.getClaims()

  const isAuthenticated = Boolean(data?.claims.sub)
  const pathname = request.nextUrl.pathname
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup")
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/create")

  if (isAuthenticated && isAuthPage) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url))
    return responseWithSessionCookies(response, supabaseResponse)
  }

  if (!isAuthenticated && isProtectedRoute) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set(
      "redirect",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    )
    const response = NextResponse.redirect(redirectUrl)
    return responseWithSessionCookies(response, supabaseResponse)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
