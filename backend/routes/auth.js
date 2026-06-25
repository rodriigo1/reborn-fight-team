// ============================================================
// routes/auth.js — Rotas de Autenticação
// ============================================================

const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../middleware/auth');

// Registo com email
router.post('/registo', authController.registo);

// Login com email
router.post('/login', authController.login);

// Verificar email
router.get('/verificar/:token', authController.verificarEmail);

// Perfil (rota protegida — precisa de JWT)
router.get('/perfil', verificarToken, authController.perfil);

// Login com Google — redireciona para a página de login do Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

// Callback do Google — o Google redireciona para aqui após o login
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:3000/login?erro=google' }),
    authController.googleCallback
);

module.exports = router;
