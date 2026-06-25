-- ============================================================
-- PAP - Reborn Fight Team
-- Script de criação da base de dados
-- Autor: Rodrigo
-- Data: 2026-04-26
-- Descrição: Cria a base de dados e tabelas essenciais
--            para a plataforma da academia Reborn Fight Team
-- ============================================================

-- ============================================================
-- 1. CRIAR A BASE DE DADOS
-- ============================================================
-- O "USE master" garante que estamos na base de dados principal
-- antes de criar a nossa. É uma boa prática.

USE master;
GO

-- Verificar se a base de dados já existe antes de criar
-- Isto evita erros se executarmos o script mais de uma vez
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'RebornFightTeam')
BEGIN
    CREATE DATABASE RebornFightTeam;
END
GO

-- Mudar para a nossa base de dados
USE RebornFightTeam;
GO

-- ============================================================
-- 2. TABELA: horarios
-- ============================================================
-- Guarda os horários das aulas da academia.
-- Cada linha representa uma aula num dia específico.
-- Exemplo: "Muay Thai, Segunda-feira, 18:00-19:30, Coach João"
--
-- Campos importantes:
--   modalidade  → O tipo de arte marcial (MMA, BJJ, Muay Thai)
--   dia_semana  → Dia da semana (Segunda, Terça, etc.)
--   hora_inicio → Hora de início da aula
--   hora_fim    → Hora de fim da aula
--   instrutor   → Nome do instrutor/coach
--   nivel       → Nível da aula (Iniciante, Intermédio, etc.)
--   ativo       → Se o horário está ativo (1) ou desativado (0)

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'horarios')
BEGIN
    CREATE TABLE horarios (
        id              INT IDENTITY(1,1) PRIMARY KEY,  -- ID automático (auto-incremento)
        modalidade      NVARCHAR(100) NOT NULL,          -- Nome da modalidade
        dia_semana      NVARCHAR(20)  NOT NULL,          -- Dia da semana
        hora_inicio     TIME          NOT NULL,          -- Hora de início
        hora_fim        TIME          NOT NULL,          -- Hora de fim
        instrutor       NVARCHAR(100) NOT NULL,          -- Nome do instrutor
        nivel           NVARCHAR(20)  NOT NULL           -- Nível: Iniciante, Intermédio, Avançado, Todos
                        DEFAULT 'Todos',
        ativo           BIT           NOT NULL           -- 1 = ativo, 0 = desativado
                        DEFAULT 1,
        created_at      DATETIME2     NOT NULL           -- Data de criação automática
                        DEFAULT GETDATE(),

        -- Restrição: o nível só pode ter estes valores
        CONSTRAINT CHK_horarios_nivel CHECK (
            nivel IN ('Iniciante', 'Intermedio', 'Avancado', 'Todos')
        ),
        -- Restrição: o dia da semana só pode ser um destes
        CONSTRAINT CHK_horarios_dia CHECK (
            dia_semana IN ('Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado')
        )
    );
END
GO

-- ============================================================
-- 3. TABELA: utilizadores
-- ============================================================
-- Guarda os dados dos utilizadores da plataforma.
-- Será usada na Fase 4 (Autenticação) e Fase 5 (Perfis/Pontos).
--
-- Campos importantes:
--   email         → Único, usado para login
--   password_hash → Password encriptada com bcrypt (nunca guardar em texto!)
--   role          → Tipo de utilizador (aluno, instrutor, admin)
--   pontos        → Sistema de gamificação simples (Fase 5)

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'utilizadores')
BEGIN
    CREATE TABLE utilizadores (
        id              INT IDENTITY(1,1) PRIMARY KEY,
        nome            NVARCHAR(100) NOT NULL,
        email           NVARCHAR(100) NOT NULL UNIQUE,   -- Email único para login
        password_hash   NVARCHAR(255) NOT NULL,          -- Password NUNCA em texto limpo!
        telefone        NVARCHAR(20)  NULL,               -- Opcional
        data_nascimento DATE          NULL,               -- Opcional
        foto_perfil     NVARCHAR(255) NULL,               -- URL da foto
        role            NVARCHAR(20)  NOT NULL            -- Tipo de utilizador
                        DEFAULT 'aluno',
        pontos          INT           NOT NULL            -- Pontos de gamificação
                        DEFAULT 0,
        ativo           BIT           NOT NULL
                        DEFAULT 1,
        created_at      DATETIME2     NOT NULL
                        DEFAULT GETDATE(),

        CONSTRAINT CHK_utilizadores_role CHECK (
            role IN ('aluno', 'instrutor', 'admin')
        )
    );
END
GO

-- ============================================================
-- 4. TABELA: produtos
-- ============================================================
-- Guarda os produtos da loja da academia (Fase 5).
-- Exemplos: luvas, t-shirts, proteções, etc.
--
-- Campos importantes:
--   preco     → Preço em euros (DECIMAL para evitar erros de arredondamento)
--   stock     → Quantidade disponível
--   categoria → Tipo de produto para filtros na loja

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'produtos')
BEGIN
    CREATE TABLE produtos (
        id              INT IDENTITY(1,1) PRIMARY KEY,
        nome            NVARCHAR(100) NOT NULL,
        descricao       NVARCHAR(MAX) NULL,               -- Descrição longa do produto
        preco           DECIMAL(10,2) NOT NULL,           -- Preço em euros (ex: 29.99)
        stock           INT           NOT NULL            -- Quantidade disponível
                        DEFAULT 0,
        imagem_url      NVARCHAR(255) NULL,               -- URL da imagem
        categoria       NVARCHAR(50)  NOT NULL,           -- Categoria do produto
        ativo           BIT           NOT NULL
                        DEFAULT 1,
        created_at      DATETIME2     NOT NULL
                        DEFAULT GETDATE()
    );
