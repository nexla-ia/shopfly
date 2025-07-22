/*
  # Fix user_cart foreign key relationship

  1. Changes
    - Add foreign key constraint between user_cart.product_id and products.id
    - Enable CASCADE delete to maintain data integrity
    - This allows proper JOIN queries between user_cart and products tables

  2. Security
    - Maintains existing RLS policies
    - No changes to permissions

  3. Notes
    - Fixes the relationship error preventing cart queries
    - Enables proper product data fetching in cart context
*/

-- Add foreign key constraint to establish relationship between user_cart and products
ALTER TABLE public.user_cart
ADD CONSTRAINT fk_user_cart_product
FOREIGN KEY (product_id)
REFERENCES public.products(id)
ON DELETE CASCADE;