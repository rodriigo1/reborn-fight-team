-- ============================================================
-- Migração: Renomear T-Shirt para Rashguard Reborn
-- Data: 2026-06-23
-- ============================================================

USE RebornFightTeam;
GO

-- Renomear o produto "T-Shirt Reborn Fight Team" para "Rashguard Reborn"
-- e atualizar a descrição
UPDATE produtos 
SET nome = N'Rashguard Reborn',
    descricao = N'Rashguard oficial da Reborn Fight Team. Material técnico de alta performance, ideal para treino e competição. Disponível em várias cores.',
    imagem_url = N'/images/rashguard-roxo.png'
WHERE nome LIKE N'%T-Shirt Reborn%';

-- Verificar
SELECT id, nome, descricao, preco, stock, categoria, imagem_url FROM produtos WHERE nome LIKE N'%Rashguard%';
GO
