# SENDIT - Setup Guide

## 🚀 Getting Started

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the **SQL Editor**, run these files in order:
   1. `supabase-schema.sql`
   2. `supabase-invites-schema.sql`
   3. `supabase-public-rsvp-migration.sql`
      These create the tables, enable RLS, add organizer ownership policies, and
      expose only narrowly scoped anonymous RSVP functions.
3. Go to **Settings** → **API**
4. Copy your **Project URL** and **publishable key**
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
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

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

### 3b. Set up email delivery

1. Create a free account at [resend.com](https://resend.com) and copy an API key
2. To send to real recipients, go to Resend → **Domains** → **Add Domain**, add the
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
