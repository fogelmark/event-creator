import { getSupabaseServer } from "@/lib/supabase-server"
import { getSupabasePublic } from "@/lib/supabase-public"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

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

    // The insert policy verifies that user_id matches the authenticated user.
    const { data, error } = await supabase
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

    // id is returned so the create page can redirect to the event's dashboard,
    // where invites are added and sent.
    return NextResponse.json({ slug: data.slug, id: data.id })
  } catch (error) {
    console.error("Unexpected API error:", error)
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error"
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

    const { data, error } = await getSupabasePublic()
      .from("events")
      .select(
        "id, slug, name, date, location, description, image_url, tier_label, created_at",
      )
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
