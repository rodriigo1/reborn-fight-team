// ============================================================
// middleware/auth.js — Middleware de Autenticação JWT
// ============================================================
// Este middleware protege rotas que só utilizadores autenticados
// podem aceder. Verifica o token JWT no header "Authorization".
//
// CONCEITO IMPORTANTE: "Middleware"
// É uma função que corre ENTRE o pedido do cliente e a resposta
// do servidor. Age como um "segurança" que verifica se o
// utilizador tem permissão antes de deixar passar.
//
// CONCEITO IMPORTANTE: "JWT" (JSON Web Token)
// É um token encriptado que contém informação do utilizador
// (ex: id, email). O backend gera este token no login e o
// frontend envia-o em cada pedido para provar quem é.
// ============================================================

const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    // O token vem no header "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extrair só o token

    if (!token) {
        return res.status(401).json({
            sucesso: false,
            erro: 'Token de autenticação não fornecido. Faz login primeiro.',
        });
    }

    try {
        // Verificar se o token é válido e não expirou
        const dados = jwt.verify(token, process.env.JWT_SECRET);
        req.user = dados; // Adicionar os dados do utilizador ao pedido
        next();           // Deixar passar para a próxima função
    } catch (error) {
        return res.status(403).json({
            sucesso: false,
            erro: 'Token inválido ou expirado. Faz login novamente.',
        });
    }
}

module.exports = { verificarToken };
