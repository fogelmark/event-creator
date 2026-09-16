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
  USING (auth.uid() = user_id);

-- Allow users to insert their own events
CREATE POLICY "Users can insert own events" ON events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own events
CREATE POLICY "Users can update own events" ON events
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own events
CREATE POLICY "Users can delete own events" ON events
  FOR DELETE
  USING (auth.uid() = user_id);

-- Allow public read access to events via slug (for public invite pages)
CREATE POLICY "Public can view events by slug" ON events
  FOR SELECT
  USING (true);

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
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = rsvps.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Allow public to insert RSVPs (guests can RSVP without auth)
CREATE POLICY "Public can insert RSVPs" ON rsvps
  FOR INSERT
  WITH CHECK (true);

-- Allow public to update RSVPs (guests can change their RSVP)
CREATE POLICY "Public can update RSVPs" ON rsvps
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
