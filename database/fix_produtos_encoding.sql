-- Fix encoding issues in produtos table
UPDATE produtos SET categoria = N'Proteção' WHERE id IN (7, 8);
UPDATE produtos SET categoria = N'Acessórios' WHERE id IN (9, 10);

UPDATE produtos SET nome = N'Luvas de Muay Thai 12oz', descricao = N'Luvas de treino em couro sintético, ideais para iniciantes e intermédios.' WHERE id = 1;
UPDATE produtos SET nome = N'Luvas de MMA', descricao = N'Luvas de MMA com proteção nos dedos, perfeitas para sparring.' WHERE id = 2;
UPDATE produtos SET nome = N'Kimono BJJ Branco', descricao = N'Kimono de BJJ em algodão reforçado, tamanho A2.' WHERE id = 3;
UPDATE produtos SET nome = N'Rashguard Reborn', descricao = N'Rashguard oficial da Reborn Fight Team. Material técnico de alta performance, ideal para treino e competição. Disponível em várias cores.' WHERE id = 4;
UPDATE produtos SET nome = N'Calções de Muay Thai', descricao = N'Calções de Muay Thai com design exclusivo Reborn.' WHERE id = 6;
UPDATE produtos SET nome = N'Caneleiras de Muay Thai', descricao = N'Caneleiras em couro sintético com proteção extra.' WHERE id = 7;
UPDATE produtos SET nome = N'Protetor Bucal', descricao = N'Protetor bucal moldável com estojo de transporte.' WHERE id = 8;
UPDATE produtos SET nome = N'Saco de Desporto Reborn', descricao = N'Saco de desporto grande com compartimento para equipamento.' WHERE id = 9;
UPDATE produtos SET nome = N'Fita de Mãos (par)', descricao = N'Fitas de mãos elásticas 4.5m para proteção durante o treino.' WHERE id = 10;

SELECT id, nome, categoria, descricao FROM produtos;
