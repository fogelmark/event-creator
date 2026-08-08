import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
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

async function getEvent(slug: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error) return null
  return data
}

export default async function InvitePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    notFound()
  }

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
              You're invited
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
          <a
            href="/"
            className="font-(family-name:--font-unbounded) text-sm font-extrabold tracking-[0.02em] text-[oklch(50%_0.012_250)] hover:text-[oklch(78%_0.19_135)]"
          >
            SENDIT
          </a>
        </div>
      </div>
    </div>
  )
}
