"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { InvitePreview } from "@/components/InvitePreview"

export default function CreateEvent() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
    tierLabel: "VIP + Press only",
    image: null as File | null,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const slug = generateSlug(formData.name)
      const dateTime = `${formData.date}T${formData.time}`

      // Upload image to Vercel Blob if exists
      let imageUrl = ""
      if (formData.image) {
        const uploadRes = await fetch(
          `/api/upload?filename=${encodeURIComponent(formData.image.name)}`,
          {
            method: "POST",
            body: formData.image,
          },
        )

        if (!uploadRes.ok) throw new Error("Failed to upload image")
        const { url } = await uploadRes.json()
        imageUrl = url
      }

      // Save event to Supabase
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          name: formData.name,
          date: dateTime,
          location: formData.location,
          description: formData.description,
          image_url: imageUrl,
          tier_label: formData.tierLabel,
        }),
      })

      if (!res.ok) throw new Error("Failed to create event")

      const { slug: createdSlug } = await res.json()
      router.push(`/i/${createdSlug}`)
    } catch (error) {
      console.error(error)
      alert("Failed to create event. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Create preview URL for the image
  const previewImageUrl = formData.image
    ? URL.createObjectURL(formData.image)
    : ""

  return (
    <div className="min-h-screen bg-[oklch(14%_0.012_250)] font-(family-name:--font-manrope)">
      {/* Header */}
      <div className="border-b border-[oklch(24%_0.012_250)]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-8 py-7">
          <a
            href="/"
            className="font-(family-name:--font-unbounded) text-xl font-extrabold tracking-[0.02em] text-[oklch(95%_0.006_250)]"
          >
            SENDIT
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto grid max-w-[1280px] grid-cols-[1fr_0.9fr] gap-16 px-8 py-16">
        {/* Form */}
        <div>
          <h1 className="mb-2 font-(family-name:--font-unbounded) text-[42px] leading-[1.05] font-extrabold text-[oklch(95%_0.006_250)]">
            Create your invite
          </h1>
          <p className="mb-12 text-[17px] leading-[1.6] text-[oklch(68%_0.012_250)]">
            Fill in your event details and watch the preview update in
            real-time.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Event Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-[oklch(90%_0.006_250)]"
              >
                Event Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. NOCTURNE LISTENING SESSION"
                className="w-full rounded-lg border border-[oklch(30%_0.012_250)] bg-[oklch(20%_0.012_250)] px-4 py-3 text-[oklch(95%_0.006_250)] placeholder-[oklch(50%_0.012_250)] focus:border-[oklch(78%_0.19_135)] focus:outline-none"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-semibold text-[oklch(90%_0.006_250)]"
                >
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[oklch(30%_0.012_250)] bg-[oklch(20%_0.012_250)] px-4 py-3 text-[oklch(95%_0.006_250)] focus:border-[oklch(78%_0.19_135)] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="mb-2 block text-sm font-semibold text-[oklch(90%_0.006_250)]"
                >
                  Time *
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[oklch(30%_0.012_250)] bg-[oklch(20%_0.012_250)] px-4 py-3 text-[oklch(95%_0.006_250)] focus:border-[oklch(78%_0.19_135)] focus:outline-none"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-semibold text-[oklch(90%_0.006_250)]"
              >
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. The Vault, Los Angeles"
                className="w-full rounded-lg border border-[oklch(30%_0.012_250)] bg-[oklch(20%_0.012_250)] px-4 py-3 text-[oklch(95%_0.006_250)] placeholder-[oklch(50%_0.012_250)] focus:border-[oklch(78%_0.19_135)] focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-[oklch(90%_0.006_250)]"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Additional details about your event..."
                rows={3}
                className="w-full rounded-lg border border-[oklch(30%_0.012_250)] bg-[oklch(20%_0.012_250)] px-4 py-3 text-[oklch(95%_0.006_250)] placeholder-[oklch(50%_0.012_250)] focus:border-[oklch(78%_0.19_135)] focus:outline-none"
              />
            </div>

            {/* Tier Label */}
            <div>
              <label
                htmlFor="tierLabel"
                className="mb-2 block text-sm font-semibold text-[oklch(90%_0.006_250)]"
              >
                Tier Label
              </label>
              <input
                type="text"
                id="tierLabel"
                name="tierLabel"
                value={formData.tierLabel}
                onChange={handleChange}
                placeholder="e.g. VIP + Press only"
                className="w-full rounded-lg border border-[oklch(30%_0.012_250)] bg-[oklch(20%_0.012_250)] px-4 py-3 text-[oklch(95%_0.006_250)] placeholder-[oklch(50%_0.012_250)] focus:border-[oklch(78%_0.19_135)] focus:outline-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-semibold text-[oklch(90%_0.006_250)]"
              >
                Event Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-lg border border-[oklch(30%_0.012_250)] bg-[oklch(20%_0.012_250)] px-4 py-3 text-[oklch(95%_0.006_250)] file:mr-4 file:rounded-full file:border-0 file:bg-[oklch(78%_0.19_135)] file:px-4 file:py-2 file:text-sm file:font-bold file:text-[oklch(14%_0.012_250)] hover:file:bg-[oklch(88%_0.19_135)]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 rounded-full bg-[oklch(78%_0.19_135)] px-8 py-4 text-[15px] font-bold text-[oklch(14%_0.012_250)] hover:bg-[oklch(88%_0.19_135)] disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Invite"}
            </button>
          </form>
        </div>

        {/* Live Preview */}
        <div className="sticky top-8 h-fit">
          <InvitePreview
            name={formData.name}
            date={formData.date}
            time={formData.time}
            location={formData.location}
            tierLabel={formData.tierLabel}
            imageUrl={previewImageUrl}
          />
        </div>
      </div>
    </div>
  )
}
