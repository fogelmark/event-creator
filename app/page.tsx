import { getSupabaseServer } from "@/lib/supabase-server"
import UserMenu from "@/components/UserMenu"

export default async function Home() {
  const logoPlaceholders = [
    "LABEL 01",
    "AGENCY 02",
    "MGMT CO",
    "PUBLISHER",
    "RECORDS",
    "STUDIO 09",
  ]

  // Check if user is authenticated
  const supabase = await getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="w-full overflow-x-hidden font-(family-name:--font-manrope)">
      {/* NAV */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-8 sm:py-7">
        <div className="font-(family-name:--font-unbounded) text-lg font-extrabold tracking-[0.02em] sm:text-xl">
          SENDIT
        </div>
        <div className="flex items-center gap-3 sm:gap-9">
          <a
            href="#pricing"
            className="hidden text-sm font-semibold text-[oklch(75%_0.01_250)] sm:block"
          >
            Pricing
          </a>
          {user ? (
            <>
              <a
                href="/dashboard"
                className="hidden text-sm font-semibold text-[oklch(75%_0.01_250)] sm:block"
              >
                Dashboard
              </a>
              <UserMenu />
            </>
          ) : (
            <>
              <a
                href="/login"
                className="hidden text-sm font-semibold text-[oklch(75%_0.01_250)] sm:block"
              >
                Sign in
              </a>
              <a
                href="/signup"
                className="rounded-full bg-[oklch(95%_0.006_250)] px-4 py-2 text-xs font-bold text-[oklch(14%_0.012_250)] hover:bg-[oklch(78%_0.19_135)] hover:text-[oklch(14%_0.012_250)] sm:px-5 sm:py-2.75 sm:text-sm"
              >
                Get Started
              </a>
            </>
          )}
        </div>
      </div>

      {/* HERO */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 pt-8 pb-6 sm:px-8 sm:pt-16 sm:pb-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[oklch(32%_0.012_250)] px-3 py-1.5 text-[11px] font-semibold tracking-[0.03em] text-[oklch(78%_0.19_135)] uppercase sm:mb-7 sm:px-3.5 sm:py-1.75 sm:text-[12.5px]">
            <span className="h-1.5 w-1.5 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-[oklch(78%_0.19_135)]"></span>
            Built for the music industry
          </div>
          <h1 className="m-0 mb-4 font-(family-name:--font-unbounded) text-[32px] leading-[1.08] font-extrabold tracking-[-0.01em] sm:mb-6 sm:text-[50px]">
            Branded invites, out the door in minutes.
          </h1>
          <p className="m-0 mb-6 max-w-115 text-[16px] leading-[1.55] text-[oklch(72%_0.012_250)] sm:mb-9 sm:text-[19px]">
            SENDIT is the invite builder made for labels, management companies,
            and publishers — release parties, listening sessions, showcases, VIP
            guestlists. Design it, send the link, watch the RSVPs come in.
          </p>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <a
              href="/signup"
              className="w-full rounded-full bg-[oklch(78%_0.19_135)] px-6 py-3.5 text-center text-[14px] font-bold text-[oklch(14%_0.012_250)] hover:bg-[oklch(88%_0.19_135)] sm:w-auto sm:px-7 sm:py-4 sm:text-[15px]"
            >
              Get started free
            </a>
            <a
              href="#pricing"
              className="border-b border-[oklch(40%_0.012_250)] pb-0.5 text-[14px] font-semibold text-[oklch(90%_0.006_250)] sm:text-[15px]"
            >
              See pricing →
            </a>
          </div>
        </div>

        <div className="relative order-first lg:order-last">
          <div className="rounded-[20px] border border-[oklch(30%_0.012_250)] bg-[oklch(20%_0.012_250)] p-5 shadow-[0_40px_80px_-20px_oklch(5%_0_0/0.6)]">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[oklch(45%_0.01_250)]"></span>
              <span className="h-2 w-2 rounded-full bg-[oklch(45%_0.01_250)]"></span>
              <span className="h-2 w-2 rounded-full bg-[oklch(45%_0.01_250)]"></span>
              <span className="ml-2 font-mono text-[11px] text-[oklch(55%_0.01_250)]">
                sendit.co/i/nocturne-listening
              </span>
            </div>
            <div className="stripes relative flex aspect-9/13 flex-col justify-end overflow-hidden rounded-xl p-7 lg:aspect-square">
              <div className="absolute inset-0 bg-linear-to-t from-[oklch(14%_0.012_250/0.92)] to-[oklch(14%_0.012_250/0.1)] to-55%"></div>
              <div className="relative z-10">
                <div className="mb-2.5 font-mono text-[11px] tracking-wider text-[oklch(78%_0.19_135)] uppercase">
                  invite preview — image drop zone
                </div>
                <div className="mb-2.5 font-(family-name:--font-unbounded) text-[30px] leading-[1.05] font-extrabold">
                  NOCTURNE
                  <br />
                  LISTENING SESSION
                </div>
                <div className="mb-4.5 text-[13.5px] leading-normal text-[oklch(78%_0.012_250)]">
                  Fri Sept 12 · 9:00 PM
                  <br />
                  The Vault, Los Angeles
                  <br />
                  VIP + Press only
                </div>
                <div className="rounded-full bg-[oklch(95%_0.006_250)] py-3 text-center text-[13px] font-bold text-[oklch(14%_0.012_250)]">
                  RSVP
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 rotate-[4deg] rounded-lg bg-[oklch(78%_0.19_135)] px-3 py-2 font-mono text-[11.5px] font-bold text-[oklch(14%_0.012_250)]">
            142 RSVPs · 38 VIP
          </div>
        </div>
      </div>

      {/* SOCIAL PROOF */}
      <div className="mx-auto max-w-7xl border-t border-[oklch(24%_0.012_250)] px-4 py-10 sm:px-8 sm:py-14">
        <div className="mb-6 text-center text-[11px] font-semibold tracking-[0.08em] text-[oklch(50%_0.012_250)] uppercase sm:mb-8 sm:text-[12.5px]">
          Trusted by teams across the industry
        </div>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {logoPlaceholders.map((logo, i) => (
            <div
              key={i}
              className="rounded-lg border border-[oklch(26%_0.012_250)] px-7 py-4 font-mono text-xs tracking-[0.04em] text-[oklch(48%_0.012_250)]"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div
        id="how-it-works"
        className="mx-auto max-w-7xl border-t border-[oklch(24%_0.012_250)] px-4 py-16 sm:px-8 sm:py-24"
      >
        <div className="mb-10 max-w-140 sm:mb-16">
          <div className="mb-2.5 text-[11px] font-bold tracking-[0.08em] text-[oklch(78%_0.19_135)] uppercase sm:mb-3.5 sm:text-[12.5px]">
            How it works
          </div>
          <h2 className="m-0 font-(family-name:--font-unbounded) text-[28px] leading-[1.05] font-extrabold sm:text-[42px]">
            From blank page to live invite before soundcheck.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          <div className="border-t border-[oklch(30%_0.012_250)] pt-6">
            <div className="mb-5 font-(family-name:--font-unbounded) text-[15px] font-extrabold text-[oklch(78%_0.19_135)]">
              01
            </div>
            <h3 className="m-0 mb-3 font-(family-name:--font-unbounded) text-[22px] font-bold">
              Build your invite
            </h3>
            <p className="m-0 text-[15px] leading-[1.6] text-[oklch(65%_0.012_250)]">
              Drop in your logo, imagery, and event details with a simple
              CMS-style editor. No designer needed, no template it feels like
              everyone else used.
            </p>
          </div>
          <div className="border-t border-[oklch(30%_0.012_250)] pt-6">
            <div className="mb-5 font-(family-name:--font-unbounded) text-[15px] font-extrabold text-[oklch(78%_0.19_135)]">
              02
            </div>
            <h3 className="m-0 mb-3 font-(family-name:--font-unbounded) text-[22px] font-bold">
              Share your link
            </h3>
            <p className="m-0 text-[15px] leading-[1.6] text-[oklch(65%_0.012_250)]">
              Every event gets one clean, branded URL. Send it over text, email,
              or DM — it opens instantly, built mobile-first.
            </p>
          </div>
          <div className="border-t border-[oklch(30%_0.012_250)] pt-6">
            <div className="mb-5 font-(family-name:--font-unbounded) text-[15px] font-extrabold text-[oklch(78%_0.19_135)]">
              03
            </div>
            <h3 className="m-0 mb-3 font-(family-name:--font-unbounded) text-[22px] font-bold">
              Track your RSVPs
            </h3>
            <p className="m-0 text-[15px] leading-[1.6] text-[oklch(65%_0.012_250)]">
              Watch responses roll in on one simple guest list. Sort by tier,
              check people in, done.
            </p>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="mx-auto max-w-7xl border-t border-[oklch(24%_0.012_250)] px-4 py-16 sm:px-8 sm:py-24">
        <div className="mb-10 max-w-140 sm:mb-16">
          <div className="mb-2.5 text-[11px] font-bold tracking-[0.08em] text-[oklch(78%_0.19_135)] uppercase sm:mb-3.5 sm:text-[12.5px]">
            Built for how the industry actually runs events
          </div>
          <h2 className="m-0 font-(family-name:--font-unbounded) text-[28px] leading-[1.05] font-extrabold sm:text-[42px]">
            Everything you need. Nothing you don&apos;t.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-px border border-[oklch(24%_0.012_250)] bg-[oklch(24%_0.012_250)] sm:grid-cols-2">
          <div className="bg-[oklch(14%_0.012_250)] p-10">
            <h3 className="m-0 mb-2.5 font-(family-name:--font-unbounded) text-[19px] font-bold">
              Custom branding, per event
            </h3>
            <p className="m-0 text-[14.5px] leading-[1.6] text-[oklch(62%_0.012_250)]">
              Every invite carries your label&apos;s look — not a generic
              ticketing skin. Different artists, different vibes, same builder.
            </p>
          </div>
          <div className="bg-[oklch(14%_0.012_250)] p-10">
            <h3 className="m-0 mb-2.5 font-(family-name:--font-unbounded) text-[19px] font-bold">
              Guest tiers built in
            </h3>
            <p className="m-0 text-[14.5px] leading-[1.6] text-[oklch(62%_0.012_250)]">
              VIP, press, general, plus-one — assign tiers on invite and filter
              your guest list the same way.
            </p>
          </div>
          <div className="bg-[oklch(14%_0.012_250)] p-10">
            <h3 className="m-0 mb-2.5 font-(family-name:--font-unbounded) text-[19px] font-bold">
              Fast turnaround
            </h3>
            <p className="m-0 text-[14.5px] leading-[1.6] text-[oklch(62%_0.012_250)]">
              Events get booked last-minute. Go from blank invite to a live,
              shareable link in the same afternoon.
            </p>
          </div>
          <div className="bg-[oklch(14%_0.012_250)] p-10">
            <h3 className="m-0 mb-2.5 font-(family-name:--font-unbounded) text-[19px] font-bold">
              Mobile-first pages
            </h3>
            <p className="m-0 text-[14.5px] leading-[1.6] text-[oklch(62%_0.012_250)]">
              Guests open invites on their phones, always. Every page is
              designed for that screen first, desktop second.
            </p>
          </div>
        </div>
      </div>

      {/* COMPARISON */}
      <div className="border-t border-b border-[oklch(24%_0.012_250)] bg-[oklch(20%_0.012_250)] px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-180 text-center">
          <h2 className="m-0 mb-4 font-(family-name:--font-unbounded) text-[24px] leading-[1.2] font-extrabold sm:mb-5 sm:text-4xl">
            You&apos;re not running a music festival. You don&apos;t need a
            platform built for one.
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-[oklch(68%_0.012_250)] sm:text-[17px]">
            SENDIT skips the ticketing fees, the CRM modules, and the enterprise
            sales calls — and gets you a beautiful invite page for a flat
            monthly rate instead.
          </p>
        </div>
      </div>

      {/* PRICING */}
      <div
        id="pricing"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24"
      >
        <div className="mx-auto mb-10 max-w-140 text-center sm:mb-16">
          <div className="mb-2.5 text-[11px] font-bold tracking-[0.08em] text-[oklch(78%_0.19_135)] uppercase sm:mb-3.5 sm:text-[12.5px]">
            Pricing
          </div>
          <h2 className="m-0 mb-3 font-(family-name:--font-unbounded) text-[28px] leading-[1.05] font-extrabold sm:mb-4 sm:text-[42px]">
            Flat monthly plans. No per-ticket fees.
          </h2>
          <p className="m-0 text-[14px] text-[oklch(65%_0.012_250)] sm:text-base">
            No setup fees. No per-ticket charges. Cancel anytime.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[oklch(28%_0.012_250)] p-9">
            <div className="mb-2 font-(family-name:--font-unbounded) text-base font-bold">
              Starter
            </div>
            <div className="mb-1 font-(family-name:--font-unbounded) text-[38px] font-extrabold">
              $49
              <span className="text-base font-semibold text-[oklch(60%_0.012_250)]">
                /mo
              </span>
            </div>
            <div className="mb-7 text-[13.5px] text-[oklch(58%_0.012_250)]">
              Up to 3 events per month
            </div>
            <div className="mb-8 flex flex-col gap-3 text-sm text-[oklch(75%_0.012_250)]">
              <div>Core invite builder</div>
              <div>RSVP tracking</div>
              <div>Mobile-first pages</div>
            </div>
            <a
              href="#"
              className="block rounded-full border border-[oklch(40%_0.012_250)] py-3.25 text-center text-sm font-bold text-[oklch(92%_0.006_250)] hover:border-[oklch(78%_0.19_135)] hover:text-[oklch(78%_0.19_135)]"
            >
              Start free trial
            </a>
          </div>
          <div className="relative rounded-2xl border border-[oklch(78%_0.19_135)] bg-[oklch(20%_0.012_250)] p-9">
            <div className="absolute -top-3.25 left-9 rounded-full bg-[oklch(78%_0.19_135)] px-3 py-1.25 text-[11.5px] font-bold tracking-[0.03em] text-[oklch(14%_0.012_250)] uppercase">
              Most popular
            </div>
            <div className="mb-2 font-(family-name:--font-unbounded) text-base font-bold">
              Pro
            </div>
            <div className="mb-1 font-(family-name:--font-unbounded) text-[38px] font-extrabold">
              $149
              <span className="text-base font-semibold text-[oklch(60%_0.012_250)]">
                /mo
              </span>
            </div>
            <div className="mb-7 text-[13.5px] text-[oklch(58%_0.012_250)]">
              Unlimited events
            </div>
            <div className="mb-8 flex flex-col gap-3 text-sm text-[oklch(80%_0.012_250)]">
              <div>Everything in Starter</div>
              <div>Custom branding per event</div>
              <div>Guest tiers (VIP, press, plus-one)</div>
              <div>Priority support</div>
            </div>
            <a
              href="#"
              className="block rounded-full bg-[oklch(78%_0.19_135)] py-3.25 text-center text-sm font-bold text-[oklch(14%_0.012_250)] hover:bg-[oklch(88%_0.19_135)]"
            >
              Start free trial
            </a>
          </div>
          <div className="rounded-2xl border border-[oklch(28%_0.012_250)] p-9">
            <div className="mb-2 font-(family-name:--font-unbounded) text-base font-bold">
              Label / Agency
            </div>
            <div className="mb-1 font-(family-name:--font-unbounded) text-[38px] font-extrabold">
              Custom
            </div>
            <div className="mb-7 text-[13.5px] text-[oklch(58%_0.012_250)]">
              Multiple brands, one account
            </div>
            <div className="mb-8 flex flex-col gap-3 text-sm text-[oklch(75%_0.012_250)]">
              <div>Everything in Pro</div>
              <div>Multiple sub-accounts</div>
              <div>Dedicated support</div>
            </div>
            <a
              href="#"
              className="block rounded-full border border-[oklch(40%_0.012_250)] py-3.25 text-center text-sm font-bold text-[oklch(92%_0.006_250)] hover:border-[oklch(78%_0.19_135)] hover:text-[oklch(78%_0.19_135)]"
            >
              Talk to us
            </a>
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="mx-auto max-w-7xl px-8 pb-24">
        <div className="rounded-3xl bg-[oklch(78%_0.19_135)] px-12 py-20 text-center">
          <h2 className="m-0 mb-6 font-(family-name:--font-unbounded) text-[44px] leading-[1.05] font-extrabold text-[oklch(14%_0.012_250)]">
            Your next event deserves a better invite.
          </h2>
          <a
            href="/signup"
            className="inline-block rounded-full bg-[oklch(14%_0.012_250)] px-8 py-4.25 text-[15px] font-bold text-[oklch(95%_0.006_250)] hover:bg-[oklch(24%_0.012_250)]"
          >
            Get started free
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-[oklch(24%_0.012_250)] px-8 py-10">
        <div className="font-(family-name:--font-unbounded) font-extrabold">
          SENDIT
        </div>
        <div className="flex gap-7 text-[13.5px] text-[oklch(55%_0.012_250)]">
          <a href="#" className="text-[oklch(55%_0.012_250)]">
            Features
          </a>
          <a href="#pricing" className="text-[oklch(55%_0.012_250)]">
            Pricing
          </a>
          <a href="#" className="text-[oklch(55%_0.012_250)]">
            Contact
          </a>
        </div>
        <div className="text-[12.5px] text-[oklch(42%_0.012_250)]">
          © 2026 SENDIT. All rights reserved.
        </div>
      </div>
    </div>
  )
}
