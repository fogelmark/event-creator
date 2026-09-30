import { getSupabaseServer } from "@/lib/supabase-server"
import Link from "next/link"
import CopyLinkButton from "@/components/CopyLinkButton"
import UserMenu from "@/components/UserMenu"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DashboardPage() {
  const supabase = await getSupabaseServer()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // RLS limits this query to events owned by the authenticated user.
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching events:", error)
  }

  const userEvents = events || []

  // Get RSVP counts for all events
  const eventsWithCounts = await Promise.all(
    userEvents.map(async (event) => {
      const { count, error: countError } = await supabase
        .from("rsvps")
        .select("id", { count: "exact", head: true })
        .eq("event_id", event.id)

      if (countError) {
        console.error(`Error counting RSVPs for event ${event.id}:`, countError)
        return { ...event, rsvpCount: null }
      }

      return { ...event, rsvpCount: count ?? 0 }
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
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-(family-name:--font-unbounded) text-lg font-extrabold tracking-[0.02em] text-[oklch(95%_0.006_250)] sm:text-xl"
            >
              SENDIT
            </Link>
            <div className="hidden h-4 w-px bg-[oklch(30%_0.012_250)] sm:block"></div>
            <div className="hidden sm:block">
              <h1 className="font-(family-name:--font-unbounded) text-xl font-extrabold text-[oklch(95%_0.006_250)]">
                Dashboard
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UserMenu />
            <Link
              href="/create"
              className="rounded-full bg-[oklch(78%_0.19_135)] px-5 py-2.5 text-center text-[12px] font-bold text-[oklch(14%_0.012_250)] hover:bg-[oklch(85%_0.19_135)] sm:px-6 sm:text-[13px]"
            >
              Create Event
            </Link>
          </div>
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
                    {event.rsvpCount === null
                      ? "Unable to load RSVPs"
                      : `${event.rsvpCount} ${event.rsvpCount === 1 ? "RSVP" : "RSVPs"}`}
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
