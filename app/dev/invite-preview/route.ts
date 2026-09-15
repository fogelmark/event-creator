import { render } from "@react-email/components"
import { InviteEmail } from "@/emails/InviteEmail"
import { buildPlainText } from "@/lib/email"

// Dev-only preview of the invite email. Visit /dev/invite-preview to see the
// rendered HTML, or /dev/invite-preview?text=1 for the plain-text fallback that
// clients use when HTML is blocked. Add ?image=0 to preview the no-image layout.
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const withImage = searchParams.get("image") !== "0"
  const asText = searchParams.get("text") === "1"

  const event = {
    name: "NOCTURNE LISTENING SESSION",
    location: "The Vault, Los Angeles",
    tier_label: "VIP + Press only",
    description:
      "An intimate first listen of the record, followed by a short Q&A with the producers. Doors at 7:30, set starts sharp at 8.",
  }
  const dateLine = "Fri Oct 3 · 8:00 PM"
  const urls = {
    eventUrl: "http://localhost:3000/i/nocturne-listening-session",
    goingUrl: "http://localhost:3000/dev/invite-preview#going",
    maybeUrl: "http://localhost:3000/dev/invite-preview#maybe",
    notGoingUrl: "http://localhost:3000/dev/invite-preview#not-going",
  }

  if (asText) {
    return new Response(buildPlainText(event, dateLine, urls), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  const html = await render(
    InviteEmail({
      eventName: event.name,
      dateLine,
      location: event.location,
      tierLabel: event.tier_label,
      description: event.description,
      imageUrl: withImage
        ? "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1120&q=80"
        : null,
      recipientName: "Jordan",
      ...urls,
    }),
  )

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}
