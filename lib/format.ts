const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
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

// "Fri Oct 3 · 8:00 PM" — matches the format used in InvitePreview and /i/[slug].
export function formatEventDateTime(dateStr: string): string {
  const d = new Date(dateStr)
  const hours = d.getHours()
  const ampm = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 || 12
  const displayMinutes = d.getMinutes().toString().padStart(2, "0")

  return `${DAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${d.getDate()} · ${displayHours}:${displayMinutes} ${ampm}`
}
