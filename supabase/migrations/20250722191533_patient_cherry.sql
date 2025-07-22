/*
  # Create user cart table

  1. New Tables
    - `user_cart`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `product_id` (uuid, foreign key to products)
      - `quantity` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_cart` table
    - Add policies for authenticated users to manage their own cart items

  3. Indexes
    - Add index on user_id for faster queries
    - Add unique constraint on user_id + product_id to prevent duplicates
*/

CREATE TABLE IF NOT EXISTS user_cart (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE user_cart ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own cart items"
  ON user_cart
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON user_cart
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON user_cart
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON user_cart
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_cart_user_id ON user_cart(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cart_product_id ON user_cart(product_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_cart_updated_at
  BEFORE UPDATE ON user_cart
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add constraint to ensure positive quantity
ALTER TABLE user_cart ADD CONSTRAINT user_cart_quantity_check CHECK (quantity > 0);