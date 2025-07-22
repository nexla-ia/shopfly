/*
  # Criar tabela de avaliações

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `user_id` (uuid, referência ao usuário)
      - `product_id` (uuid, referência ao produto)
      - `order_id` (uuid, referência ao pedido)
      - `rating` (integer, nota de 1-5)
      - `comment` (text, comentário)
      - `images` (text[], imagens da avaliação)
      - `helpful_count` (integer, quantas pessoas acharam útil)
      - `is_verified` (boolean, compra verificada)
      - `status` (text, status da avaliação)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `review_likes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, usuário que curtiu)
      - `review_id` (uuid, avaliação curtida)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Users can read all reviews but only manage their own
*/

-- Enum para status da avaliação
CREATE TYPE review_status AS ENUM ('pending', 'published', 'rejected');

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  images text[] DEFAULT '{}',
  helpful_count integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  status review_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS review_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  review_id uuid NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, review_id)
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_likes ENABLE ROW LEVEL SECURITY;

-- Políticas para reviews
CREATE POLICY "Anyone can read published reviews"
  ON reviews
  FOR SELECT
  TO authenticated, anon
  USING (status = 'published');

CREATE POLICY "Users can read own reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para review_likes
CREATE POLICY "Users can read all review likes"
  ON review_likes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own review likes"
  ON review_likes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Triggers
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para atualizar helpful_count quando review_likes muda
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reviews 
    SET helpful_count = helpful_count + 1 
    WHERE id = NEW.review_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reviews 
    SET helpful_count = helpful_count - 1 
    WHERE id = OLD.review_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_review_helpful_count_trigger
  AFTER INSERT OR DELETE ON review_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

-- Função para atualizar rating do produto quando review muda
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE products SET
      rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM reviews 
        WHERE product_id = NEW.product_id AND status = 'published'
      ),
      reviews_count = (
        SELECT COUNT(*)
        FROM reviews 
        WHERE product_id = NEW.product_id AND status = 'published'
      )
    WHERE id = NEW.product_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE products SET
      rating = (
        SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
        FROM reviews 
        WHERE product_id = OLD.product_id AND status = 'published'
      ),
      reviews_count = (
        SELECT COUNT(*)
        FROM reviews 
        WHERE product_id = OLD.product_id AND status = 'published'
      )
    WHERE id = OLD.product_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

-- Índices
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_likes_review_id ON review_likes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_likes_user_id ON review_likes(user_id);