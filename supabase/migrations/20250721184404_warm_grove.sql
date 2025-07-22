/*
  # Criar tabela de lojas

  1. New Tables
    - `stores`
      - `id` (uuid, primary key)
      - `name` (text, nome da loja)
      - `description` (text, descrição)
      - `image_url` (text, logo da loja)
      - `cover_image_url` (text, imagem de capa)
      - `category` (text, categoria da loja)
      - `rating` (numeric, avaliação média)
      - `reviews_count` (integer, número de avaliações)
      - `delivery_time` (text, tempo de entrega)
      - `address` (text, endereço)
      - `phone` (text, telefone)
      - `hours` (text, horário de funcionamento)
      - `is_open` (boolean, se está aberta)
      - `owner_id` (uuid, referência ao usuário dono)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `stores` table
    - Add policies for public read access
    - Add policies for store owners to manage their stores
*/

CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  cover_image_url text,
  category text NOT NULL,
  rating numeric(2,1) DEFAULT 0,
  reviews_count integer DEFAULT 0,
  delivery_time text,
  address text,
  phone text,
  hours text,
  is_open boolean DEFAULT true,
  owner_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Anyone can read stores"
  ON stores
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Store owners can update their stores"
  ON stores
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Store owners can insert stores"
  ON stores
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_stores_category ON stores(category);
CREATE INDEX IF NOT EXISTS idx_stores_rating ON stores(rating DESC);
CREATE INDEX IF NOT EXISTS idx_stores_is_open ON stores(is_open);