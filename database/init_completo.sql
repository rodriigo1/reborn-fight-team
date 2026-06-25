-- ============================================================
-- PAP - Reborn Fight Team
-- Script Unificado de Base de Dados
-- ============================================================
-- Este script cria a base de dados, todas as tabelas (Fase 1 a 5),
-- corrige as colunas de autenticação, insere os dados de teste e 
-- corrige os problemas de codificação.
-- ============================================================

-- 1. CRIAR A BASE DE DADOS
USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'RebornFightTeam')
BEGIN
    CREATE DATABASE RebornFightTeam;
END
GO

USE RebornFightTeam;
GO

-- ============================================================
-- 2. TABELAS BASE (Schema original + Correções)
-- ============================================================

-- Tabela: horarios
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'horarios')
BEGIN
    CREATE TABLE horarios (
        id              INT IDENTITY(1,1) PRIMARY KEY,
        modalidade      NVARCHAR(100) NOT NULL,
        dia_semana      NVARCHAR(20)  NOT NULL,
        hora_inicio     TIME          NOT NULL,
        hora_fim        TIME          NOT NULL,
        instrutor       NVARCHAR(100) NOT NULL,
        nivel           NVARCHAR(20)  NOT NULL DEFAULT 'Todos',
        ativo           BIT           NOT NULL DEFAULT 1,
        created_at      DATETIME2     NOT NULL DEFAULT GETDATE(),

        CONSTRAINT CHK_horarios_nivel CHECK (nivel IN ('Iniciante', 'Intermedio', 'Avancado', 'Todos')),
        CONSTRAINT CHK_horarios_dia CHECK (dia_semana IN ('Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'))
    );
END
GO

-- Tabela: utilizadores (Com os campos de Auth Fase 4 e Fase 5 já unificados)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'utilizadores')
BEGIN
    CREATE TABLE utilizadores (
        id                INT IDENTITY(1,1) PRIMARY KEY,
        nome              NVARCHAR(100) NOT NULL,
        email             NVARCHAR(100) NOT NULL UNIQUE,
        password_hash     NVARCHAR(255) NULL,           -- NULL para contas Google
        telefone          NVARCHAR(20)  NULL,
        data_nascimento   DATE          NULL,
        foto_perfil       NVARCHAR(255) NULL,
        role              NVARCHAR(20)  NOT NULL DEFAULT 'aluno',
        tipo              NVARCHAR(20)  DEFAULT 'cliente', -- Fixo: Código usa 'tipo'
        pontos            INT           NOT NULL DEFAULT 0,
        ativo             BIT           NOT NULL DEFAULT 1,
        email_verificado  BIT           DEFAULT 0,
        token_verificacao NVARCHAR(255) NULL,
        google_id         NVARCHAR(255) NULL,
        data_registo      DATETIME      DEFAULT GETDATE(),
        created_at        DATETIME2     NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Garantir colunas extra na tabela utilizadores (caso ela já existisse de uma run anterior)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('utilizadores') AND name = 'tipo')
BEGIN
    ALTER TABLE utilizadores ADD tipo NVARCHAR(20) DEFAULT 'cliente';
END
GO
-- Preencher a coluna 'tipo' com o valor de 'role' (SQL dinâmico para evitar erro de IntelliSense)
EXEC('UPDATE utilizadores SET tipo = role WHERE tipo IS NULL');
GO
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('utilizadores') AND name = 'password_hash' AND is_nullable = 0)
BEGIN
    ALTER TABLE utilizadores ALTER COLUMN password_hash NVARCHAR(255) NULL;
END
GO
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('utilizadores') AND name = 'email_verificado')
BEGIN
    ALTER TABLE utilizadores ADD email_verificado BIT DEFAULT 0;
END
GO
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('utilizadores') AND name = 'token_verificacao')
BEGIN
    ALTER TABLE utilizadores ADD token_verificacao NVARCHAR(255) NULL;
