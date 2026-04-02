-- 1. Fix RLS for produce table (Public Read)
ALTER TABLE public.produce ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access for produce" ON public.produce;
CREATE POLICY "Allow public read access for produce" ON public.produce FOR SELECT USING (true);

-- 2. Fix RLS for farms table (Authenticated Read/Write, Public via RPC)
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated read access for farms" ON public.farms;
CREATE POLICY "Allow authenticated read access for farms" ON public.farms FOR SELECT TO authenticated USING (true);

-- 3. Fix RLS for profiles table (Authenticated Read/Write, Public via RPC)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated read access for profiles" ON public.profiles;
CREATE POLICY "Allow authenticated read access for profiles" ON public.profiles FOR SELECT TO authenticated USING (true);

-- 4. Create the Public Directory RPC Function
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
SECURITY DEFINER
SET search_path = public
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

-- 5. Create the Public Profiles RPC Function
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
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id, p.name, p.farm_name, p.picture_url, p.is_verified, p.about, p.practitioner_since
  FROM public.profiles p;
END;
$$;

-- 6. Grant permissions
GRANT EXECUTE ON FUNCTION public.get_public_directory() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_profiles() TO anon, authenticated;