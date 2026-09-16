import { getSupabaseServer } from "@/lib/supabase-server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import InviteControls from "@/components/InviteControls"
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

interface Invite {
  id: string
  email: string
  name: string | null
  sent_at: string | null
  send_error: string | null
}

// Read through the service-role client: the invites table denies the anon key,
// since its rows contain secret RSVP tokens.
async function getInvites(eventId: string): Promise<Invite[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("invites")
    .select("id, email, name, sent_at, send_error")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true })

  if (error) return []
  return data
}

// RLS only lets the event owner read RSVPs, and the anon key has no user
// session, so this also goes through the service-role client.
async function getRsvps(eventId: string): Promise<Rsvp[]> {
  const { data, error } = await getSupabaseAdmin()
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

  const [rsvps, invites] = await Promise.all([getRsvps(id), getInvites(id)])

  const rsvpByEmail = new Map(rsvps.map((rsvp) => [rsvp.email, rsvp]))
  const pendingInvites = invites.filter((invite) => !invite.sent_at)

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
              Can&apos;t go
            </p>
            <p className="font-(family-name:--font-unbounded) text-xl font-bold text-[oklch(50%_0.012_250)] sm:text-2xl">
              {statusCounts.not_going}
            </p>
          </div>
        </div>

        {/* Invites */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-3 flex items-baseline justify-between sm:mb-4">
            <h2 className="font-(family-name:--font-unbounded) text-lg font-bold text-[oklch(95%_0.006_250)] sm:text-xl">
              Invites ({invites.length})
            </h2>
            <span className="text-[12px] text-[oklch(68%_0.012_250)] sm:text-[13px]">
              {invites.length - pendingInvites.length} sent ·{" "}
              {pendingInvites.length} pending
            </span>
          </div>

          <InviteControls
            eventId={event.id}
            pendingCount={pendingInvites.length}
          />

          {invites.length > 0 && (
            <div className="mt-3 space-y-2">
              {invites.map((invite) => {
                const rsvp = rsvpByEmail.get(invite.email)
                return (
                  <div
                    key={invite.id}
                    className="flex flex-col gap-2 rounded-lg bg-[oklch(20%_0.012_250)] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[oklch(95%_0.006_250)]">
                        {invite.name || invite.email}
                      </p>
                      {invite.name && (
                        <p className="truncate text-[12px] text-[oklch(78%_0.012_250)] sm:text-[13px]">
                          {invite.email}
                        </p>
                      )}
                      {invite.send_error && (
                        <p className="mt-1 text-[11px] text-[oklch(65%_0.15_80)]">
                          {invite.send_error}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {rsvp && (
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-bold ${getStatusColor(rsvp.status)}`}
                        >
                          {getStatusLabel(rsvp.status)}
                        </span>
                      )}
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                          invite.send_error
                            ? "bg-[oklch(30%_0.08_30)] text-[oklch(85%_0.1_30)]"
                            : invite.sent_at
                              ? "bg-[oklch(24%_0.012_250)] text-[oklch(78%_0.012_250)]"
                              : "bg-[oklch(24%_0.012_250)] text-[oklch(65%_0.15_80)]"
                        }`}
                      >
                        {invite.send_error
                          ? "Failed"
                          : invite.sent_at
                            ? "Sent"
                            : "Pending"}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* RSVPs List */}
        <div>
          <h2 className="mb-3 font-(family-name:--font-unbounded) text-lg font-bold text-[oklch(95%_0.006_250)] sm:mb-4 sm:text-xl">
            All RSVPs ({rsvps.length})
          </h2>

          {rsvps.length === 0 ? (
            <div className="rounded-lg bg-[oklch(20%_0.012_250)] p-6 text-center sm:p-8">
              <p className="text-[13px] text-[oklch(78%_0.012_250)] sm:text-[14px]">
                No RSVPs yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {rsvps.map((rsvp) => (
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
