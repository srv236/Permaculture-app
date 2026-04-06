-- Add hidden flag to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;

-- Update the public read policy to hide suppressed users from non-admins
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (
  (is_hidden = false) OR 
  ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true)
);

-- Ensure admins can update any profile (already exists but reinforcing)
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile" ON public.profiles
FOR UPDATE TO authenticated USING (
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);