END
GO

-- ============================================================
-- 5. DADOS DE EXEMPLO — Horários
-- ============================================================
-- Inserir horários de exemplo para testar a API.
-- Estes dados são baseados nas modalidades da Reborn Fight Team.

-- Limpar dados anteriores (caso o script seja executado mais de uma vez)
DELETE FROM horarios;
GO

INSERT INTO horarios (modalidade, dia_semana, hora_inicio, hora_fim, instrutor, nivel) VALUES
-- Segunda-feira
('Muay Thai', 'Segunda', '10:00', '11:30', 'Coach Silva',    'Todos'),
('BJJ',       'Segunda', '18:00', '19:30', 'Coach Mendes',   'Iniciante'),
('MMA',       'Segunda', '20:00', '21:30', 'Coach Ferreira', 'Avancado'),

-- Terça-feira
('BJJ',       'Terca',   '10:00', '11:30', 'Coach Mendes',   'Todos'),
('Muay Thai', 'Terca',   '18:00', '19:30', 'Coach Silva',    'Intermedio'),
('MMA',       'Terca',   '20:00', '21:30', 'Coach Ferreira', 'Todos'),

-- Quarta-feira
('Muay Thai', 'Quarta',  '10:00', '11:30', 'Coach Silva',    'Iniciante'),
('BJJ',       'Quarta',  '18:00', '19:30', 'Coach Mendes',   'Avancado'),
('MMA',       'Quarta',  '20:00', '21:30', 'Coach Ferreira', 'Todos'),

-- Quinta-feira
('BJJ',       'Quinta',  '10:00', '11:30', 'Coach Mendes',   'Todos'),
('Muay Thai', 'Quinta',  '18:00', '19:30', 'Coach Silva',    'Todos'),
('MMA',       'Quinta',  '20:00', '21:30', 'Coach Ferreira', 'Intermedio'),

-- Sexta-feira
('Muay Thai', 'Sexta',   '10:00', '11:30', 'Coach Silva',    'Todos'),
('BJJ',       'Sexta',   '18:00', '19:30', 'Coach Mendes',   'Intermedio'),
('MMA',       'Sexta',   '20:00', '21:30', 'Coach Ferreira', 'Todos'),

-- Sábado
('MMA',       'Sabado',  '10:00', '12:00', 'Coach Ferreira', 'Todos'),
('Muay Thai', 'Sabado',  '14:00', '15:30', 'Coach Silva',    'Todos');
GO

-- ============================================================
-- 6. DADOS DE EXEMPLO — Produtos
-- ============================================================
-- Inserir produtos de exemplo para testar a loja na Fase 5.

DELETE FROM produtos;
GO

INSERT INTO produtos (nome, descricao, preco, stock, categoria) VALUES
('Luvas de Muay Thai 12oz',    'Luvas de treino em couro sintético, ideais para iniciantes e intermédios.', 49.99,  15, 'Equipamento'),
('Luvas de MMA',               'Luvas de MMA com proteção nos dedos, perfeitas para sparring.',             39.99,  20, 'Equipamento'),
('Kimono BJJ Branco',          'Kimono de BJJ em algodão reforçado, tamanho A2.',                          79.99,  10, 'Equipamento'),
('Rashguard Reborn',              'Rashguard oficial da Reborn Fight Team. Material técnico de alta performance.', 24.99,  30, 'Roupa'),
('Hoodie Reborn Fight Team',   'Hoodie oficial com logo bordado, cor preta.',                              44.99,  15, 'Roupa'),
('Calções de Muay Thai',       'Calções de Muay Thai com design exclusivo Reborn.',                        34.99,  20, 'Roupa'),
('Caneleiras de Muay Thai',    'Caneleiras em couro sintético com proteção extra.',                        44.99,  12, 'Proteção'),
('Protetor Bucal',             'Protetor bucal moldável com estojo de transporte.',                         9.99,  50, 'Proteção'),
('Saco de Desporto Reborn',    'Saco de desporto grande com compartimento para equipamento.',              39.99,  18, 'Acessórios'),
('Fita de Mãos (par)',         'Fitas de mãos elásticas 4.5m para proteção durante o treino.',              7.99,  40, 'Acessórios');
GO

-- ============================================================
-- 7. VERIFICAÇÃO — Confirmar que tudo foi criado
-- ============================================================
-- Estas queries mostram os dados inseridos para confirmar

PRINT '=== HORÁRIOS INSERIDOS ===';
SELECT id, modalidade, dia_semana, hora_inicio, hora_fim, instrutor, nivel FROM horarios ORDER BY 
    CASE dia_semana 
        WHEN 'Segunda' THEN 1 
        WHEN 'Terca' THEN 2 
        WHEN 'Quarta' THEN 3 
        WHEN 'Quinta' THEN 4 
        WHEN 'Sexta' THEN 5 
        WHEN 'Sabado' THEN 6 
    END, hora_inicio;

PRINT '=== PRODUTOS INSERIDOS ===';
SELECT id, nome, preco, stock, categoria FROM produtos ORDER BY categoria, nome;

PRINT '=== TABELAS NA BASE DE DADOS ===';
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';
GO
