-- Fix Broken Access Control for Member-Only Data
-- This migration restricts SELECT access to the 'authenticated' role for farms, produce, and profiles.

-- 1. Restrict Farms access
DROP POLICY IF EXISTS "Farms are viewable by everyone" ON public.farms;
CREATE POLICY "Farms are viewable by authenticated users" ON public.farms
  FOR SELECT TO authenticated USING (true);

-- 2. Restrict Produce access
DROP POLICY IF EXISTS "Produce is viewable by everyone" ON public.produce;
CREATE POLICY "Produce is viewable by authenticated users" ON public.produce
  FOR SELECT TO authenticated USING (true);

-- 3. Restrict Profiles access
-- The existing policy was permissive for all; we explicitly scope it to 'authenticated'.
DROP POLICY IF EXISTS "Profiles are viewable by authenticated members" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated members" ON public.profiles
  FOR SELECT TO authenticated USING (true);