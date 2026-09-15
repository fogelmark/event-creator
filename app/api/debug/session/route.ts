import { getSupabaseServer } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("sb-access-token")?.value
    const refreshToken = cookieStore.get("sb-refresh-token")?.value

    console.log("Cookies:", {
      hasAuthToken: !!authToken,
      hasRefreshToken: !!refreshToken,
      authTokenPreview: authToken?.substring(0, 20) + "...",
    })

    const supabase = await getSupabaseServer()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    return NextResponse.json({
      hasCookies: {
        authToken: !!authToken,
        refreshToken: !!refreshToken,
      },
      session: {
        exists: !!session,
        userId: session?.user?.id,
        expiresAt: session?.expires_at,
      },
      user: {
        exists: !!user,
        id: user?.id,
        email: user?.email,
      },
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
