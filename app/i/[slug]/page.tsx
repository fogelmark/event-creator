import { getSupabasePublic } from "@/lib/supabase-public"
import { notFound } from "next/navigation"
import Link from "next/link"
import RsvpForm from "@/components/RsvpForm"

interface Event {
  id: string
  slug: string
  name: string
  date: string
  location: string
  description: string | null
  image_url: string | null
  tier_label: string
  created_at: string
}

// Read only the columns granted to the anonymous role.
async function getEvent(slug: string): Promise<Event | null> {
  const { data, error } = await getSupabasePublic()
    .from("events")
    .select(
      "id, slug, name, date, location, description, image_url, tier_label, created_at",
    )
    .eq("slug", slug)
    .single()

  if (error) return null
  return data
}

const RSVP_CONFIRMATIONS: Record<string, string> = {
  going: "You're going. See you there.",
  maybe: "Marked as maybe. You can change it below.",
  not_going: "Marked as can't go. You can change it below.",
}

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ rsvp?: string }>
}) {
  const [{ slug }, { rsvp }] = await Promise.all([params, searchParams])
  const event = await getEvent(slug)

  if (!event) {
    notFound()
  }

  // Set when arriving from a one-click RSVP link in an invite email.
  const confirmation = rsvp ? RSVP_CONFIRMATIONS[rsvp] : undefined

  // Format date for display
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]

    const dayName = days[d.getDay()]
    const month = months[d.getMonth()]
    const day = d.getDate()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, "0")

    return `${dayName} ${month} ${day} · ${displayHours}:${displayMinutes} ${ampm}`
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(14%_0.012_250)] p-4 font-(family-name:--font-manrope)">
      <div className="w-full max-w-md">
        {confirmation && (
          <div className="mb-4 rounded-lg border border-[oklch(78%_0.19_135/0.3)] bg-[oklch(20%_0.012_250)] p-4 text-center">
            <p className="text-[13px] font-bold text-[oklch(78%_0.19_135)]">
              ✓ {confirmation}
            </p>
          </div>
        )}

        <div
          className={`relative flex aspect-9/13 flex-col justify-end overflow-hidden rounded-xl ${
            event.image_url ? "" : "stripes"
          }`}
          style={
            event.image_url
              ? {
                  backgroundImage: `url(${event.image_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
        >
          <div className="absolute inset-0 bg-linear-to-t from-[oklch(14%_0.012_250/0.92)] to-[oklch(14%_0.012_250/0.1)] to-55%"></div>
          <div className="relative z-10 p-7">
            <div className="mb-2.5 font-mono text-[11px] tracking-wider text-[oklch(78%_0.19_135)] uppercase">
              You&apos;re invited
            </div>
            <h1 className="mb-2.5 font-(family-name:--font-unbounded) text-[30px] leading-[1.05] font-extrabold text-[oklch(95%_0.006_250)]">
              {event.name}
            </h1>
            <div className="mb-4.5 text-[13.5px] leading-normal text-[oklch(78%_0.012_250)]">
              {formatDate(event.date)}
              <br />
              {event.location}
              <br />
              {event.tier_label}
            </div>
            {event.description && (
              <p className="mb-4.5 text-[13px] leading-normal text-[oklch(72%_0.012_250)]">
                {event.description}
              </p>
            )}
          </div>
        </div>

        {/* RSVP Form */}
        <div className="mt-6">
          <RsvpForm eventId={event.id} />
        </div>

        {/* Branding */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="font-(family-name:--font-unbounded) text-sm font-extrabold tracking-[0.02em] text-[oklch(50%_0.012_250)] hover:text-[oklch(78%_0.19_135)]"
          >
            SENDIT
          </Link>
        </div>
      </div>
    </div>
  )
}
