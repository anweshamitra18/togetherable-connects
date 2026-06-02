
-- Remove client-side INSERT on anonymous_matches; only the edge function (service role) should create matches
DROP POLICY IF EXISTS "Authenticated users can create matches" ON public.anonymous_matches;

-- Remove broad UPDATE policy on anonymous_matches; reveal level changes go through update_own_reveal_level()
DROP POLICY IF EXISTS "Users can update match status" ON public.anonymous_matches;

-- Allow participants to end (status change) their match safely via a SECURITY DEFINER function
CREATE OR REPLACE FUNCTION public.end_anonymous_match(_match_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.anonymous_matches
  SET status = 'ended', ended_at = now()
  WHERE id = _match_id
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
    AND status = 'active';
END;
$$;

GRANT EXECUTE ON FUNCTION public.end_anonymous_match(uuid) TO authenticated;
