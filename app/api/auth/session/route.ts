import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { access_token, refresh_token } = await request.json()

    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { error: "Missing tokens" },
        { status: 400 },
      )
    }

    const cookieStore = await cookies()

    // Set cookies with proper options
    cookieStore.set("sb-access-token", access_token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    cookieStore.set("sb-refresh-token", refresh_token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Session cookie error:", error)
    return NextResponse.json(
      { error: "Failed to set session" },
      { status: 500 },
    )
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()

    // Delete auth cookies
    cookieStore.delete("sb-access-token")
    cookieStore.delete("sb-refresh-token")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Session delete error:", error)
    return NextResponse.json(
      { error: "Failed to clear session" },
      { status: 500 },
    )
  }
}
