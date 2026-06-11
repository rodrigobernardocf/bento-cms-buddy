
-- Restrict profiles SELECT to authenticated users
DROP POLICY IF EXISTS "Profiles readable by everyone" ON public.profiles;
CREATE POLICY "Profiles readable by authenticated" ON public.profiles
  FOR SELECT TO authenticated USING (true);

-- Restrict storage object listing for media bucket to authenticated users.
-- Direct public CDN URLs (/storage/v1/object/public/media/...) still work because
-- they bypass RLS; this only blocks anonymous listing/enumeration via the API.
DROP POLICY IF EXISTS "Media read by anyone" ON storage.objects;
DROP POLICY IF EXISTS "Media public read" ON storage.objects;
CREATE POLICY "Media listing for authenticated" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'media');
