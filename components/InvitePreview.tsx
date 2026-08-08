interface InvitePreviewProps {
  name: string
  date: string
  time: string
  location: string
  tierLabel: string
  imageUrl?: string
}

export function InvitePreview({
  name,
  date,
  time,
  location,
  tierLabel,
  imageUrl,
}: InvitePreviewProps) {
  // Format date for display
  const formatDate = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return ""

    const d = new Date(`${dateStr}T${timeStr}`)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
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

    const dayName = days[d.getDay()]
    const month = months[d.getMonth()]
    const day = d.getDate()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, "0")

    return `${dayName} ${month} ${day} · ${displayHours}:${displayMinutes} ${ampm}`
  }

  const formattedDateTime = formatDate(date, time)

  return (
    <div>
      <div className="mb-4 text-center text-xs font-semibold tracking-wider text-[oklch(78%_0.19_135)] uppercase">
        Live Preview
      </div>
      <div className="rounded-[20px] border border-[oklch(30%_0.012_250)] bg-[oklch(20%_0.012_250)] p-5 shadow-[0_40px_80px_-20px_oklch(5%_0_0/0.6)]">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[oklch(45%_0.01_250)]"></span>
          <span className="h-2 w-2 rounded-full bg-[oklch(45%_0.01_250)]"></span>
          <span className="h-2 w-2 rounded-full bg-[oklch(45%_0.01_250)]"></span>
          <span className="ml-2 font-mono text-[11px] text-[oklch(55%_0.01_250)]">
            sendit.co/i/
            {name ? name.toLowerCase().replace(/\s+/g, "-") : "your-event"}
          </span>
        </div>

        <div
          className={`relative flex aspect-9/13 flex-col justify-end overflow-hidden rounded-xl p-7 ${
            imageUrl ? "" : "stripes"
          }`}
          style={
            imageUrl
              ? {
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
        >
          <div className="absolute inset-0 bg-linear-to-t from-[oklch(14%_0.012_250/0.92)] to-[oklch(14%_0.012_250/0.1)] to-55%"></div>
          <div className="relative z-10">
            <div className="mb-2.5 font-mono text-[11px] tracking-wider text-[oklch(78%_0.19_135)] uppercase">
              {imageUrl ? "Event Image" : "Image Drop Zone"}
            </div>
            <div className="mb-2.5 font-(family-name:--font-unbounded) text-[30px] leading-[1.05] font-extrabold text-[oklch(95%_0.006_250)]">
              {name || "YOUR EVENT NAME"}
            </div>
            <div className="mb-4.5 text-[13.5px] leading-normal text-[oklch(78%_0.012_250)]">
              {formattedDateTime || "Date & Time"}
              <br />
              {location || "Location"}
              <br />
              {tierLabel}
            </div>
            <div className="rounded-full bg-[oklch(95%_0.006_250)] py-3 text-center text-[13px] font-bold text-[oklch(14%_0.012_250)]">
              RSVP
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
