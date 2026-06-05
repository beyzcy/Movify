-- Run this in Supabase SQL Editor once before testing auth

-- 1. Enable RLS on the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Allow anyone (anon) to SELECT (needed for login: reading hashed_password)
CREATE POLICY "Public read users"
  ON public.users FOR SELECT
  USING (true);

-- 3. Allow anyone (anon) to INSERT (needed for sign-up)
CREATE POLICY "Public insert users"
  ON public.users FOR INSERT
  WITH CHECK (true);

-- 4. Grant sequence access so SERIAL user_id auto-increments on insert
GRANT USAGE ON SEQUENCE users_user_id_seq TO anon;
GRANT INSERT, SELECT ON public.users TO anon;
