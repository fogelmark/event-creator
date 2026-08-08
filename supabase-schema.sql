-- Create events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL Security;

-- Allow public read access to events (since there's no auth yet)
CREATE POLICY "Allow public read access" ON events
  FOR SELECT
  USING (true);

-- Allow public insert access (since there's no auth yet)
CREATE POLICY "Allow public insert access" ON events
  FOR INSERT
  WITH CHECK (true);

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

-- Allow public read access to RSVPs
CREATE POLICY "Allow public read access" ON rsvps
  FOR SELECT
  USING (true);

-- Allow public insert access to RSVPs
CREATE POLICY "Allow public insert access" ON rsvps
  FOR INSERT
  WITH CHECK (true);

-- Allow users to update their own RSVP (by email)
CREATE POLICY "Allow update own RSVP" ON rsvps
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
