-- 1. Secure the profiles table: Only authenticated users can see full PII
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "profiles_read_authenticated" ON public.profiles
FOR SELECT TO authenticated USING (true);

-- 2. Secure the farms table: Only authenticated users can see exact locations
DROP POLICY IF EXISTS "Farms are viewable by everyone" ON public.farms;
CREATE POLICY "farms_read_authenticated" ON public.farms
FOR SELECT TO authenticated USING (true);

-- 3. Create a public view for profiles (Excludes: email, phone, address, lat, lng)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id, name, farm_name, picture_url, is_verified, 
  has_completed_course, about, basic_course_date, 
  advanced_course_date, practitioner_since, updated_at
FROM public.profiles;

-- 4. Create a public view for farms (Excludes: address, lat, lng, google_maps_url)
CREATE OR REPLACE VIEW public.public_farms AS
SELECT 
  id, user_id, name, size, picture_url, created_at
FROM public.farms;

-- 5. Create a combined view for the public directory to simplify frontend fetching
CREATE OR REPLACE VIEW public.public_farm_directory AS
SELECT 
  f.id, f.user_id, f.name, f.size, f.picture_url, f.created_at,
  p.name as producer_name,
  p.picture_url as producer_picture_url,
  p.is_verified as producer_is_verified
FROM public.farms f
LEFT JOIN public.profiles p ON f.user_id = p.id;

-- 6. Grant access to the views for everyone
GRANT SELECT ON public.public_profiles TO anon, authenticated;
GRANT SELECT ON public.public_farms TO anon, authenticated;
GRANT SELECT ON public.public_farm_directory TO anon, authenticated;