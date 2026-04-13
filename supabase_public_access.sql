-- Allow public read access to profiles
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);

-- Allow public read access to farms
DROP POLICY IF EXISTS "Farms are viewable by authenticated users" ON public.farms;
CREATE POLICY "Farms are viewable by everyone" ON public.farms
FOR SELECT USING (true);

-- Allow public read access to produce
DROP POLICY IF EXISTS "Produce is viewable by authenticated users" ON public.produce;
CREATE POLICY "Produce is viewable by everyone" ON public.produce
FOR SELECT USING (true);