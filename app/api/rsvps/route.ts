import { getSupabasePublic } from "@/lib/supabase-public"
import { getSupabaseServer } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event_id, name, email, status } = body

    if (!event_id || !name || !email || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    // Validate status
    if (!["going", "maybe", "not_going"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const { error } = await getSupabasePublic().rpc("submit_public_rsvp", {
      p_event_id: event_id,
      p_name: name,
      p_email: email,
      p_status: status,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("RSVP error:", error)
    return NextResponse.json(
      { error: "Failed to submit RSVP" },
      { status: 500 },
    )
  }
}

// Get RSVPs for an event
export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServer()
    const { data: authData, error: authError } = await supabase.auth.getClaims()

    if (authError || !authData?.claims.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get("event_id")

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 },
      )
    }

    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ rsvps: data })
  } catch (error) {
    console.error("Fetch RSVPs error:", error)
    return NextResponse.json(
      { error: "Failed to fetch RSVPs" },
      { status: 500 },
    )
  }
}
