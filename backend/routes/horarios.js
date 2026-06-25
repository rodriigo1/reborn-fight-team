// ============================================================
// routes/horarios.js — Rotas de Horários
// ============================================================
// Define os URLs (endpoints) disponíveis para horários.
//
// CONCEITO IMPORTANTE: "Router" no Express
// O Router agrupa rotas relacionadas. Isto mantém o código
// organizado — em vez de ter tudo no server.js, cada recurso
// (horários, produtos, etc.) tem o seu próprio ficheiro de rotas.
// ============================================================

const express = require('express');
const router = express.Router();
const HorariosController = require('../controllers/horariosController');

// GET /api/horarios         → Todos os horários
// GET /api/horarios?dia=Segunda → Filtrar por dia
// GET /api/horarios?modalidade=BJJ → Filtrar por modalidade
router.get('/', HorariosController.listar);

module.exports = router;
