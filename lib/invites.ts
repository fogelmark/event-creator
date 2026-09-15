export interface ParsedInvite {
  email: string
  name: string | null
}

export const RSVP_STATUSES = ["going", "maybe", "not_going"] as const
export type RsvpStatus = (typeof RSVP_STATUSES)[number]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAMED_ADDRESS_REGEX = /^(.*?)\s*<([^>]+)>$/

// Accepts a free-form list separated by newlines, commas or semicolons, where
// each entry is either "someone@example.com" or "Their Name <someone@example.com>".
export function parseInviteList(raw: string): {
  invites: ParsedInvite[]
  invalid: string[]
} {
  const entries = raw
    .split(/[\n,;]+/)
    .map((entry) => entry.trim())
    .filter(Boolean)

  const invites: ParsedInvite[] = []
  const invalid: string[] = []
  const seen = new Set<string>()

  for (const entry of entries) {
    const match = entry.match(NAMED_ADDRESS_REGEX)
    const name = match ? match[1].replace(/^["']|["']$/g, "").trim() : ""
    const email = (match ? match[2] : entry).trim().toLowerCase()

    if (!EMAIL_REGEX.test(email)) {
      invalid.push(entry)
      continue
    }
    if (seen.has(email)) continue

    seen.add(email)
    invites.push({ email, name: name || null })
  }

  return { invites, invalid }
}

// Falls back to the local part of the address, since rsvps.name is NOT NULL and
// a one-click RSVP from an unnamed invite has no other name to use.
export function displayNameFor(invite: ParsedInvite): string {
  return invite.name || invite.email.split("@")[0]
}

export function generateInviteToken(): string {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return "http://localhost:3000"
}
