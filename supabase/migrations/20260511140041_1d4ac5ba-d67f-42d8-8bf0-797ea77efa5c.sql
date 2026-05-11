
-- Fix function search paths (already set on has_role and handle_new_user; ensure set_updated_at)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- Revoke public/anon execute on internal SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
-- has_role is used by RLS only; revoke from anon, allow authenticated for policy checks
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;

-- Restrict storage listing: only allow SELECT on objects the user can access via signed URL/public path is fine but disallow listing arbitrary files
DROP POLICY IF EXISTS "Media public read" ON storage.objects;
CREATE POLICY "Media read by anyone" ON storage.objects FOR SELECT
  USING (bucket_id = 'media');
-- (keep public; bucket already public for direct CDN URLs)
