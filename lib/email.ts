import { render } from "@react-email/components"
import { Resend } from "resend"
import { InviteEmail } from "@/emails/InviteEmail"
import { formatEventDateTime } from "@/lib/format"
import { getBaseUrl } from "@/lib/invites"

// Resend's batch endpoint accepts at most 100 messages per call.
const BATCH_SIZE = 100

let resendInstance: Resend | null = null

function getResend() {
  if (resendInstance) return resendInstance

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable.")
  }

  resendInstance = new Resend(apiKey)
  return resendInstance
}

function getFromAddress() {
  // Until a domain is verified in Resend, onboarding@resend.dev only delivers
  // to the address the Resend account was registered with.
  return process.env.RESEND_FROM || "SENDIT <onboarding@resend.dev>"
}

export interface InviteEventDetails {
  slug: string
  name: string
  date: string
  location: string
  tier_label: string
  description: string | null
  image_url: string | null
}

export interface InviteRecipient {
  id: string
  email: string
  name: string | null
  token: string
}

export interface InviteSendResult {
  inviteId: string
  error: string | null
}

// Exported so /dev/invite-preview shows the same text part that actually sends,
// rather than react-email's auto-generated approximation.
export function buildPlainText(
  event: Pick<
    InviteEventDetails,
    "name" | "location" | "tier_label" | "description"
  >,
  dateLine: string,
  urls: {
    eventUrl: string
    goingUrl: string
    maybeUrl: string
    notGoingUrl: string
  },
) {
  return [
    `YOU'RE INVITED`,
    ``,
    event.name,
    dateLine,
    event.location,
    event.tier_label,
    ...(event.description ? [``, event.description] : []),
    ``,
    `RSVP:`,
    `  Going:    ${urls.goingUrl}`,
    `  Maybe:    ${urls.maybeUrl}`,
    `  Can't go: ${urls.notGoingUrl}`,
    ``,
    `Full invite: ${urls.eventUrl}`,
    ``,
    `— SENDIT`,
  ].join("\n")
}

// Renders and sends one branded invite per recipient, each with its own RSVP
// token. Returns a per-invite result so the caller can record sent/failed state.
export async function sendEventInvites(
  event: InviteEventDetails,
  recipients: InviteRecipient[],
): Promise<InviteSendResult[]> {
  if (recipients.length === 0) return []

  const baseUrl = getBaseUrl()
  const from = getFromAddress()
  const dateLine = formatEventDateTime(event.date)
  const eventUrl = `${baseUrl}/i/${event.slug}`

  const messages = await Promise.all(
    recipients.map(async (recipient) => {
      const rsvpUrl = (status: string) =>
        `${baseUrl}/rsvp/${recipient.token}?status=${status}`
      const urls = {
        eventUrl,
        goingUrl: rsvpUrl("going"),
        maybeUrl: rsvpUrl("maybe"),
        notGoingUrl: rsvpUrl("not_going"),
      }

      const element = InviteEmail({
        eventName: event.name,
        dateLine,
        location: event.location,
        tierLabel: event.tier_label,
        description: event.description,
        imageUrl: event.image_url,
        recipientName: recipient.name,
        ...urls,
      })

      return {
        from,
        to: recipient.email,
        subject: `You're invited: ${event.name}`,
        html: await render(element),
        text: buildPlainText(event, dateLine, urls),
      }
    }),
  )

  const results: InviteSendResult[] = []

  for (let offset = 0; offset < messages.length; offset += BATCH_SIZE) {
    const chunk = messages.slice(offset, offset + BATCH_SIZE)
    const chunkRecipients = recipients.slice(offset, offset + BATCH_SIZE)

    try {
      // 'permissive' reports per-message failures instead of rejecting the
      // whole batch, so one bad address cannot block everyone else's invite.
      const { data, error } = await getResend().batch.send(chunk, {
        batchValidation: "permissive",
      })

      if (error) {
        chunkRecipients.forEach((recipient) =>
          results.push({ inviteId: recipient.id, error: error.message }),
        )
        continue
      }

      const failures = new Map<number, string>()
      for (const failure of data?.errors ?? []) {
        failures.set(failure.index, failure.message)
      }

      chunkRecipients.forEach((recipient, index) =>
        results.push({
          inviteId: recipient.id,
          error: failures.get(index) ?? null,
        }),
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown send error"
      chunkRecipients.forEach((recipient) =>
        results.push({ inviteId: recipient.id, error: message }),
      )
    }
  }

  return results
}
