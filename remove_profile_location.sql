-- Remove location and practitioner_since columns from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS address;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS latitude;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS longitude;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS google_maps_url;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS practitioner_since;