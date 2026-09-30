import { RSVP_STATUSES, RsvpStatus } from "@/lib/invites"
import { getSupabasePublic } from "@/lib/supabase-public"
import { NextResponse } from "next/server"

// One-click RSVP from an invite email. Email clients strip <form> elements, so
// each RSVP option is a plain link carrying the invite token and the status.
// TODO: Replace this mutating GET with a confirmation page plus POST. Email
// security scanners may open links automatically and submit accidental RSVPs.
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
    const { data: eventSlug, error } = await getSupabasePublic().rpc(
      "submit_invite_rsvp",
      {
        p_token: token,
        p_status: status,
      },
    )

    if (error || !eventSlug) {
      return NextResponse.redirect(
        new URL("/?invite=not_found", request.url),
        303,
      )
    }

    return NextResponse.redirect(
      new URL(`/i/${eventSlug}?rsvp=${status}`, request.url),
      303,
    )
  } catch (err) {
    console.error("One-click RSVP error:", err)
    return NextResponse.redirect(new URL("/?invite=error", request.url), 303)
  }
}
