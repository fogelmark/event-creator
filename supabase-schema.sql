-- Create events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  tier_label TEXT DEFAULT 'VIP + Press only',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for fast lookups
CREATE INDEX idx_events_slug ON events(slug);

-- Create index on user_id for fast lookups
CREATE INDEX idx_events_user_id ON events(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL Security;

-- Allow users to read their own events
CREATE POLICY "Users can view own events" ON events
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Allow users to insert their own events
CREATE POLICY "Users can insert own events" ON events
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Allow users to update their own events
CREATE POLICY "Users can update own events" ON events
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Allow users to delete their own events
CREATE POLICY "Users can delete own events" ON events
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Public invite pages can read safe event details without login. RLS cannot
-- enforce that a query filters by slug, so restrict anon access by column too.
CREATE POLICY "Anonymous users can view public events" ON events
  FOR SELECT
  TO anon
  USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON events TO authenticated;
REVOKE SELECT ON events FROM anon;
GRANT SELECT (
  id,
  slug,
  name,
  date,
  location,
  description,
  image_url,
  tier_label,
  created_at
) ON events TO anon;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create RSVPs table
CREATE TABLE rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('going', 'maybe', 'not_going')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, email)
);

-- Create index for fast event lookups
CREATE INDEX idx_rsvps_event_id ON rsvps(event_id);

-- Enable RLS
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Allow event owners to view RSVPs for their events
CREATE POLICY "Event owners can view RSVPs" ON rsvps
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = rsvps.event_id
      AND events.user_id = (SELECT auth.uid())
    )
  );

-- Anonymous RSVP writes are intentionally not granted directly. The scoped
-- functions in supabase-public-rsvp-migration.sql handle guest submissions.
