# SENDIT - Setup Guide

## 🚀 Getting Started

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to the **SQL Editor** and run the SQL from `supabase-schema.sql` to create the events table
   - This will create the `events` table
   - **Enable Row Level Security (RLS)** on the table
   - Set up policies for public read/insert access (already included in the SQL)
3. Go to **Settings** → **API**
4. Copy your **Project URL** and **anon public (publishable) key**
   - ✅ The publishable key is safe to use in the browser because RLS is enabled
   - ⚠️ Make sure you've run the SQL schema first to enable RLS!

### 2. Set up Vercel Blob (for image uploads)

1. Deploy your project to Vercel or use Vercel CLI locally
2. Go to your project on Vercel → **Storage** → **Create Database** → **Blob**
3. Copy the `BLOB_READ_WRITE_TOKEN` from the connection strings

### 3. Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase service role — server-side only, NEVER prefix with NEXT_PUBLIC_
# Settings → API → service_role. Needed to read/write the invites table.
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your-blob-token

# Resend (invite emails)
RESEND_API_KEY=your-resend-key
# Until a domain is verified in Resend, leave RESEND_FROM unset: the sandbox
# sender only delivers to the address your Resend account is registered with.
# RESEND_FROM=SENDIT <invites@yourdomain.com>

# Base URL used to build RSVP links in emails. Auto-detected on Vercel.
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3b. Set up invites

1. Run `supabase-invites-schema.sql` in the Supabase SQL Editor (after `supabase-schema.sql`)
2. Create a free account at [resend.com](https://resend.com) and copy an API key
3. To send to real recipients, go to Resend → **Domains** → **Add Domain**, add the
   DNS records it shows you, then set `RESEND_FROM` to an address on that domain

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📋 Features Implemented

✅ Landing page with brand design
✅ Event creation form at `/create`
✅ Live preview while creating events
✅ Image upload via Vercel Blob
✅ Event storage in Supabase
✅ Public invite pages at `/i/[slug]`
✅ Responsive mobile-first design
✅ Invite lists per event, added at creation or from the dashboard
✅ Branded invite emails via Resend with one-click RSVP links

## 🎯 Next Steps

- [ ] RSVP functionality
- [ ] Event dashboard
- [ ] RSVP management
- [ ] Authentication (Supabase Auth) — **needed before invites are safe in public**
- [ ] Lock down RLS on `rsvps` (currently world-readable, world-updatable)
- [ ] Guest tiers (VIP, Press, General)

## 🗂️ Project Structure

```
app/
├── page.tsx              # Landing page
├── create/
│   └── page.tsx          # Event creation form
├── i/
│   └── [slug]/
│       └── page.tsx      # Public invite page
└── api/
    ├── events/
    │   └── route.ts      # Event CRUD API
    └── upload/
        └── route.ts      # Image upload API

components/
└── InvitePreview.tsx     # Live preview component

lib/
└── supabase.ts           # Supabase client
```
