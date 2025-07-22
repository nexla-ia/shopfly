/*
  # Criar tabelas de chat

  1. New Tables
    - `chats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, referência ao usuário)
      - `store_id` (uuid, referência à loja)
      - `last_message` (text, última mensagem)
      - `last_message_at` (timestamp, timestamp da última mensagem)
      - `unread_count` (integer, mensagens não lidas pelo usuário)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `chat_messages`
      - `id` (uuid, primary key)
      - `chat_id` (uuid, referência ao chat)
      - `sender_id` (uuid, quem enviou)
      - `message` (text, conteúdo da mensagem)
      - `message_type` (text, tipo: text/image/file)
      - `is_read` (boolean, se foi lida)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Users can only access chats they participate in
*/

-- Enum para tipos de mensagem
CREATE TYPE message_type AS ENUM ('text', 'image', 'file');

CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  last_message text,
  last_message_at timestamptz,
  unread_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, store_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  message_type message_type DEFAULT 'text',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para chats
CREATE POLICY "Users can read own chats"
  ON chats
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT owner_id FROM stores WHERE id = store_id)
  );

CREATE POLICY "Users can insert own chats"
  ON chats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats"
  ON chats
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT owner_id FROM stores WHERE id = store_id)
  );

-- Políticas para chat_messages
CREATE POLICY "Users can read chat messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (
    chat_id IN (
      SELECT id FROM chats 
      WHERE user_id = auth.uid() OR 
            store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert chat messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    chat_id IN (
      SELECT id FROM chats 
      WHERE user_id = auth.uid() OR 
            store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
    )
  );

-- Triggers
CREATE TRIGGER update_chats_updated_at
  BEFORE UPDATE ON chats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para atualizar chat quando nova mensagem é enviada
CREATE OR REPLACE FUNCTION update_chat_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chats SET
    last_message = NEW.message,
    last_message_at = NEW.created_at,
    unread_count = CASE 
      WHEN NEW.sender_id != (SELECT user_id FROM chats WHERE id = NEW.chat_id)
      THEN unread_count + 1
      ELSE unread_count
    END,
    updated_at = now()
  WHERE id = NEW.chat_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chat_on_message_trigger
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_on_message();

-- Índices
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_store_id ON chats(store_id);
CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON chat_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);