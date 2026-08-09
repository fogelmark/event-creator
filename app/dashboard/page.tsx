import { supabase } from "@/lib/supabase"
import Link from "next/link"
import CopyLinkButton from "@/components/CopyLinkButton"

interface Event {
  id: string
  slug: string
  name: string
  date: string
  location: string
  image_url: string | null
  created_at: string
}

async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return []
  return data
}

async function getRsvpCount(eventId: string): Promise<number> {
  const { data, error } = await supabase
    .from("rsvps")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId)

  if (error) return 0
  return data?.length || 0
}

export default async function DashboardPage() {
  const events = await getEvents()

  // Get RSVP counts for all events
  const eventsWithCounts = await Promise.all(
    events.map(async (event) => {
      const { count } = await supabase
        .from("rsvps")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id)

      return { ...event, rsvpCount: count || 0 }
    }),
  )

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
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
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
  }

  return (
    <div className="min-h-screen bg-[oklch(14%_0.012_250)] p-4 font-(family-name:--font-manrope) sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-(family-name:--font-unbounded) text-2xl font-extrabold text-[oklch(95%_0.006_250)] sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-[12px] text-[oklch(78%_0.012_250)] sm:text-[13px]">
              Manage your events and view RSVPs
            </p>
          </div>
          <Link
            href="/create"
            className="w-full rounded-full bg-[oklch(78%_0.19_135)] px-5 py-2.5 text-center text-[12px] font-bold text-[oklch(14%_0.012_250)] hover:bg-[oklch(85%_0.19_135)] sm:w-auto sm:px-6 sm:text-[13px]"
          >
            Create Event
          </Link>
        </div>

        {/* Events List */}
        {eventsWithCounts.length === 0 ? (
          <div className="rounded-lg bg-[oklch(20%_0.012_250)] p-12 text-center">
            <p className="mb-4 text-[oklch(78%_0.012_250)]">
              No events yet. Create your first event to get started!
            </p>
            <Link
              href="/create"
              className="inline-block rounded-full bg-[oklch(78%_0.19_135)] px-6 py-2.5 text-[13px] font-bold text-[oklch(14%_0.012_250)] hover:bg-[oklch(85%_0.19_135)]"
            >
              Create Event
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {eventsWithCounts.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-4 rounded-lg bg-[oklch(20%_0.012_250)] p-4 hover:bg-[oklch(24%_0.012_250)] sm:flex-row sm:items-center"
              >
                {/* Event Image */}
                <div
                  className={`h-32 w-full shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-20 ${
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
                />

                {/* Event Info */}
                <div className="flex-1">
                  <h2 className="font-(family-name:--font-unbounded) text-base font-bold text-[oklch(95%_0.006_250)] sm:text-lg">
                    {event.name}
                  </h2>
                  <p className="text-[12px] text-[oklch(78%_0.012_250)] sm:text-[13px]">
                    {formatDate(event.date)} · {event.location}
                  </p>
                  <p className="mt-1 text-[12px] text-[oklch(78%_0.19_135)] sm:text-[13px]">
                    {event.rsvpCount} {event.rsvpCount === 1 ? "RSVP" : "RSVPs"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex w-full flex-col gap-2 sm:w-auto">
                  <Link
                    href={`/dashboard/event/${event.id}`}
                    className="rounded-lg bg-[oklch(24%_0.012_250)] px-4 py-2 text-center text-[12px] font-bold text-[oklch(95%_0.006_250)] hover:bg-[oklch(30%_0.012_250)] sm:text-[13px]"
                  >
                    View RSVPs
                  </Link>
                  <CopyLinkButton slug={event.slug} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
