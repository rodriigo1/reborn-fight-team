-- ============================================================
-- PAP - Reborn Fight Team
-- Script de atualização: Autenticação (Fase 4)
-- ============================================================
-- Este script adiciona os campos necessários para:
-- 1. Verificação de email
-- 2. Login com Google
-- 3. Hash de password (bcrypt)
-- ============================================================

USE RebornFightTeam;
GO

-- Adicionar campos de autenticação à tabela utilizadores
-- Se os campos já existirem, o IF impede erros

-- Password hash (bcrypt) — pode ser NULL para contas Google
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('utilizadores') AND name = 'password_hash')
BEGIN
    ALTER TABLE utilizadores ADD password_hash NVARCHAR(255) NULL;
END
GO

-- Email verificado (0 = não, 1 = sim)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('utilizadores') AND name = 'email_verificado')
BEGIN
    ALTER TABLE utilizadores ADD email_verificado BIT DEFAULT 0;
END
GO

-- Token de verificação de email
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('utilizadores') AND name = 'token_verificacao')
BEGIN
    ALTER TABLE utilizadores ADD token_verificacao NVARCHAR(255) NULL;
END
GO

-- Google ID (para login com Google OAuth)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('utilizadores') AND name = 'google_id')
BEGIN
    ALTER TABLE utilizadores ADD google_id NVARCHAR(255) NULL;
END
GO

-- Data de registo
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('utilizadores') AND name = 'data_registo')
BEGIN
    ALTER TABLE utilizadores ADD data_registo DATETIME DEFAULT GETDATE();
END
GO

PRINT '✅ Tabela utilizadores atualizada com campos de autenticação!';
GO
