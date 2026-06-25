-- ============================================================
-- PAP - Reborn Fight Team
-- Fix: Corrigir tabela utilizadores para autenticação
-- ============================================================
-- A tabela original tinha 'role' mas o código usa 'tipo'.
-- A coluna password_hash era NOT NULL mas precisamos de NULL
-- para contas criadas via Google OAuth.
-- ============================================================

USE RebornFightTeam;
GO

-- 1. Adicionar coluna 'tipo' se não existe (o código usa 'tipo' em vez de 'role')
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('utilizadores') AND name = 'tipo')
BEGIN
    ALTER TABLE utilizadores ADD tipo NVARCHAR(20) DEFAULT 'cliente';
    -- Copiar valores de 'role' para 'tipo'
    UPDATE utilizadores SET tipo = role WHERE tipo IS NULL;
    PRINT '✅ Coluna tipo adicionada';
END
GO

-- 2. Tornar password_hash nullable (para contas Google que não têm password)
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('utilizadores') AND name = 'password_hash' AND is_nullable = 0)
BEGIN
    ALTER TABLE utilizadores ALTER COLUMN password_hash NVARCHAR(255) NULL;
    PRINT '✅ password_hash agora aceita NULL';
END
GO

-- 3. Garantir que email_verificado existe com default
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('utilizadores') AND name = 'email_verificado')
BEGIN
    ALTER TABLE utilizadores ADD email_verificado BIT DEFAULT 0;
    PRINT '✅ Coluna email_verificado adicionada';
END
GO

-- 4. Garantir que token_verificacao existe
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('utilizadores') AND name = 'token_verificacao')
BEGIN
    ALTER TABLE utilizadores ADD token_verificacao NVARCHAR(255) NULL;
    PRINT '✅ Coluna token_verificacao adicionada';
END
GO

-- 5. Garantir que google_id existe
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('utilizadores') AND name = 'google_id')
BEGIN
    ALTER TABLE utilizadores ADD google_id NVARCHAR(255) NULL;
    PRINT '✅ Coluna google_id adicionada';
END
GO

-- 6. Garantir que data_registo existe
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('utilizadores') AND name = 'data_registo')
BEGIN
    ALTER TABLE utilizadores ADD data_registo DATETIME DEFAULT GETDATE();
    PRINT '✅ Coluna data_registo adicionada';
END
GO

-- Verificar resultado final
PRINT '=== Colunas da tabela utilizadores ===';
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'utilizadores'
ORDER BY ORDINAL_POSITION;
GO
