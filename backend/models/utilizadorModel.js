// ============================================================
// models/utilizadorModel.js — Operações na tabela utilizadores
// ============================================================

const { getPool } = require('../config/db');

// Criar um novo utilizador (registo normal com email)
async function criar(dados) {
    const pool = await getPool();
    const resultado = await pool.request()
        .input('nome', dados.nome)
        .input('email', dados.email)
        .input('password_hash', dados.password_hash)
        .input('token_verificacao', dados.token_verificacao)
        .query(`
            INSERT INTO utilizadores (nome, email, password_hash, token_verificacao, email_verificado, role)
            OUTPUT INSERTED.id, INSERTED.nome, INSERTED.email, INSERTED.role, INSERTED.email_verificado
            VALUES (@nome, @email, @password_hash, @token_verificacao, 0, 'aluno')
        `);
    return resultado.recordset[0];
}

// Buscar utilizador por email
async function buscarPorEmail(email) {
    const pool = await getPool();
    const resultado = await pool.request()
        .input('email', email)
        .query('SELECT * FROM utilizadores WHERE email = @email');
    return resultado.recordset[0];
}

// Buscar utilizador por ID
async function buscarPorId(id) {
    const pool = await getPool();
    const resultado = await pool.request()
        .input('id', id)
        .query('SELECT id, nome, email, role, email_verificado, google_id, foto_url, data_registo FROM utilizadores WHERE id = @id');
    return resultado.recordset[0];
}

// Verificar email (ativar conta)
async function verificarEmail(token) {
    const pool = await getPool();
    const resultado = await pool.request()
        .input('token', token)
        .query(`
            UPDATE utilizadores 
            SET email_verificado = 1, token_verificacao = NULL 
            WHERE token_verificacao = @token
            AND email_verificado = 0;
            
            SELECT id, nome, email, role FROM utilizadores 
            WHERE token_verificacao IS NULL 
            AND email_verificado = 1
            AND id = (SELECT id FROM utilizadores WHERE email_verificado = 1 ORDER BY data_registo DESC OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY);
        `);
    return resultado.rowsAffected[0] > 0;
}

// Criar ou encontrar utilizador via Google OAuth
async function encontrarOuCriarGoogle(perfil) {
    const pool = await getPool();
    
    // Primeiro, tentar encontrar por google_id
    let resultado = await pool.request()
        .input('google_id', perfil.id)
        .query('SELECT * FROM utilizadores WHERE google_id = @google_id');
    
    if (resultado.recordset.length > 0) {
        // Atualizar foto do Google se mudou
        const fotoGoogle = perfil.photos?.[0]?.value || null;
        if (fotoGoogle) {
            await pool.request()
                .input('google_id2', perfil.id)
                .input('foto_url', fotoGoogle)
                .query('UPDATE utilizadores SET foto_url = @foto_url WHERE google_id = @google_id2 AND (foto_url IS NULL OR foto_url LIKE \'https://lh3.googleusercontent%\')');
        }
        resultado.recordset[0].foto_url = fotoGoogle || resultado.recordset[0].foto_url;
        return resultado.recordset[0];
    }

    // Se não encontrou, tentar por email (pode já ter conta normal)
    resultado = await pool.request()
        .input('email', perfil.emails[0].value)
        .query('SELECT * FROM utilizadores WHERE email = @email');
    
    if (resultado.recordset.length > 0) {
        // Associar Google ID e foto à conta existente
        const fotoGoogle = perfil.photos?.[0]?.value || null;
        await pool.request()
            .input('google_id', perfil.id)
            .input('email', perfil.emails[0].value)
            .input('foto_url', fotoGoogle)
            .query('UPDATE utilizadores SET google_id = @google_id, email_verificado = 1, foto_url = COALESCE(foto_url, @foto_url) WHERE email = @email');
        
        resultado = await pool.request()
            .input('email', perfil.emails[0].value)
            .query('SELECT * FROM utilizadores WHERE email = @email');
        return resultado.recordset[0];
    }

    // Criar novo utilizador via Google (sem password, email já verificado)
    const fotoGoogle = perfil.photos?.[0]?.value || null;
    resultado = await pool.request()
        .input('nome', perfil.displayName)
        .input('email', perfil.emails[0].value)
        .input('google_id', perfil.id)
        .input('foto_url', fotoGoogle)
        .query(`
            INSERT INTO utilizadores (nome, email, google_id, email_verificado, role, foto_url)
            OUTPUT INSERTED.id, INSERTED.nome, INSERTED.email, INSERTED.role, INSERTED.email_verificado, INSERTED.foto_url
            VALUES (@nome, @email, @google_id, 1, 'aluno', @foto_url)
        `);
    return resultado.recordset[0];
}

module.exports = { criar, buscarPorEmail, buscarPorId, verificarEmail, encontrarOuCriarGoogle };
