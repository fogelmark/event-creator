export default function Home() {
  const logoPlaceholders = [
    "LABEL 01",
    "AGENCY 02",
    "MGMT CO",
    "PUBLISHER",
    "RECORDS",
    "STUDIO 09",
  ];

  return (
    <div className="w-full overflow-x-hidden font-(family-name:--font-manrope)">
      {/* NAV */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-7">
        <div className="font-(family-name:--font-unbounded) text-xl font-extrabold tracking-[0.02em]">
          SENDIT
        </div>
        <div className="flex items-center gap-9">
          <a
            href="#pricing"
            className="text-sm font-semibold text-[oklch(75%_0.01_250)]"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-sm font-semibold text-[oklch(75%_0.01_250)]"
          >
            Log in
          </a>
          <a
            href="#"
            className="rounded-full bg-[oklch(95%_0.006_250)] px-5 py-2.75 text-sm font-bold text-[oklch(14%_0.012_250)] hover:bg-[oklch(78%_0.19_135)] hover:text-[oklch(14%_0.012_250)]"
          >
            Start free trial
          </a>
        </div>
      </div>

      {/* HERO */}
      <div className="mx-auto grid max-w-7xl grid-cols-[1.1fr_0.9fr] items-center gap-16 px-8 pb-10 pt-16">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[oklch(32%_0.012_250)] px-3.5 py-1.75 text-[12.5px] font-semibold uppercase tracking-[0.03em] text-[oklch(78%_0.19_135)]">
            <span className="h-1.5 w-1.5 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-[oklch(78%_0.19_135)]"></span>
            Built for the music industry
          </div>
          <h1 className="m-0 mb-6 font-(family-name:--font-unbounded) text-[50px] font-extrabold leading-[1.08] tracking-[-0.01em]">
            Branded invites, out the door in minutes.
          </h1>
          <p className="m-0 mb-9 max-w-115 text-[19px] leading-[1.55] text-[oklch(72%_0.012_250)]">
            SENDIT is the invite builder made for labels, management companies,
            and publishers — release parties, listening sessions, showcases, VIP
            guestlists. Design it, send the link, watch the RSVPs come in.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="rounded-full bg-[oklch(78%_0.19_135)] px-7 py-4 text-[15px] font-bold text-[oklch(14%_0.012_250)] hover:bg-[oklch(88%_0.19_135)]"
            >
              Create your invite
            </a>
            <a
              href="#pricing"
              className="border-b border-[oklch(40%_0.012_250)] pb-0.5 text-[15px] font-semibold text-[oklch(90%_0.006_250)]"
            >
              See pricing →
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[20px] border border-[oklch(30%_0.012_250)] bg-[oklch(20%_0.012_250)] p-5 shadow-[0_40px_80px_-20px_oklch(5%_0_0/0.6)]">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[oklch(45%_0.01_250)]"></span>
              <span className="h-2 w-2 rounded-full bg-[oklch(45%_0.01_250)]"></span>
              <span className="h-2 w-2 rounded-full bg-[oklch(45%_0.01_250)]"></span>
              <span className="ml-2 font-mono text-[11px] text-[oklch(55%_0.01_250)]">
                sendit.co/i/nocturne-listening
              </span>
            </div>
            <div className="stripes relative flex aspect-9/13 flex-col justify-end overflow-hidden rounded-xl p-7">
              <div className="absolute inset-0 bg-linear-to-t from-[oklch(14%_0.012_250/0.92)] to-[oklch(14%_0.012_250/0.1)] to-55%"></div>
              <div className="relative z-10">
                <div className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-[oklch(78%_0.19_135)]">
                  invite preview — image drop zone
                </div>
                <div className="mb-2.5 font-(family-name:--font-unbounded) text-[30px] font-extrabold leading-[1.05]">
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
          <div className="absolute -right-4 -top-4 rotate-[4deg] rounded-lg bg-[oklch(78%_0.19_135)] px-3 py-2 font-mono text-[11.5px] font-bold text-[oklch(14%_0.012_250)]">
            142 RSVPs · 38 VIP
          </div>
        </div>
      </div>

      {/* SOCIAL PROOF */}
      <div className="mx-auto max-w-7xl border-t border-[oklch(24%_0.012_250)] px-8 py-14">
        <div className="mb-8 text-center text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[oklch(50%_0.012_250)]">
          Trusted by teams across the industry
        </div>
        <div className="flex flex-wrap justify-center gap-4">
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
        className="mx-auto max-w-7xl border-t border-[oklch(24%_0.012_250)] px-8 py-24"
      >
        <div className="mb-16 max-w-140">
          <div className="mb-3.5 text-[12.5px] font-bold uppercase tracking-[0.08em] text-[oklch(78%_0.19_135)]">
            How it works
          </div>
          <h2 className="m-0 font-(family-name:--font-unbounded) text-[42px] font-extrabold leading-[1.05]">
            From blank page to live invite before soundcheck.
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-10">
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
      <div className="mx-auto max-w-7xl border-t border-[oklch(24%_0.012_250)] px-8 py-24">
        <div className="mb-16 max-w-140">
          <div className="mb-3.5 text-[12.5px] font-bold uppercase tracking-[0.08em] text-[oklch(78%_0.19_135)]">
            Built for how the industry actually runs events
          </div>
          <h2 className="m-0 font-(family-name:--font-unbounded) text-[42px] font-extrabold leading-[1.05]">
            Everything you need. Nothing you don't.
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-px border border-[oklch(24%_0.012_250)] bg-[oklch(24%_0.012_250)]">
          <div className="bg-[oklch(14%_0.012_250)] p-10">
            <h3 className="m-0 mb-2.5 font-(family-name:--font-unbounded) text-[19px] font-bold">
              Custom branding, per event
            </h3>
            <p className="m-0 text-[14.5px] leading-[1.6] text-[oklch(62%_0.012_250)]">
              Every invite carries your label's look — not a generic ticketing
              skin. Different artists, different vibes, same builder.
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
      <div className="border-b border-t border-[oklch(24%_0.012_250)] bg-[oklch(20%_0.012_250)] px-8 py-24">
        <div className="mx-auto max-w-180 text-center">
          <h2 className="m-0 mb-5 font-(family-name:--font-unbounded) text-4xl font-extrabold leading-[1.2]">
            You're not running a music festival. You don't need a platform built
            for one.
          </h2>
          <p className="m-0 text-[17px] leading-[1.6] text-[oklch(68%_0.012_250)]">
            SENDIT skips the ticketing fees, the CRM modules, and the enterprise
            sales calls — and gets you a beautiful invite page for a flat
            monthly rate instead.
          </p>
        </div>
      </div>

      {/* PRICING */}
      <div
        id="pricing"
        className="mx-auto max-w-7xl px-8 py-24"
      >
        <div className="mx-auto mb-16 max-w-140 text-center">
          <div className="mb-3.5 text-[12.5px] font-bold uppercase tracking-[0.08em] text-[oklch(78%_0.19_135)]">
            Pricing
          </div>
          <h2 className="m-0 mb-4 font-(family-name:--font-unbounded) text-[42px] font-extrabold leading-[1.05]">
            Flat monthly plans. No per-ticket fees.
          </h2>
          <p className="m-0 text-base text-[oklch(65%_0.012_250)]">
            No setup fees. No per-ticket charges. Cancel anytime.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6">
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
            <div className="absolute -top-3.25 left-9 rounded-full bg-[oklch(78%_0.19_135)] px-3 py-1.25 text-[11.5px] font-bold uppercase tracking-[0.03em] text-[oklch(14%_0.012_250)]">
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
          <h2 className="m-0 mb-6 font-(family-name:--font-unbounded) text-[44px] font-extrabold leading-[1.05] text-[oklch(14%_0.012_250)]">
            Your next event deserves a better invite.
          </h2>
          <a
            href="#"
            className="inline-block rounded-full bg-[oklch(14%_0.012_250)] px-8 py-4.25 text-[15px] font-bold text-[oklch(95%_0.006_250)] hover:bg-[oklch(24%_0.012_250)]"
          >
            Create your invite
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-[oklch(24%_0.012_250)] px-8 py-10">
        <div className="font-(family-name:--font-unbounded) text-base font-extrabold">
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
  );
}
