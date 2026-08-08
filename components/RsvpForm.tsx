"use client"

import { useState } from "react"

interface RsvpFormProps {
  eventId: string
}

export default function RsvpForm({ eventId }: RsvpFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"going" | "maybe" | "not_going">("going")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId, name, email, status }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to submit RSVP")
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit RSVP")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-lg bg-[oklch(20%_0.012_250)] p-6 text-center">
        <div className="mb-2 text-2xl">✓</div>
        <p className="text-[13px] text-[oklch(78%_0.19_135)]">
          Thanks for your RSVP!
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-[13px] text-[oklch(78%_0.012_250)]"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg bg-[oklch(20%_0.012_250)] px-4 py-2.5 text-[13px] text-[oklch(95%_0.006_250)] focus:ring-2 focus:ring-[oklch(78%_0.19_135)] focus:outline-none"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-[13px] text-[oklch(78%_0.012_250)]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg bg-[oklch(20%_0.012_250)] px-4 py-2.5 text-[13px] text-[oklch(95%_0.006_250)] focus:ring-2 focus:ring-[oklch(78%_0.19_135)] focus:outline-none"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="mb-2.5 block text-[13px] text-[oklch(78%_0.012_250)]">
          Will you attend?
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setStatus("going")}
            className={`rounded-lg py-2.5 text-[13px] font-bold transition-colors ${
              status === "going"
                ? "bg-[oklch(78%_0.19_135)] text-[oklch(14%_0.012_250)]"
                : "bg-[oklch(20%_0.012_250)] text-[oklch(78%_0.012_250)] hover:bg-[oklch(24%_0.012_250)]"
            }`}
          >
            Going
          </button>
          <button
            type="button"
            onClick={() => setStatus("maybe")}
            className={`rounded-lg py-2.5 text-[13px] font-bold transition-colors ${
              status === "maybe"
                ? "bg-[oklch(78%_0.19_135)] text-[oklch(14%_0.012_250)]"
                : "bg-[oklch(20%_0.012_250)] text-[oklch(78%_0.012_250)] hover:bg-[oklch(24%_0.012_250)]"
            }`}
          >
            Maybe
          </button>
          <button
            type="button"
            onClick={() => setStatus("not_going")}
            className={`rounded-lg py-2.5 text-[13px] font-bold transition-colors ${
              status === "not_going"
                ? "bg-[oklch(78%_0.19_135)] text-[oklch(14%_0.012_250)]"
                : "bg-[oklch(20%_0.012_250)] text-[oklch(78%_0.012_250)] hover:bg-[oklch(24%_0.012_250)]"
            }`}
          >
            Can't go
          </button>
        </div>
      </div>

      {error && <p className="text-[13px] text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-[oklch(95%_0.006_250)] py-3 text-center text-[13px] font-bold text-[oklch(14%_0.012_250)] hover:bg-[oklch(78%_0.19_135)] disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit RSVP"}
      </button>
    </form>
  )
}
