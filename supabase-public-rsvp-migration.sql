-- Anonymous RSVP migration
--
-- Run this once in the Supabase SQL Editor after
-- supabase-organizer-rls-migration.sql. It replaces broad anonymous table
-- writes with two narrowly scoped functions.

BEGIN;

-- Guests should never be able to read the RSVP table directly. Organizers can
-- read rows through the existing owner policy; all writes go through the
-- constrained functions below.
REVOKE ALL ON public.rsvps FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.rsvps FROM authenticated;
GRANT SELECT ON public.rsvps TO authenticated;

DROP POLICY IF EXISTS "Public can insert RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Public can update RSVPs" ON public.rsvps;

CREATE OR REPLACE FUNCTION public.submit_public_rsvp(
  p_event_id uuid,
  p_name text,
  p_email text,
  p_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  normalized_name text := btrim(p_name);
  normalized_email text := lower(btrim(p_email));
BEGIN
  IF normalized_name IS NULL
    OR char_length(normalized_name) < 1
    OR char_length(normalized_name) > 120 THEN
    RAISE EXCEPTION 'Invalid name';
  END IF;

  IF normalized_email IS NULL
    OR char_length(normalized_email) > 320
    OR normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN
    RAISE EXCEPTION 'Invalid email';
  END IF;

  IF p_status IS NULL
    OR p_status NOT IN ('going', 'maybe', 'not_going') THEN
    RAISE EXCEPTION 'Invalid RSVP status';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.events
    WHERE events.id = p_event_id
  ) THEN
    RAISE EXCEPTION 'Event not found';
  END IF;

  INSERT INTO public.rsvps (event_id, name, email, status)
  VALUES (p_event_id, normalized_name, normalized_email, p_status)
  ON CONFLICT (event_id, email)
  DO UPDATE SET
    name = EXCLUDED.name,
    status = EXCLUDED.status
  -- A public form must not overwrite a personalized email invitation RSVP.
  WHERE rsvps.invite_id IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Use the personalized invitation link to update this RSVP';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_public_rsvp(uuid, text, text, text)
  FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_public_rsvp(uuid, text, text, text)
  TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_invite_rsvp(
  p_token text,
  p_status text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  matched_invite public.invites%ROWTYPE;
  event_slug text;
BEGIN
  IF p_status IS NULL
    OR p_status NOT IN ('going', 'maybe', 'not_going') THEN
    RAISE EXCEPTION 'Invalid RSVP status';
  END IF;

  SELECT invites.*
  INTO matched_invite
  FROM public.invites
  WHERE invites.token = p_token;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found';
  END IF;

  SELECT events.slug
  INTO event_slug
  FROM public.events
  WHERE events.id = matched_invite.event_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event not found';
  END IF;

  INSERT INTO public.rsvps (
    event_id,
    invite_id,
    name,
    email,
    status
  )
  VALUES (
    matched_invite.event_id,
    matched_invite.id,
    coalesce(
      nullif(btrim(matched_invite.name), ''),
      split_part(matched_invite.email, '@', 1)
    ),
    matched_invite.email,
    p_status
  )
  ON CONFLICT (event_id, email)
  DO UPDATE SET
    invite_id = EXCLUDED.invite_id,
    name = EXCLUDED.name,
    status = EXCLUDED.status;

  RETURN event_slug;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_invite_rsvp(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_invite_rsvp(text, text)
  TO anon, authenticated;

COMMIT;
