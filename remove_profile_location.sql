-- Remove redundant columns from profiles table
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS address,
DROP COLUMN IF EXISTS latitude,
DROP COLUMN IF EXISTS longitude,
DROP COLUMN IF EXISTS google_maps_url,
DROP COLUMN IF EXISTS practitioner_since,
DROP COLUMN IF EXISTS farm_name,
DROP COLUMN IF EXISTS locations;