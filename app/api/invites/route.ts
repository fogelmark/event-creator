import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { generateInviteToken, parseInviteList } from "@/lib/invites"
import { NextResponse } from "next/server"

// Guards against someone pasting an enormous list and running up the Resend bill.
const MAX_INVITES_PER_EVENT = 500

// Add invites to an event. Accepts a raw pasted list of addresses.
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event_id, emails } = body

    if (!event_id || typeof emails !== "string") {
      return NextResponse.json(
        { error: "event_id and emails are required" },
        { status: 400 },
      )
    }

    const { invites, invalid } = parseInviteList(emails)
    if (invites.length === 0) {
      return NextResponse.json(
        { error: "No valid email addresses found", invalid },
        { status: 400 },
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    const { count: existingCount } = await supabaseAdmin
      .from("invites")
      .select("id", { count: "exact", head: true })
      .eq("event_id", event_id)

    if ((existingCount ?? 0) + invites.length > MAX_INVITES_PER_EVENT) {
      return NextResponse.json(
        { error: `An event can have at most ${MAX_INVITES_PER_EVENT} invites` },
        { status: 400 },
      )
    }

    const rows = invites.map((invite) => ({
      event_id,
      email: invite.email,
      name: invite.name,
      token: generateInviteToken(),
    }))

    // ignoreDuplicates keeps existing invites (and their tokens) intact when the
    // same address is pasted again, rather than re-issuing a token.
    const { data, error } = await supabaseAdmin
      .from("invites")
      .upsert(rows, { onConflict: "event_id,email", ignoreDuplicates: true })
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      added: data?.length ?? 0,
      skipped: invites.length - (data?.length ?? 0),
      invalid,
    })
  } catch (error) {
    console.error("Add invites error:", error)
    return NextResponse.json(
      { error: "Failed to add invites" },
      { status: 500 },
    )
  }
}

// List invites for an event.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get("event_id")

    if (!eventId) {
      return NextResponse.json(
        { error: "event_id is required" },
        { status: 400 },
      )
    }

    const { data, error } = await getSupabaseAdmin()
      .from("invites")
      .select("id, email, name, sent_at, send_error, created_at")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true })

    if (error) throw error

    return NextResponse.json({ invites: data })
  } catch (error) {
    console.error("Fetch invites error:", error)
    return NextResponse.json(
      { error: "Failed to fetch invites" },
      { status: 500 },
    )
  }
}
