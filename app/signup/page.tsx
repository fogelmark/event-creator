"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/auth"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      const { error } = await signUp(email, password)

      if (error) {
        setError(error.message)
        return
      }

      // Supabase sends confirmation email by default
      // You can redirect to a "check your email" page or auto-login
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(14%_0.012_250)] p-4 font-(family-name:--font-manrope)">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="font-(family-name:--font-unbounded) text-2xl font-extrabold tracking-[0.02em] text-[oklch(95%_0.006_250)]"
          >
            SENDIT
          </Link>
          <h1 className="mt-6 font-(family-name:--font-unbounded) text-2xl font-bold text-[oklch(95%_0.006_250)]">
            Create your account
          </h1>
          <p className="mt-2 text-[14px] text-[oklch(68%_0.012_250)]">
            Start creating beautiful event invites
          </p>
        </div>

        <div className="rounded-2xl border border-[oklch(28%_0.012_250)] bg-[oklch(20%_0.012_250)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[oklch(90%_0.006_250)]"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-[oklch(30%_0.012_250)] bg-[oklch(14%_0.012_250)] px-4 py-3 text-[oklch(95%_0.006_250)] focus:border-[oklch(78%_0.19_135)] focus:outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[oklch(90%_0.006_250)]"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-[oklch(30%_0.012_250)] bg-[oklch(14%_0.012_250)] px-4 py-3 text-[oklch(95%_0.006_250)] focus:border-[oklch(78%_0.19_135)] focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-[oklch(90%_0.006_250)]"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-[oklch(30%_0.012_250)] bg-[oklch(14%_0.012_250)] px-4 py-3 text-[oklch(95%_0.006_250)] focus:border-[oklch(78%_0.19_135)] focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-[oklch(78%_0.19_135)] px-6 py-3.5 text-[14px] font-bold text-[oklch(14%_0.012_250)] hover:bg-[oklch(88%_0.19_135)] disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[oklch(68%_0.012_250)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[oklch(78%_0.19_135)] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
