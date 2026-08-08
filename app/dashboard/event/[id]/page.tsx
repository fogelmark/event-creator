import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Link from "next/link"

interface Event {
  id: string
  slug: string
  name: string
  date: string
  location: string
  description: string | null
  image_url: string | null
  tier_label: string
}

interface Rsvp {
  id: string
  name: string
  email: string
  status: "going" | "maybe" | "not_going"
  created_at: string
}

async function getEvent(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return null
  return data
}

async function getRsvps(eventId: string): Promise<Rsvp[]> {
  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })

  if (error) return []
  return data
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await getEvent(id)

  if (!event) {
    notFound()
  }

  const rsvps = await getRsvps(id)

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

  const statusCounts = {
    going: rsvps.filter((r) => r.status === "going").length,
    maybe: rsvps.filter((r) => r.status === "maybe").length,
    not_going: rsvps.filter((r) => r.status === "not_going").length,
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "going":
        return "Going"
      case "maybe":
        return "Maybe"
      case "not_going":
        return "Can't go"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "going":
        return "bg-[oklch(78%_0.19_135)] text-[oklch(14%_0.012_250)]"
      case "maybe":
        return "bg-[oklch(65%_0.15_80)] text-[oklch(14%_0.012_250)]"
      case "not_going":
        return "bg-[oklch(40%_0.012_250)] text-[oklch(78%_0.012_250)]"
      default:
        return "bg-[oklch(24%_0.012_250)] text-[oklch(78%_0.012_250)]"
    }
  }

  return (
    <div className="min-h-screen bg-[oklch(14%_0.012_250)] p-6 font-(family-name:--font-manrope)">
      <div className="mx-auto max-w-4xl">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="mb-6 inline-block text-[13px] text-[oklch(78%_0.19_135)] hover:underline"
        >
          ← Back to Dashboard
        </Link>

        {/* Event Header */}
        <div className="mb-8">
          <h1 className="font-(family-name:--font-unbounded) text-3xl font-extrabold text-[oklch(95%_0.006_250)]">
            {event.name}
          </h1>
          <p className="mt-2 text-[13px] text-[oklch(78%_0.012_250)]">
            {formatDate(event.date)} · {event.location}
          </p>
          <p className="mt-1 text-[13px] text-[oklch(50%_0.012_250)]">
            /i/{event.slug}
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-[oklch(20%_0.012_250)] p-4">
            <p className="text-[13px] text-[oklch(78%_0.012_250)]">Going</p>
            <p className="font-(family-name:--font-unbounded) text-2xl font-bold text-[oklch(78%_0.19_135)]">
              {statusCounts.going}
            </p>
          </div>
          <div className="rounded-lg bg-[oklch(20%_0.012_250)] p-4">
            <p className="text-[13px] text-[oklch(78%_0.012_250)]">Maybe</p>
            <p className="font-(family-name:--font-unbounded) text-2xl font-bold text-[oklch(65%_0.15_80)]">
              {statusCounts.maybe}
            </p>
          </div>
          <div className="rounded-lg bg-[oklch(20%_0.012_250)] p-4">
            <p className="text-[13px] text-[oklch(78%_0.012_250)]">Can't go</p>
            <p className="font-(family-name:--font-unbounded) text-2xl font-bold text-[oklch(50%_0.012_250)]">
              {statusCounts.not_going}
            </p>
          </div>
        </div>

        {/* RSVPs List */}
        <div>
          <h2 className="mb-4 font-(family-name:--font-unbounded) text-xl font-bold text-[oklch(95%_0.006_250)]">
            All RSVPs ({rsvps.length})
          </h2>

          {rsvps.length === 0 ? (
            <div className="rounded-lg bg-[oklch(20%_0.012_250)] p-8 text-center">
              <p className="text-[oklch(78%_0.012_250)]">No RSVPs yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rsvps.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="flex items-center justify-between rounded-lg bg-[oklch(20%_0.012_250)] p-4"
                >
                  <div>
                    <p className="font-bold text-[oklch(95%_0.006_250)]">
                      {rsvp.name}
                    </p>
                    <p className="text-[13px] text-[oklch(78%_0.012_250)]">
                      {rsvp.email}
                    </p>
                  </div>
                  <div
                    className={`rounded-full px-4 py-1.5 text-[13px] font-bold ${getStatusColor(rsvp.status)}`}
                  >
                    {getStatusLabel(rsvp.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