END
GO
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('utilizadores') AND name = 'google_id')
BEGIN
    ALTER TABLE utilizadores ADD google_id NVARCHAR(255) NULL;
END
GO

-- Tabela: produtos
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'produtos')
BEGIN
    CREATE TABLE produtos (
        id              INT IDENTITY(1,1) PRIMARY KEY,
        nome            NVARCHAR(100) NOT NULL,
        descricao       NVARCHAR(MAX) NULL,
        preco           DECIMAL(10,2) NOT NULL,
        stock           INT           NOT NULL DEFAULT 0,
        imagem_url      NVARCHAR(255) NULL,
        categoria       NVARCHAR(50)  NOT NULL,
        ativo           BIT           NOT NULL DEFAULT 1,
        created_at      DATETIME2     NOT NULL DEFAULT GETDATE()
    );
END
GO

-- ============================================================
-- 3. FASE 5 (Loja e Perfis)
-- ============================================================

-- Tabela: encomendas
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'encomendas')
BEGIN
    CREATE TABLE encomendas (
        id              INT IDENTITY(1,1) PRIMARY KEY,
        utilizador_id   INT           NOT NULL,
        total           DECIMAL(10,2) NOT NULL,
        estado          NVARCHAR(20)  NOT NULL DEFAULT 'pendente',
        morada          NVARCHAR(255) NULL,
        telefone        NVARCHAR(20)  NULL,
        created_at      DATETIME2     NOT NULL DEFAULT GETDATE(),

        CONSTRAINT FK_encomendas_utilizador FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id),
        CONSTRAINT CHK_encomendas_estado CHECK (estado IN ('pendente', 'paga', 'enviada', 'entregue', 'cancelada'))
    );
END
GO

-- Tabela: encomenda_itens
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'encomenda_itens')
BEGIN
    CREATE TABLE encomenda_itens (
        id              INT IDENTITY(1,1) PRIMARY KEY,
        encomenda_id    INT           NOT NULL,
        produto_id      INT           NOT NULL,
        quantidade      INT           NOT NULL DEFAULT 1,
        preco_unitario  DECIMAL(10,2) NOT NULL,

        CONSTRAINT FK_itens_encomenda FOREIGN KEY (encomenda_id) REFERENCES encomendas(id),
        CONSTRAINT FK_itens_produto FOREIGN KEY (produto_id) REFERENCES produtos(id)
    );
END
GO

-- Tabela: utilizador_tags
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'utilizador_tags')
BEGIN
    CREATE TABLE utilizador_tags (
        id              INT IDENTITY(1,1) PRIMARY KEY,
        utilizador_id   INT           NOT NULL,
        categoria       NVARCHAR(50)  NOT NULL,
        valor           NVARCHAR(100) NOT NULL,

        CONSTRAINT FK_tags_utilizador FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id),
        CONSTRAINT UQ_tags_unica UNIQUE (utilizador_id, categoria)
    );
END
GO

-- ============================================================
-- 4. DADOS DE EXEMPLO E CORREÇÕES DE ENCODING
-- ============================================================

