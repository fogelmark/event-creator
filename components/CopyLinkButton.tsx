"use client"

import { useState } from "react"

interface CopyLinkButtonProps {
  slug: string
}

export default function CopyLinkButton({ slug }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const url = `${window.location.origin}/i/${slug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg bg-[oklch(78%_0.19_135)] px-4 py-2 text-center text-[12px] font-bold text-[oklch(14%_0.012_250)] hover:bg-[oklch(85%_0.19_135)] sm:text-[13px]"
    >
      {copied ? "Copied!" : "Copy Link"}
    </button>
  )
}
