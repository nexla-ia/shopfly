/*
  # Inserir dados de exemplo

  1. Sample Data
    - Lojas de exemplo
    - Produtos de exemplo
    - Categorias populares

  2. Notes
    - Dados realistas para testar o app
    - Imagens do Pexels
    - Preços e descrições brasileiras
*/

-- Inserir lojas de exemplo
INSERT INTO stores (id, name, description, image_url, cover_image_url, category, rating, reviews_count, delivery_time, address, phone, hours, is_open) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'TechStore Oficial', 'Sua loja de eletrônicos de confiança com os melhores produtos e atendimento especializado', 'https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800', 'Eletrônicos', 4.8, 2847, '30-45 min', 'Rua das Tecnologias, 123 - Centro, São Paulo - SP', '(11) 99999-9999', 'Seg-Sex: 8h-18h | Sáb: 8h-14h', true),

('550e8400-e29b-41d4-a716-446655440002', 'Supermercado Central', 'Produtos frescos todos os dias com a melhor qualidade e preços justos', 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://images.pexels.com/photos/4199098/pexels-photo-4199098.jpeg?auto=compress&cs=tinysrgb&w=800', 'Supermercado', 4.6, 1892, '20-30 min', 'Av. Principal, 456 - Centro, São Paulo - SP', '(11) 88888-8888', 'Seg-Dom: 7h-22h', true),

('550e8400-e29b-41d4-a716-446655440003', 'Farmácia Saúde+', 'Cuidando da sua saúde 24h com medicamentos e produtos de qualidade', 'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://images.pexels.com/photos/3683080/pexels-photo-3683080.jpeg?auto=compress&cs=tinysrgb&w=800', 'Farmácia', 4.9, 3421, '15-25 min', 'Rua da Saúde, 789 - Centro, São Paulo - SP', '(11) 77777-7777', '24 horas', true),

('550e8400-e29b-41d4-a716-446655440004', 'Moda & Estilo', 'As últimas tendências da moda com estilo e qualidade', 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=800', 'Moda', 4.7, 1567, '45-60 min', 'Shopping Center, Loja 45, São Paulo - SP', '(11) 66666-6666', 'Seg-Sáb: 10h-22h | Dom: 14h-20h', true),

('550e8400-e29b-41d4-a716-446655440005', 'Casa & Decoração', 'Transforme seu lar com móveis e decoração de qualidade', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800', 'Casa', 4.5, 892, '60-90 min', 'Rua dos Móveis, 321 - Industrial, São Paulo - SP', '(11) 55555-5555', 'Seg-Sex: 8h-18h | Sáb: 8h-14h', false);

-- Inserir produtos de eletrônicos
INSERT INTO products (id, name, description, price, original_price, images, category, store_id, rating, reviews_count, sales_count, stock_quantity, specifications, free_shipping, installments, is_active) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'iPhone 15 Pro Max 256GB Titânio Natural', 'O iPhone 15 Pro Max é o smartphone mais avançado da Apple, com chip A17 Pro, sistema de câmeras profissional e design em titânio premium. Experimente a tecnologia mais inovadora em suas mãos.', 8999.99, 9999.99, ARRAY['https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Eletrônicos', '550e8400-e29b-41d4-a716-446655440001', 4.8, 1247, 2500, 50, '{"Tela": "6.7\" Super Retina XDR OLED", "Processador": "Apple A17 Pro", "Armazenamento": "256GB", "Câmera": "Tripla 48MP + 12MP + 12MP", "Bateria": "Até 29h de reprodução de vídeo", "Sistema": "iOS 17"}', true, 'em 12x R$ 749,99 sem juros', true),

('660e8400-e29b-41d4-a716-446655440002', 'MacBook Air M2 13" 256GB Space Gray', 'MacBook Air com chip M2 da Apple oferece desempenho excepcional e eficiência energética em um design ultrafino e leve.', 7299.99, 7999.99, ARRAY['https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800'], 'Eletrônicos', '550e8400-e29b-41d4-a716-446655440001', 4.9, 892, 1800, 30, '{"Tela": "13.6\" Liquid Retina", "Processador": "Apple M2", "Memória": "8GB", "Armazenamento": "256GB SSD", "Bateria": "Até 18 horas", "Sistema": "macOS"}', true, 'em 12x R$ 608,33 sem juros', true),

('660e8400-e29b-41d4-a716-446655440003', 'Samsung Galaxy S24 Ultra 512GB Preto', 'O Galaxy S24 Ultra combina inteligência artificial avançada com câmeras profissionais e S Pen integrada.', 6799.99, 7499.99, ARRAY['https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=800'], 'Eletrônicos', '550e8400-e29b-41d4-a716-446655440001', 4.6, 1834, 1500, 25, '{"Tela": "6.8\" Dynamic AMOLED 2X", "Processador": "Snapdragon 8 Gen 3", "Memória": "12GB", "Armazenamento": "512GB", "Câmera": "Quádrupla 200MP", "Bateria": "5000mAh"}', true, 'em 12x R$ 566,66 sem juros', true);

-- Inserir produtos de supermercado
INSERT INTO products (id, name, description, price, images, category, store_id, rating, reviews_count, sales_count, stock_quantity, free_shipping, is_active) VALUES
('660e8400-e29b-41d4-a716-446655440004', 'Arroz Integral Tio João 1kg', 'Arroz integral de alta qualidade, rico em fibras e nutrientes essenciais para uma alimentação saudável.', 8.99, ARRAY['https://images.pexels.com/photos/33239/rice-grain-food-raw.jpg?auto=compress&cs=tinysrgb&w=400'], 'Supermercado', '550e8400-e29b-41d4-a716-446655440002', 4.5, 234, 1200, 500, true, true),

('660e8400-e29b-41d4-a716-446655440005', 'Feijão Preto Camil 1kg', 'Feijão preto selecionado, fonte de proteína vegetal e ferro, ideal para o dia a dia brasileiro.', 7.49, ARRAY['https://images.pexels.com/photos/4198564/pexels-photo-4198564.jpeg?auto=compress&cs=tinysrgb&w=400'], 'Supermercado', '550e8400-e29b-41d4-a716-446655440002', 4.6, 189, 980, 300, true, true);

-- Inserir produtos de farmácia
INSERT INTO products (id, name, description, price, images, category, store_id, rating, reviews_count, sales_count, stock_quantity, free_shipping, is_active) VALUES
('660e8400-e29b-41d4-a716-446655440006', 'Dipirona 500mg - 20 comprimidos', 'Analgésico e antitérmico para alívio de dores e febre. Medicamento de referência.', 12.99, ARRAY['https://images.pexels.com/photos/3683080/pexels-photo-3683080.jpeg?auto=compress&cs=tinysrgb&w=400'], 'Farmácia', '550e8400-e29b-41d4-a716-446655440003', 4.9, 567, 2100, 200, true, true),

('660e8400-e29b-41d4-a716-446655440007', 'Vitamina C 500mg - 30 cápsulas', 'Suplemento vitamínico para fortalecer o sistema imunológico e combater os radicais livres.', 24.99, ARRAY['https://images.pexels.com/photos/3683070/pexels-photo-3683070.jpeg?auto=compress&cs=tinysrgb&w=400'], 'Farmácia', '550e8400-e29b-41d4-a716-446655440003', 4.8, 312, 890, 150, true, true);

-- Inserir produtos de moda
INSERT INTO products (id, name, description, price, original_price, images, category, store_id, rating, reviews_count, sales_count, stock_quantity, free_shipping, installments, is_active) VALUES
('660e8400-e29b-41d4-a716-446655440008', 'Vestido Floral Verão Feminino', 'Vestido leve e confortável com estampa floral, perfeito para os dias quentes de verão.', 89.99, 129.99, ARRAY['https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=400'], 'Moda', '550e8400-e29b-41d4-a716-446655440004', 4.6, 267, 780, 80, true, 'em 3x R$ 29,99 sem juros', true),

('660e8400-e29b-41d4-a716-446655440009', 'Tênis Esportivo Masculino Preto', 'Tênis confortável para atividades físicas e uso casual, com tecnologia de amortecimento.', 199.99, 249.99, ARRAY['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400'], 'Moda', '550e8400-e29b-41d4-a716-446655440004', 4.5, 445, 1100, 60, true, 'em 4x R$ 49,99 sem juros', true);

-- Inserir produtos de casa
INSERT INTO products (id, name, description, price, original_price, images, category, store_id, rating, reviews_count, sales_count, stock_quantity, free_shipping, installments, is_active) VALUES
('660e8400-e29b-41d4-a716-446655440010', 'Sofá 3 Lugares Cinza Moderno', 'Sofá confortável e elegante, perfeito para sala de estar moderna. Tecido de alta qualidade.', 1299.99, 1599.99, ARRAY['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'], 'Casa', '550e8400-e29b-41d4-a716-446655440005', 4.7, 156, 340, 15, true, 'em 12x R$ 108,33 sem juros', true),

('660e8400-e29b-41d4-a716-446655440011', 'Mesa de Jantar 6 Lugares Madeira', 'Mesa de jantar em madeira maciça, comporta 6 pessoas confortavelmente. Design clássico e durável.', 899.99, 1199.99, ARRAY['https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400'], 'Casa', '550e8400-e29b-41d4-a716-446655440005', 4.4, 98, 210, 8, true, 'em 10x R$ 89,99 sem juros', true);