"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { parseInviteList } from "@/lib/invites"

interface InviteControlsProps {
  eventId: string
  pendingCount: number
}

export default function InviteControls({
  eventId,
  pendingCount,
}: InviteControlsProps) {
  const router = useRouter()
  const [emails, setEmails] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState<{
    kind: "ok" | "error"
    text: string
  } | null>(null)

  const { invites: parsed, invalid } = parseInviteList(emails)

  const handleAdd = async () => {
    setIsAdding(true)
    setMessage(null)

    try {
      const res = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId, emails }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to add invites")

      setEmails("")
      setMessage({
        kind: "ok",
        text: `Added ${data.added} invite${data.added === 1 ? "" : "s"}${
          data.skipped ? `, skipped ${data.skipped} already on the list` : ""
        }.`,
      })
      router.refresh()
    } catch (err) {
      setMessage({
        kind: "error",
        text: err instanceof Error ? err.message : "Failed to add invites",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleSend = async () => {
    setIsSending(true)
    setMessage(null)

    try {
      const res = await fetch("/api/invites/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to send invites")

      setMessage({
        kind: data.failed > 0 ? "error" : "ok",
        text:
          data.sent === 0 && data.failed === 0
            ? "No pending invites to send."
            : `Sent ${data.sent} invite${data.sent === 1 ? "" : "s"}${
                data.failed ? `, ${data.failed} failed` : ""
              }.`,
      })
      router.refresh()
    } catch (err) {
      setMessage({
        kind: "error",
        text: err instanceof Error ? err.message : "Failed to send invites",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="rounded-lg bg-[oklch(20%_0.012_250)] p-4 sm:p-5">
      <textarea
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
        placeholder={"alex@label.com\nJordan Reed <jordan@press.com>"}
        rows={3}
        className="w-full rounded-lg border border-[oklch(30%_0.012_250)] bg-[oklch(14%_0.012_250)] px-3 py-2.5 font-mono text-[12px] text-[oklch(95%_0.006_250)] focus:outline-none sm:text-[13px]"
      />

      {(parsed.length > 0 || invalid.length > 0) && (
        <p className="mt-2 text-[12px]">
          <span className="font-semibold text-[oklch(78%_0.19_135)]">
            {parsed.length} ready
          </span>
          {invalid.length > 0 && (
            <span className="text-[oklch(65%_0.15_80)]">
              {" "}
              · {invalid.length} unrecognised
            </span>
          )}
        </p>
      )}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleAdd}
          disabled={isAdding || parsed.length === 0}
          className="rounded-full border border-[oklch(30%_0.012_250)] px-5 py-2.5 text-[13px] font-bold text-[oklch(90%_0.006_250)] hover:bg-[oklch(24%_0.012_250)] disabled:opacity-40"
        >
          {isAdding ? "Adding…" : "Add to list"}
        </button>
        <button
          type="button"
          onClick={handleSend}
          disabled={isSending || pendingCount === 0}
          className="rounded-full bg-[oklch(78%_0.19_135)] px-5 py-2.5 text-[13px] font-bold text-[oklch(14%_0.012_250)] hover:bg-[oklch(88%_0.19_135)] disabled:opacity-40"
        >
          {isSending
            ? "Sending…"
            : `Send ${pendingCount} pending invite${pendingCount === 1 ? "" : "s"}`}
        </button>
      </div>

      {message && (
        <p
          className={`mt-3 text-[12px] sm:text-[13px] ${
            message.kind === "ok"
              ? "text-[oklch(78%_0.19_135)]"
              : "text-[oklch(65%_0.15_80)]"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  )
}