-- Inserir/Resetar Horários
DELETE FROM horarios;
GO
INSERT INTO horarios (modalidade, dia_semana, hora_inicio, hora_fim, instrutor, nivel) VALUES
('Muay Thai', 'Segunda', '10:00', '11:30', 'Coach Silva',    'Todos'),
('BJJ',       'Segunda', '18:00', '19:30', 'Coach Mendes',   'Iniciante'),
('MMA',       'Segunda', '20:00', '21:30', 'Coach Ferreira', 'Avancado'),
('BJJ',       'Terca',   '10:00', '11:30', 'Coach Mendes',   'Todos'),
('Muay Thai', 'Terca',   '18:00', '19:30', 'Coach Silva',    'Intermedio'),
('MMA',       'Terca',   '20:00', '21:30', 'Coach Ferreira', 'Todos'),
('Muay Thai', 'Quarta',  '10:00', '11:30', 'Coach Silva',    'Iniciante'),
('BJJ',       'Quarta',  '18:00', '19:30', 'Coach Mendes',   'Avancado'),
('MMA',       'Quarta',  '20:00', '21:30', 'Coach Ferreira', 'Todos'),
('BJJ',       'Quinta',  '10:00', '11:30', 'Coach Mendes',   'Todos'),
('Muay Thai', 'Quinta',  '18:00', '19:30', 'Coach Silva',    'Todos'),
('MMA',       'Quinta',  '20:00', '21:30', 'Coach Ferreira', 'Intermedio'),
('Muay Thai', 'Sexta',   '10:00', '11:30', 'Coach Silva',    'Todos'),
('BJJ',       'Sexta',   '18:00', '19:30', 'Coach Mendes',   'Intermedio'),
('MMA',       'Sexta',   '20:00', '21:30', 'Coach Ferreira', 'Todos'),
('MMA',       'Sabado',  '10:00', '12:00', 'Coach Ferreira', 'Todos'),
('Muay Thai', 'Sabado',  '14:00', '15:30', 'Coach Silva',    'Todos');
GO

-- Inserir/Resetar Produtos (com N'' para forçar o Encoding UTF-16 Correto)
DELETE FROM produtos;
GO
INSERT INTO produtos (nome, descricao, preco, stock, categoria) VALUES
(N'Luvas de Muay Thai 12oz',    N'Luvas de treino em couro sintético, ideais para iniciantes e intermédios.', 49.99,  15, N'Equipamento'),
(N'Luvas de MMA',               N'Luvas de MMA com proteção nos dedos, perfeitas para sparring.',             39.99,  20, N'Equipamento'),
(N'Kimono BJJ Branco',          N'Kimono de BJJ em algodão reforçado, tamanho A2.',                          79.99,  10, N'Equipamento'),
(N'Rashguard Reborn',              N'Rashguard oficial da Reborn Fight Team. Material técnico de alta performance, ideal para treino e competição. Disponível em várias cores.', 24.99,  30, N'Roupa'),
(N'Hoodie Reborn Fight Team',   N'Hoodie oficial com logo bordado, cor preta.',                              44.99,  15, N'Roupa'),
(N'Calções de Muay Thai',       N'Calções de Muay Thai com design exclusivo Reborn.',                        34.99,  20, N'Roupa'),
(N'Caneleiras de Muay Thai',    N'Caneleiras em couro sintético com proteção extra.',                        44.99,  12, N'Proteção'),
(N'Protetor Bucal',             N'Protetor bucal moldável com estojo de transporte.',                         9.99,  50, N'Proteção'),
(N'Saco de Desporto Reborn',    N'Saco de desporto grande com compartimento para equipamento.',              39.99,  18, N'Acessórios'),
(N'Fita de Mãos (par)',         N'Fitas de mãos elásticas 4.5m para proteção durante o treino.',              7.99,  40, N'Acessórios');
GO

PRINT '✅ Base de dados e tabelas preparadas com sucesso e com os devidos encodings!';
GO

-- ============================================================
-- 5. VERIFICAÇÃO — Ver o conteúdo de todas as tabelas
-- ============================================================

SELECT '--- HORÁRIOS ---' AS Tabela;
SELECT * FROM horarios;
GO

SELECT '--- UTILIZADORES ---' AS Tabela;
SELECT * FROM utilizadores;
GO

SELECT '--- PRODUTOS ---' AS Tabela;
SELECT * FROM produtos;
GO

SELECT '--- ENCOMENDAS ---' AS Tabela;
SELECT * FROM encomendas;
GO

SELECT '--- ITENS DE ENCOMENDA ---' AS Tabela;
SELECT * FROM encomenda_itens;
GO

SELECT '--- TAGS DE UTILIZADORES ---' AS Tabela;
SELECT * FROM utilizador_tags;
GO
