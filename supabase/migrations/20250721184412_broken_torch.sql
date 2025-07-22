/*
  # Criar tabela de produtos

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, nome do produto)
      - `description` (text, descrição)
      - `price` (numeric, preço atual)
      - `original_price` (numeric, preço original para desconto)
      - `images` (text[], array de URLs das imagens)
      - `category` (text, categoria do produto)
      - `store_id` (uuid, referência à loja)
      - `rating` (numeric, avaliação média)
      - `reviews_count` (integer, número de avaliações)
      - `sales_count` (integer, número de vendas)
      - `stock_quantity` (integer, quantidade em estoque)
      - `specifications` (jsonb, especificações técnicas)
      - `free_shipping` (boolean, frete grátis)
      - `installments` (text, opções de parcelamento)
      - `is_active` (boolean, produto ativo)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policies for public read access
    - Add policies for store owners to manage their products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  images text[] DEFAULT '{}',
  category text NOT NULL,
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  rating numeric(2,1) DEFAULT 0,
  reviews_count integer DEFAULT 0,
  sales_count integer DEFAULT 0,
  stock_quantity integer DEFAULT 0,
  specifications jsonb DEFAULT '{}',
  free_shipping boolean DEFAULT false,
  installments text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Anyone can read active products"
  ON products
  FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Store owners can manage their products"
  ON products
  FOR ALL
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM stores WHERE owner_id = auth.uid()
    )
  );

-- Trigger para atualizar updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_sales ON products(sales_count DESC);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- Índice para busca de texto
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('portuguese', name || ' ' || COALESCE(description, '')));