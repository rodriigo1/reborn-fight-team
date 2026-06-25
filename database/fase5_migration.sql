-- ============================================================
-- PAP - Reborn Fight Team
-- Fase 5: Tabelas para Loja e Perfil
-- ============================================================

USE RebornFightTeam;
GO

-- ============================================================
-- 1. TABELA: encomendas
-- ============================================================
-- Guarda as encomendas feitas pelos utilizadores na loja.
-- Cada encomenda tem um total e um estado (pendente, paga, etc.)

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

        CONSTRAINT FK_encomendas_utilizador 
            FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id),
        CONSTRAINT CHK_encomendas_estado CHECK (
            estado IN ('pendente', 'paga', 'enviada', 'entregue', 'cancelada')
        )
    );
    PRINT '✅ Tabela encomendas criada';
END
GO

-- ============================================================
-- 2. TABELA: encomenda_itens
-- ============================================================
-- Cada encomenda pode ter vários produtos.
-- Guardamos o preço no momento da compra (pode mudar depois).

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'encomenda_itens')
BEGIN
    CREATE TABLE encomenda_itens (
        id              INT IDENTITY(1,1) PRIMARY KEY,
        encomenda_id    INT           NOT NULL,
        produto_id      INT           NOT NULL,
        quantidade      INT           NOT NULL DEFAULT 1,
        preco_unitario  DECIMAL(10,2) NOT NULL,

        CONSTRAINT FK_itens_encomenda 
            FOREIGN KEY (encomenda_id) REFERENCES encomendas(id),
        CONSTRAINT FK_itens_produto 
            FOREIGN KEY (produto_id) REFERENCES produtos(id)
    );
    PRINT '✅ Tabela encomenda_itens criada';
END
GO

-- ============================================================
-- 3. TABELA: utilizador_tags
-- ============================================================
-- Tags do perfil estilo Discord.
-- Cada utilizador pode ter várias tags de diferentes categorias.

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'utilizador_tags')
BEGIN
    CREATE TABLE utilizador_tags (
        id              INT IDENTITY(1,1) PRIMARY KEY,
        utilizador_id   INT           NOT NULL,
        categoria       NVARCHAR(50)  NOT NULL,
        valor           NVARCHAR(100) NOT NULL,

        CONSTRAINT FK_tags_utilizador 
            FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id),
        -- Apenas uma tag por categoria por utilizador
        CONSTRAINT UQ_tags_unica UNIQUE (utilizador_id, categoria)
    );
    PRINT '✅ Tabela utilizador_tags criada';
END
GO

PRINT '=== Fase 5: Tabelas criadas com sucesso! ===';
GO
