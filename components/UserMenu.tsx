"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, signOut } from "@/lib/auth"

export default function UserMenu() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    getCurrentUser().then((user) => {
      setUserEmail(user?.email || null)
    })
  }, [])

  const handleLogout = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  if (!userEmail) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-[oklch(30%_0.012_250)] bg-[oklch(20%_0.012_250)] px-3 py-2 text-[12px] font-semibold text-[oklch(90%_0.006_250)] hover:border-[oklch(40%_0.012_250)] sm:px-4 sm:text-[13px]"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[oklch(78%_0.19_135)] text-[11px] font-bold text-[oklch(14%_0.012_250)]">
          {userEmail[0].toUpperCase()}
        </div>
        <span className="hidden sm:inline">{userEmail}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full right-0 z-20 mt-2 w-48 rounded-lg border border-[oklch(28%_0.012_250)] bg-[oklch(20%_0.012_250)] py-2 shadow-xl">
            <div className="border-b border-[oklch(28%_0.012_250)] px-4 py-2">
              <p className="truncate text-[12px] text-[oklch(90%_0.006_250)]">
                {userEmail}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-[13px] font-semibold text-[oklch(78%_0.012_250)] hover:bg-[oklch(24%_0.012_250)] hover:text-[oklch(95%_0.006_250)]"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
