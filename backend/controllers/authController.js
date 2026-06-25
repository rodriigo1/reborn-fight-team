// ============================================================
// controllers/authController.js — Lógica de Autenticação
// ============================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const utilizadorModel = require('../models/utilizadorModel');
const { enviarEmailVerificacao } = require('../config/email');

// Gerar token JWT
function gerarToken(utilizador) {
    return jwt.sign(
        { id: utilizador.id, email: utilizador.email, role: utilizador.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Token válido por 7 dias
    );
}

// ----------------------------------------------------------
// POST /api/auth/registo — Criar conta
// ----------------------------------------------------------
async function registo(req, res) {
    try {
        const { nome, email, password } = req.body;

        // Validações
        if (!nome || !email || !password) {
            return res.status(400).json({ sucesso: false, erro: 'Preenche todos os campos.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ sucesso: false, erro: 'A password deve ter pelo menos 6 caracteres.' });
        }

        // Verificar se o email já existe
        const existente = await utilizadorModel.buscarPorEmail(email);
        if (existente) {
            return res.status(400).json({ sucesso: false, erro: 'Este email já está registado.' });
        }

        // Hash da password (bcrypt com salt de 10 rounds)
        const password_hash = await bcrypt.hash(password, 10);

        // Gerar token de verificação único
        const token_verificacao = crypto.randomBytes(32).toString('hex');

        // Criar utilizador na base de dados
        const novoUtilizador = await utilizadorModel.criar({
            nome, email, password_hash, token_verificacao,
        });

        // Enviar email de verificação
        try {
            await enviarEmailVerificacao(email, nome, token_verificacao);
        } catch (emailError) {
            console.error('Erro ao enviar email:', emailError.message);
            // Mesmo que falhe o email, a conta foi criada
        }

        res.status(201).json({
            sucesso: true,
            mensagem: 'Conta criada! Verifica o teu email para ativar a conta.',
        });
    } catch (error) {
        console.error('Erro no registo:', error);
        res.status(500).json({ sucesso: false, erro: 'Erro interno no servidor.' });
    }
}

// ----------------------------------------------------------
// POST /api/auth/login — Entrar com email e password
// ----------------------------------------------------------
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ sucesso: false, erro: 'Preenche todos os campos.' });
        }

        // Buscar utilizador
        const utilizador = await utilizadorModel.buscarPorEmail(email);
        if (!utilizador) {
            return res.status(401).json({ sucesso: false, erro: 'Email ou password incorretos.' });
        }

        // Verificar se tem password (pode ser conta Google-only)
        if (!utilizador.password_hash) {
            return res.status(401).json({ sucesso: false, erro: 'Esta conta foi criada com Google. Usa o login com Google.' });
        }

        // Verificar password
        const passwordCorreta = await bcrypt.compare(password, utilizador.password_hash);
        if (!passwordCorreta) {
            return res.status(401).json({ sucesso: false, erro: 'Email ou password incorretos.' });
        }

        // Verificar se o email foi verificado
        if (!utilizador.email_verificado) {
            return res.status(403).json({ sucesso: false, erro: 'Verifica o teu email antes de fazer login.' });
        }

        // Gerar JWT
        const token = gerarToken(utilizador);

        res.json({
            sucesso: true,
            token,
            utilizador: {
                id: utilizador.id,
                nome: utilizador.nome,
                email: utilizador.email,
                role: utilizador.role,
            },
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ sucesso: false, erro: 'Erro interno no servidor.' });
    }
}

// ----------------------------------------------------------
// GET /api/auth/verificar/:token — Verificar email
// ----------------------------------------------------------
async function verificarEmail(req, res) {
    try {
        const { token } = req.params;
        const verificado = await utilizadorModel.verificarEmail(token);

        if (verificado) {
            res.json({ sucesso: true, mensagem: 'Email verificado com sucesso! Já podes fazer login.' });
        } else {
            res.status(400).json({ sucesso: false, erro: 'Link inválido ou já utilizado.' });
        }
    } catch (error) {
        console.error('Erro na verificação:', error);
        res.status(500).json({ sucesso: false, erro: 'Erro interno no servidor.' });
    }
}

// ----------------------------------------------------------
// GET /api/auth/perfil — Dados do utilizador autenticado
// ----------------------------------------------------------
async function perfil(req, res) {
    try {
        const utilizador = await utilizadorModel.buscarPorId(req.user.id);
        if (!utilizador) {
            return res.status(404).json({ sucesso: false, erro: 'Utilizador não encontrado.' });
        }
        res.json({ sucesso: true, utilizador });
    } catch (error) {
        console.error('Erro ao obter perfil:', error);
        res.status(500).json({ sucesso: false, erro: 'Erro interno no servidor.' });
    }
}

// ----------------------------------------------------------
// Callback do Google OAuth — Gerar JWT e redirecionar
// ----------------------------------------------------------
async function googleCallback(req, res) {
    try {
        const token = gerarToken(req.user);
        // Redirecionar para o frontend com o token no URL
        res.redirect(`http://localhost:3000/login?token=${token}&nome=${encodeURIComponent(req.user.nome)}`);
    } catch (error) {
        console.error('Erro no Google callback:', error);
        res.redirect('http://localhost:3000/login?erro=google');
    }
}

module.exports = { registo, login, verificarEmail, perfil, googleCallback };
