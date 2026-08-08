# SENDIT - Setup Guide

## 🚀 Getting Started

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to **Settings** → **API**
3. Copy your **Project URL** and **anon/public key**
4. Go to the **SQL Editor** and run the SQL from `supabase-schema.sql` to create the events table

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

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your-blob-token
```

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

## 🎯 Next Steps

- [ ] RSVP functionality
- [ ] Event dashboard
- [ ] RSVP management
- [ ] Authentication (Supabase Auth)
- [ ] Email notifications
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
