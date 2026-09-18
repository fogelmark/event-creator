-- Organizer RLS migration
--
-- Run this once in the Supabase SQL Editor after both schema files have been
-- applied. It makes organizer access user-scoped and lets authenticated event
-- owners manage only the invitations belonging to their own events.

BEGIN;

-- Scope event-owner policies explicitly to signed-in users. The previous
-- public SELECT policy applied to authenticated users too, effectively making
-- every event visible to every organizer.
DROP POLICY IF EXISTS "Users can view own events" ON public.events;
DROP POLICY IF EXISTS "Users can insert own events" ON public.events;
DROP POLICY IF EXISTS "Users can update own events" ON public.events;
DROP POLICY IF EXISTS "Users can delete own events" ON public.events;
DROP POLICY IF EXISTS "Public can view events by slug" ON public.events;
DROP POLICY IF EXISTS "Anonymous users can view public events" ON public.events;

CREATE POLICY "Users can view own events" ON public.events
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own events" ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own events" ON public.events
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own events" ON public.events
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Public invite pages remain readable without login. RLS cannot require a
-- caller to filter by slug, so column grants below prevent anonymous callers
-- from reading organizer IDs or future private columns.
CREATE POLICY "Anonymous users can view public events" ON public.events
  FOR SELECT
  TO anon
  USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
REVOKE SELECT ON public.events FROM anon;
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
) ON public.events TO anon;

-- Invite rows contain email addresses and bearer RSVP tokens. Anonymous
-- callers receive no direct table access; authenticated organizers are still
-- constrained by the ownership policies below.
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.invites FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.invites TO authenticated;

DROP POLICY IF EXISTS "Event owners can view invites" ON public.invites;
DROP POLICY IF EXISTS "Event owners can create invites" ON public.invites;
DROP POLICY IF EXISTS "Event owners can update invites" ON public.invites;

CREATE POLICY "Event owners can view invites" ON public.invites
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.events
      WHERE events.id = invites.event_id
        AND events.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Event owners can create invites" ON public.invites
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.events
      WHERE events.id = invites.event_id
        AND events.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Event owners can update invites" ON public.invites
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.events
      WHERE events.id = invites.event_id
        AND events.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.events
      WHERE events.id = invites.event_id
        AND events.user_id = (SELECT auth.uid())
    )
  );

-- Recreate the organizer RSVP read policy explicitly. Some existing projects
-- were initialized before this policy was added to the baseline schema.
DROP POLICY IF EXISTS "Event owners can view RSVPs" ON public.rsvps;

GRANT SELECT ON public.rsvps TO authenticated;

CREATE POLICY "Event owners can view RSVPs" ON public.rsvps
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.events
      WHERE events.id = rsvps.event_id
        AND events.user_id = (SELECT auth.uid())
    )
  );

COMMIT;
