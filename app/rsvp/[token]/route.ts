import { displayNameFor, RSVP_STATUSES, RsvpStatus } from "@/lib/invites"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

interface InviteRow {
  id: string
  email: string
  name: string | null
  event_id: string
  events: { slug: string } | null
}

// One-click RSVP from an invite email. Email clients strip <form> elements, so
// each RSVP option is a plain link carrying the invite token and the status.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  const status = new URL(request.url).searchParams.get("status")

  if (!status || !RSVP_STATUSES.includes(status as RsvpStatus)) {
    return NextResponse.redirect(
      new URL("/?invite=bad_status", request.url),
      303,
    )
  }

  try {
    const supabaseAdmin = getSupabaseAdmin()

    const { data: invite, error } = await supabaseAdmin
      .from("invites")
      .select("id, email, name, event_id, events(slug)")
      .eq("token", token)
      .single<InviteRow>()

    if (error || !invite || !invite.events) {
      return NextResponse.redirect(
        new URL("/?invite=not_found", request.url),
        303,
      )
    }

    const { error: rsvpError } = await supabaseAdmin.from("rsvps").upsert(
      {
        event_id: invite.event_id,
        invite_id: invite.id,
        name: displayNameFor({ email: invite.email, name: invite.name }),
        email: invite.email,
        status,
      },
      { onConflict: "event_id,email" },
    )

    if (rsvpError) throw rsvpError

    return NextResponse.redirect(
      new URL(`/i/${invite.events.slug}?rsvp=${status}`, request.url),
      303,
    )
  } catch (err) {
    console.error("One-click RSVP error:", err)
    return NextResponse.redirect(new URL("/?invite=error", request.url), 303)
  }
}
