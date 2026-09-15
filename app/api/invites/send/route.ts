import { sendEventInvites } from "@/lib/email"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

// Sends pending invites for an event.
//
// This handler deliberately takes only an event_id — recipients are read from
// the invites table, never from the request body. Without that, a public
// endpoint would be an open relay: anyone could post arbitrary addresses and
// send mail from the verified domain.
export async function POST(request: Request) {
  try {
    const { event_id, resend_all } = await request.json()

    if (!event_id) {
      return NextResponse.json(
        { error: "event_id is required" },
        { status: 400 },
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    const { data: event, error: eventError } = await supabaseAdmin
      .from("events")
      .select("slug, name, date, location, tier_label, description, image_url")
      .eq("id", event_id)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    let query = supabaseAdmin
      .from("invites")
      .select("id, email, name, token")
      .eq("event_id", event_id)

    // Default to pending only, so pressing the button twice doesn't spam anyone.
    if (!resend_all) {
      query = query.is("sent_at", null)
    }

    const { data: invites, error: invitesError } = await query

    if (invitesError) throw invitesError

    if (!invites || invites.length === 0) {
      return NextResponse.json({
        sent: 0,
        failed: 0,
        message: "No pending invites",
      })
    }

    const results = await sendEventInvites(event, invites)
    const sentAt = new Date().toISOString()

    await Promise.all(
      results.map((result) =>
        supabaseAdmin
          .from("invites")
          .update(
            result.error
              ? { send_error: result.error }
              : { sent_at: sentAt, send_error: null },
          )
          .eq("id", result.inviteId),
      ),
    )

    const failed = results.filter((result) => result.error)

    return NextResponse.json({
      sent: results.length - failed.length,
      failed: failed.length,
      errors: failed.map((failure) => failure.error),
    })
  } catch (error) {
    console.error("Send invites error:", error)
    const message =
      error instanceof Error ? error.message : "Failed to send invites"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
