// ============================================================
// routes/produtos.js — Rotas de Produtos
// ============================================================
// Define os URLs (endpoints) disponíveis para produtos.
// ============================================================

const express = require('express');
const router = express.Router();
const ProdutosController = require('../controllers/produtosController');

// GET /api/produtos                → Todos os produtos
// GET /api/produtos?categoria=Roupa → Filtrar por categoria
router.get('/', ProdutosController.listar);

// GET /api/produtos/3              → Produto com ID 3
router.get('/:id', ProdutosController.detalhe);

module.exports = router;
