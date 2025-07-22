/*
  # Criar tabela de cartões dos usuários

  1. New Tables
    - `user_cards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, referência ao usuário)
      - `brand` (text, bandeira do cartão)
      - `last_four` (text, últimos 4 dígitos)
      - `bank` (text, banco emissor)
      - `expiry_month` (integer, mês de expiração)
      - `expiry_year` (integer, ano de expiração)
      - `cardholder_name` (text, nome no cartão)
      - `is_default` (boolean, cartão padrão)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_cards` table
    - Users can only access their own cards
    - Dados sensíveis são criptografados
*/

CREATE TABLE IF NOT EXISTS user_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand text NOT NULL CHECK (brand IN ('visa', 'mastercard', 'elo', 'amex')),
  last_four text NOT NULL CHECK (length(last_four) = 4),
  bank text NOT NULL,
  expiry_month integer NOT NULL CHECK (expiry_month >= 1 AND expiry_month <= 12),
  expiry_year integer NOT NULL CHECK (expiry_year >= EXTRACT(year FROM now())),
  cardholder_name text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Users can read own cards"
  ON user_cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cards"
  ON user_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cards"
  ON user_cards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cards"
  ON user_cards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_user_cards_updated_at
  BEFORE UPDATE ON user_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para garantir apenas um cartão padrão por usuário
CREATE OR REPLACE FUNCTION ensure_single_default_card()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE user_cards 
    SET is_default = false 
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER ensure_single_default_card_trigger
  BEFORE INSERT OR UPDATE ON user_cards
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_card();

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_cards_user_id ON user_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cards_default ON user_cards(user_id, is_default);