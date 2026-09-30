-- Invites schema — run this in the Supabase SQL Editor after supabase-schema.sql
--
-- NOTE ON SECURITY: this table holds email addresses and secret RSVP tokens.
-- Anonymous callers have no direct access. Authenticated organizers can access
-- invites only when they own the related event.

CREATE TABLE invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  token TEXT NOT NULL UNIQUE,
  sent_at TIMESTAMP WITH TIME ZONE,
  send_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (event_id, email)
);

CREATE INDEX idx_invites_event_id ON invites(event_id);
CREATE INDEX idx_invites_token ON invites(token);

-- Enable RLS and grant only the operations used by organizers.
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON invites FROM anon;
GRANT SELECT, INSERT, UPDATE ON invites TO authenticated;

CREATE POLICY "Event owners can view invites" ON invites
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = invites.event_id
      AND events.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Event owners can create invites" ON invites
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = invites.event_id
      AND events.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Event owners can update invites" ON invites
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = invites.event_id
      AND events.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = invites.event_id
      AND events.user_id = (SELECT auth.uid())
    )
  );

-- Link an RSVP back to the invite it came from, so the dashboard can show
-- who was invited but hasn't replied. Null for RSVPs from the public link.
ALTER TABLE rsvps
  ADD COLUMN IF NOT EXISTS invite_id UUID REFERENCES invites(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_rsvps_invite_id ON rsvps(invite_id);
