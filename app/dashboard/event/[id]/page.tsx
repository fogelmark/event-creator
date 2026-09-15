import { getSupabaseServer } from "@/lib/supabase-server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface Event {
  id: string
  user_id: string
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

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await getSupabaseServer()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Use admin client to fetch data (bypasses RLS issues)
  const supabaseAdmin = getSupabaseAdmin()

  // Get event and verify ownership
  const { data: event, error: eventError } = await supabaseAdmin
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (eventError || !event) {
    notFound()
  }

  // Get RSVPs for this event
  const { data: rsvps, error: rsvpsError } = await supabaseAdmin
    .from("rsvps")
    .select("*")
    .eq("event_id", id)
    .order("created_at", { ascending: false })

  const eventRsvps = rsvps || []

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
    going: eventRsvps.filter((r) => r.status === "going").length,
    maybe: eventRsvps.filter((r) => r.status === "maybe").length,
    not_going: eventRsvps.filter((r) => r.status === "not_going").length,
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
    <div className="min-h-screen bg-[oklch(14%_0.012_250)] p-4 font-(family-name:--font-manrope) sm:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="mb-4 inline-block text-[12px] text-[oklch(78%_0.19_135)] hover:underline sm:mb-6 sm:text-[13px]"
        >
          ← Back to Dashboard
        </Link>

        {/* Event Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-(family-name:--font-unbounded) text-2xl font-extrabold text-[oklch(95%_0.006_250)] sm:text-3xl">
            {event.name}
          </h1>
          <p className="mt-2 text-[12px] text-[oklch(78%_0.012_250)] sm:text-[13px]">
            {formatDate(event.date)} · {event.location}
          </p>
          <p className="mt-1 text-[12px] text-[oklch(50%_0.012_250)] sm:text-[13px]">
            /i/{event.slug}
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3 sm:mb-8 sm:gap-4">
          <div className="rounded-lg bg-[oklch(20%_0.012_250)] p-3 sm:p-4">
            <p className="text-[11px] text-[oklch(78%_0.012_250)] sm:text-[13px]">
              Going
            </p>
            <p className="font-(family-name:--font-unbounded) text-xl font-bold text-[oklch(78%_0.19_135)] sm:text-2xl">
              {statusCounts.going}
            </p>
          </div>
          <div className="rounded-lg bg-[oklch(20%_0.012_250)] p-3 sm:p-4">
            <p className="text-[11px] text-[oklch(78%_0.012_250)] sm:text-[13px]">
              Maybe
            </p>
            <p className="font-(family-name:--font-unbounded) text-xl font-bold text-[oklch(65%_0.15_80)] sm:text-2xl">
              {statusCounts.maybe}
            </p>
          </div>
          <div className="rounded-lg bg-[oklch(20%_0.012_250)] p-3 sm:p-4">
            <p className="text-[11px] text-[oklch(78%_0.012_250)] sm:text-[13px]">
              Can't go
            </p>
            <p className="font-(family-name:--font-unbounded) text-xl font-bold text-[oklch(50%_0.012_250)] sm:text-2xl">
              {statusCounts.not_going}
            </p>
          </div>
        </div>

        {/* RSVPs List */}
        <div>
          <h2 className="mb-3 font-(family-name:--font-unbounded) text-lg font-bold text-[oklch(95%_0.006_250)] sm:mb-4 sm:text-xl">
            All RSVPs ({eventRsvps.length})
          </h2>

          {eventRsvps.length === 0 ? (
            <div className="rounded-lg bg-[oklch(20%_0.012_250)] p-6 text-center sm:p-8">
              <p className="text-[13px] text-[oklch(78%_0.012_250)] sm:text-[14px]">
                No RSVPs yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {eventRsvps.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="flex flex-col gap-3 rounded-lg bg-[oklch(20%_0.012_250)] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                >
                  <div>
                    <p className="text-sm font-bold text-[oklch(95%_0.006_250)] sm:text-base">
                      {rsvp.name}
                    </p>
                    <p className="text-[12px] text-[oklch(78%_0.012_250)] sm:text-[13px]">
                      {rsvp.email}
                    </p>
                  </div>
                  <div
                    className={`w-fit rounded-full px-3 py-1.5 text-[11px] font-bold sm:px-4 sm:text-[13px] ${getStatusColor(rsvp.status)}`}
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
