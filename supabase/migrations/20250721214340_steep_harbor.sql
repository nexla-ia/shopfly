/*
  # Limpar dados de teste do banco

  1. Operações de limpeza
    - Remove todos os dados de teste das tabelas
    - Mantém a estrutura das tabelas intacta
    - Remove dados em ordem para respeitar foreign keys

  2. Tabelas afetadas
    - `review_likes` - Curtidas em avaliações
    - `reviews` - Avaliações de produtos
    - `user_favorites` - Favoritos dos usuários
    - `order_items` - Itens dos pedidos
    - `orders` - Pedidos
    - `products` - Produtos
    - `stores` - Lojas
    - `chat_messages` - Mensagens do chat
    - `chats` - Conversas
    - `notifications` - Notificações
    - `user_cards` - Cartões dos usuários
    - `user_addresses` - Endereços dos usuários
    - `user_profiles` - Perfis dos usuários (apenas dados de teste)

  3. Importante
    - Esta operação remove TODOS os dados de teste
    - Não afeta a estrutura do banco (tabelas, colunas, etc.)
    - Mantém usuários autenticados do Supabase Auth
*/

-- Remover dados em ordem para respeitar foreign keys

-- 1. Remover curtidas em avaliações
DELETE FROM review_likes;

-- 2. Remover avaliações
DELETE FROM reviews;

-- 3. Remover favoritos
DELETE FROM user_favorites;

-- 4. Remover itens dos pedidos
DELETE FROM order_items;

-- 5. Remover pedidos
DELETE FROM orders;

-- 6. Remover produtos
DELETE FROM products;

-- 7. Remover lojas
DELETE FROM stores;

-- 8. Remover mensagens do chat
DELETE FROM chat_messages;

-- 9. Remover chats
DELETE FROM chats;

-- 10. Remover notificações
DELETE FROM notifications;

-- 11. Remover cartões dos usuários
DELETE FROM user_cards;

-- 12. Remover endereços dos usuários
DELETE FROM user_addresses;

-- 13. Remover perfis de usuários (apenas dados de teste)
-- CUIDADO: Isso remove TODOS os perfis. Se houver usuários reais, comente esta linha
DELETE FROM user_profiles;

-- Resetar sequências se necessário (opcional)
-- ALTER SEQUENCE IF EXISTS products_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS stores_id_seq RESTART WITH 1;