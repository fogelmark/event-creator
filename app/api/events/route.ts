import { getSupabaseServer } from "@/lib/supabase-server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("=== CREATE EVENT API CALLED ===")

    // Verify user authentication with regular client
    const supabase = await getSupabaseServer()

    // Check session first
    const {
      data: { session },
    } = await supabase.auth.getSession()
    console.log("Session check:", { hasSession: !!session, userId: session?.user?.id })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("Auth check:", { user: user?.id, authError })

    if (authError) {
      console.error("Auth error:", authError)
      return NextResponse.json(
        { error: `Authentication failed: ${authError.message}` },
        { status: 401 },
      )
    }

    if (!user) {
      console.error("No user found in session")
      return NextResponse.json(
        { error: "Unauthorized - please log in again" },
        { status: 401 },
      )
    }

    const body = await request.json()
    console.log("Request body:", { ...body, image_url: body.image_url ? "present" : "none" })

    const { slug, name, date, location, description, image_url, tier_label } =
      body

    // Validate required fields
    if (!slug || !name || !date || !location) {
      return NextResponse.json(
        { error: "Missing required fields: slug, name, date, or location" },
        { status: 400 },
      )
    }

    const eventData = {
      user_id: user.id,
      slug,
      name,
      date,
      location,
      description: description || null,
      image_url: image_url || null,
      tier_label: tier_label || "VIP + Press only",
    }

    console.log("Inserting event:", eventData)

    // Use admin client to bypass RLS (we already verified user above)
    const supabaseAdmin = getSupabaseAdmin()

    // Insert event into Supabase with user_id
    const { data, error } = await supabaseAdmin
      .from("events")
      .insert([eventData])
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
      return NextResponse.json(
        {
          error: `Database error: ${error.message}`,
          details: error.details,
          hint: error.hint,
        },
        { status: 500 },
      )
    }

    console.log("Event created successfully:", data.id)
    return NextResponse.json({ slug: data.slug, id: data.id })
  } catch (error) {
    console.error("Unexpected API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: `Server error: ${errorMessage}` },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 })
    }

    // Use admin client for public event lookup (no auth required)
    const supabaseAdmin = getSupabaseAdmin()

    const { data, error } = await supabaseAdmin
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 },
    )
  }
}
