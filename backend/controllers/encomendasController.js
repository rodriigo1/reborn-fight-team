// ============================================================
// controllers/encomendasController.js — Lógica de Encomendas
// ============================================================

const encomendaModel = require('../models/encomendaModel');

// POST /api/encomendas — Criar encomenda
async function criarEncomenda(req, res) {
    try {
        const { itens, morada, telefone } = req.body;

        if (!itens || itens.length === 0) {
            return res.status(400).json({ sucesso: false, erro: 'O carrinho está vazio.' });
        }
        if (!morada) {
            return res.status(400).json({ sucesso: false, erro: 'A morada é obrigatória.' });
        }

        const encomenda = await encomendaModel.criar(req.user.id, itens, morada, telefone);

        res.status(201).json({
            sucesso: true,
            mensagem: 'Encomenda criada com sucesso!',
            encomenda,
        });
    } catch (error) {
        console.error('Erro ao criar encomenda:', error);
        res.status(500).json({ sucesso: false, erro: 'Erro ao criar encomenda.' });
    }
}

// GET /api/encomendas — Listar encomendas do utilizador
async function listarEncomendas(req, res) {
    try {
        const encomendas = await encomendaModel.listarPorUtilizador(req.user.id);
        res.json({ sucesso: true, encomendas });
    } catch (error) {
        console.error('Erro ao listar encomendas:', error);
        res.status(500).json({ sucesso: false, erro: 'Erro ao listar encomendas.' });
    }
}

// GET /api/encomendas/:id — Detalhe de uma encomenda
async function detalheEncomenda(req, res) {
    try {
        const encomenda = await encomendaModel.obterPorId(req.params.id, req.user.id);
        if (!encomenda) {
            return res.status(404).json({ sucesso: false, erro: 'Encomenda não encontrada.' });
        }
        res.json({ sucesso: true, encomenda });
    } catch (error) {
        console.error('Erro ao obter encomenda:', error);
        res.status(500).json({ sucesso: false, erro: 'Erro ao obter encomenda.' });
    }
}

module.exports = { criarEncomenda, listarEncomendas, detalheEncomenda };
