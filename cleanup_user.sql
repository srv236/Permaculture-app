-- 1. Delete all produce associated with the user
DELETE FROM public.produce 
WHERE producer_id IN (
  SELECT id FROM public.profiles WHERE email = 'mayanksingh619@gmail.com'
);

-- 2. Delete all farms associated with the user
DELETE FROM public.farms 
WHERE user_id IN (
  SELECT id FROM public.profiles WHERE email = 'mayanksingh619@gmail.com'
);

-- 3. Delete the user's profile
DELETE FROM public.profiles 
WHERE email = 'mayanksingh619@gmail.com';

-- Note: This removes the data from the public schema. 
-- To fully delete the user account, you should also delete them from the 'Authentication' tab in the Supabase dashboard.