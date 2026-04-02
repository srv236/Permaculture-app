-- 1. Ensure produce is viewable by everyone (it contains no PII)
DROP POLICY IF EXISTS "produce_select_public" ON public.produce;
CREATE POLICY "produce_select_public" ON public.produce
FOR SELECT USING (true);

-- 2. Create a SECURITY DEFINER function to safely expose public farm/producer data
-- This function runs with the permissions of the creator (postgres), bypassing RLS
-- but only returning the specific columns we define here.
CREATE OR REPLACE FUNCTION public.get_public_directory()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  size TEXT,
  picture_url TEXT,
  created_at TIMESTAMPTZ,
  producer_name TEXT,
  producer_picture_url TEXT,
  producer_is_verified BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER -- This is the key to fixing the 0 count for guests
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id, f.user_id, f.name, f.size, f.picture_url, f.created_at,
    p.name as producer_name,
    p.picture_url as producer_picture_url,
    p.is_verified as producer_is_verified
  FROM public.farms f
  LEFT JOIN public.profiles p ON f.user_id = p.id;
END;
$$;

-- 3. Create a function for public profiles
CREATE OR REPLACE FUNCTION public.get_public_profiles()
RETURNS TABLE (
  id UUID,
  name TEXT,
  farm_name TEXT,
  picture_url TEXT,
  is_verified BOOLEAN,
  about TEXT,
  practitioner_since DATE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id, p.name, p.farm_name, p.picture_url, p.is_verified, p.about, p.practitioner_since
  FROM public.profiles p;
END;
$$;

-- 4. Grant execution permission to everyone
GRANT EXECUTE ON FUNCTION public.get_public_directory() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_profiles() TO anon, authenticated;