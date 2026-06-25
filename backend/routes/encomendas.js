// ============================================================
// routes/encomendas.js — Rotas de Encomendas
// ============================================================

const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const { criarEncomenda, listarEncomendas, detalheEncomenda } = require('../controllers/encomendasController');

// Todas as rotas de encomendas requerem autenticação
router.post('/', verificarToken, criarEncomenda);
router.get('/', verificarToken, listarEncomendas);
router.get('/:id', verificarToken, detalheEncomenda);

module.exports = router;
