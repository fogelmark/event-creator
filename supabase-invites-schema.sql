-- Invites schema — run this in the Supabase SQL Editor after supabase-schema.sql
--
-- NOTE ON SECURITY: this table holds email addresses and secret RSVP tokens.
-- Anyone holding a token can RSVP as that invitee, so the anon key (which ships
-- to the browser) must never be able to read it. RLS is enabled with NO policies,
-- which denies the anon key everything. All access goes through the service role
-- key server-side — see lib/supabase-admin.ts.

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

-- Enable RLS and define no policies: denies all anon access by default.
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- Link an RSVP back to the invite it came from, so the dashboard can show
-- who was invited but hasn't replied. Null for RSVPs from the public link.
ALTER TABLE rsvps
  ADD COLUMN IF NOT EXISTS invite_id UUID REFERENCES invites(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_rsvps_invite_id ON rsvps(invite_id);
