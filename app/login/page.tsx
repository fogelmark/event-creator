"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { signIn } from "@/lib/auth"
import Link from "next/link"

function LoginForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const { data, error } = await signIn(email, password)

      if (error) {
        console.error("Login error:", error)
        setError(error.message)
        setIsLoading(false)
        return
      }

      if (!data.session) {
        setError(
          "No session returned. Please check your email to confirm your account.",
        )
        setIsLoading(false)
        return
      }

      // Redirect to the original page or dashboard
      const redirectTo = searchParams.get("redirect") || "/dashboard"

      // Force a hard navigation to ensure middleware runs
      window.location.href = redirectTo
    } catch (err) {
      console.error("Unexpected error:", err)
      setError("An unexpected error occurred")
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
            Welcome back
          </h1>
          <p className="mt-2 text-[14px] text-[oklch(68%_0.012_250)]">
            Sign in to your account
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
                className="w-full rounded-lg border border-[oklch(30%_0.012_250)] bg-[oklch(14%_0.012_250)] px-4 py-3 text-[oklch(95%_0.006_250)] focus:outline-none"
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
                className="w-full rounded-lg border border-[oklch(30%_0.012_250)] bg-[oklch(14%_0.012_250)] px-4 py-3 text-[oklch(95%_0.006_250)] focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-[oklch(78%_0.19_135)] px-6 py-3.5 text-[14px] font-bold text-[oklch(14%_0.012_250)] hover:bg-[oklch(88%_0.19_135)] disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[oklch(68%_0.012_250)]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[oklch(78%_0.19_135)] hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[oklch(14%_0.012_250)]">
          <div className="text-[oklch(78%_0.19_135)]">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
