/*
  # Fix user_profiles RLS policy

  1. Security Updates
    - Update RLS policy for user_profiles table to allow authenticated users to insert their own profile
    - Ensure users can only create profiles for their own user ID
    - Fix the INSERT policy that was causing registration failures

  2. Changes
    - Drop existing INSERT policy if it exists
    - Create new INSERT policy that allows authenticated users to create their own profile
    - Maintain existing SELECT and UPDATE policies
*/

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Create new INSERT policy that allows authenticated users to create their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure the table has RLS enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Verify other policies exist (SELECT and UPDATE)
DO $$
BEGIN
  -- Check if SELECT policy exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can read own profile'
  ) THEN
    CREATE POLICY "Users can read own profile"
      ON user_profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  -- Check if UPDATE policy exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON user_profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;