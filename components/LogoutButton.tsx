"use client"

import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-[12px] font-bold text-[oklch(78%_0.012_250)] hover:text-[oklch(95%_0.006_250)] sm:text-[13px]"
    >
      Sign out
    </button>
  )
}
