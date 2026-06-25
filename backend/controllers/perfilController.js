// ============================================================
// controllers/perfilController.js — Lógica do Perfil
// ============================================================

const utilizadorModel = require('../models/utilizadorModel');
const { getPool } = require('../config/db');

// GET /api/perfil — Obter perfil completo
async function obterPerfil(req, res) {
    try {
        const utilizador = await utilizadorModel.buscarPorId(req.user.id);
        if (!utilizador) {
            return res.status(404).json({ sucesso: false, erro: 'Utilizador não encontrado.' });
        }

        res.json({
            sucesso: true,
            perfil: utilizador,
        });
    } catch (error) {
        console.error('Erro ao obter perfil:', error);
        res.status(500).json({ sucesso: false, erro: 'Erro ao obter perfil.' });
    }
}

// PUT /api/perfil — Atualizar nome do utilizador
async function atualizarPerfil(req, res) {
    try {
        const { nome } = req.body;
        if (!nome || nome.trim().length < 2) {
            return res.status(400).json({ sucesso: false, erro: 'O nome deve ter pelo menos 2 caracteres.' });
        }

        const pool = await getPool();
        await pool.request()
            .input('id', req.user.id)
            .input('nome', nome.trim())
            .query('UPDATE utilizadores SET nome = @nome WHERE id = @id');

        res.json({ sucesso: true, mensagem: 'Perfil atualizado!' });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar perfil.' });
    }
}

// PUT /api/perfil/foto — Upload de foto de perfil
async function atualizarFoto(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ sucesso: false, erro: 'Nenhuma imagem enviada.' });
        }

        // Guardar URL da foto (relativa ao servidor)
        const fotoUrl = `/uploads/perfil/${req.file.filename}`;

        const pool = await getPool();
        await pool.request()
            .input('id', req.user.id)
            .input('foto_url', fotoUrl)
            .query('UPDATE utilizadores SET foto_url = @foto_url WHERE id = @id');

        res.json({ sucesso: true, foto_url: fotoUrl });
    } catch (error) {
        console.error('Erro ao atualizar foto:', error);
        res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar foto.' });
    }
}

module.exports = { obterPerfil, atualizarPerfil, atualizarFoto };
