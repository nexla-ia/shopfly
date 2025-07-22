/*
  # Criar tabela de notificações

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, referência ao usuário)
      - `title` (text, título da notificação)
      - `message` (text, mensagem)
      - `type` (text, tipo da notificação)
      - `data` (jsonb, dados adicionais)
      - `is_read` (boolean, se foi lida)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `notifications` table
    - Users can only access their own notifications
*/

-- Enum para tipos de notificação
CREATE TYPE notification_type AS ENUM (
  'order_confirmed',
  'order_preparing', 
  'order_ready',
  'order_delivered',
  'order_cancelled',
  'promotion',
  'review_request',
  'message',
  'general'
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type notification_type NOT NULL,
  data jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Índices
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);