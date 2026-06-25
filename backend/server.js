// ============================================================
// server.js — Ponto de Entrada do Backend
// ============================================================
// Este é o ficheiro principal que arranca o servidor.
// Aqui configuramos o Express, os middlewares e as rotas.
//
// CONCEITO IMPORTANTE: "Express"
// O Express é um framework para Node.js que facilita a criação
// de servidores web e APIs. Sem ele, teríamos de escrever
// muito mais código para lidar com pedidos HTTP.
//
// CONCEITO IMPORTANTE: "Middleware"
// Um middleware é uma função que é executada ANTES dos
// nossos endpoints. Exemplos:
// - cors() → permite que o frontend (noutra porta) aceda à API
// - express.json() → converte o body dos pedidos para JSON
// ============================================================

// Carregar variáveis de ambiente do ficheiro .env
// Isto DEVE ser a primeira coisa a fazer!
require('dotenv').config();

// Importar o Express
const express = require('express');

// Importar o CORS (Cross-Origin Resource Sharing)
// Isto permite que o frontend (porta 3000) comunique com o backend (porta 3001)
const cors = require('cors');

// Importar o Path (para servir ficheiros estáticos)
const path = require('path');

// Importar as rotas
const horariosRoutes = require('./routes/horarios');
const produtosRoutes = require('./routes/produtos');
const authRoutes = require('./routes/auth');
const encomendasRoutes = require('./routes/encomendas');
const perfilRoutes = require('./routes/perfil');
const pagamentoRoutes = require('./routes/pagamento');

// Importar a ligação à base de dados (para testar a conexão ao arrancar)
const { getPool } = require('./config/db');

// Importar Passport.js (para Login com Google)
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const utilizadorModel = require('./models/utilizadorModel');

// ============================================================
// Criar a aplicação Express
// ============================================================
const app = express();

// Definir a porta onde o servidor vai correr
// Usa a porta do .env ou 3001 por defeito
const PORT = process.env.PORT || 3001;

// ============================================================
// Configurar Middlewares
// ============================================================

// CORS — Permitir pedidos de outras origens (ex: frontend em localhost:3000)
app.use(cors());

// JSON Parser — Converter automaticamente o body dos pedidos para JSON
app.use(express.json());

// Servir ficheiros estáticos (uploads de fotos de perfil)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Passport — Inicializar (para Google OAuth)
app.use(passport.initialize());

// Configurar estratégia Google OAuth
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const utilizador = await utilizadorModel.encontrarOuCriarGoogle(profile);
            return done(null, utilizador);
        } catch (error) {
            return done(error, null);
        }
    }));
    console.log('✅ Google OAuth configurado');
} else {
    console.log('⚠️  Google OAuth não configurado (faltam GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET)');
}

// ============================================================
// Configurar Rotas
// ============================================================
// Cada rota fica organizada por recurso:
// /api/horarios → tudo sobre horários
// /api/produtos → tudo sobre produtos

app.use('/api/horarios', horariosRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/encomendas', encomendasRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/pagamento', pagamentoRoutes);

// ============================================================
// Rota de teste — para verificar se o servidor está a funcionar
// ============================================================
// Quando acederes a http://localhost:3001/ no browser,
// vais ver esta mensagem.
app.get('/', (req, res) => {
    res.json({
        mensagem: '🥊 API Reborn Fight Team está a funcionar!',
        versao: '2.0.0',
        endpoints: {
            horarios: '/api/horarios',
            produtos: '/api/produtos',
            auth: {
                registo: 'POST /api/auth/registo',
                login: 'POST /api/auth/login',
                google: 'GET /api/auth/google',
                verificar: 'GET /api/auth/verificar/:token',
                perfil: 'GET /api/auth/perfil (JWT)',
            },
        }
    });
});

// ============================================================
// Arrancar o Servidor
// ============================================================
// O servidor começa a escutar pedidos na porta definida.
// Antes de arrancar, testamos a ligação à base de dados.
async function iniciar() {
    try {
        // Testar a ligação ao SQL Server
        await getPool();

        // Se a ligação foi bem sucedida, arrancar o servidor
        app.listen(PORT, () => {
            console.log('');
            console.log('🥊 ========================================');
            console.log('   REBORN FIGHT TEAM — API Backend');
            console.log('🥊 ========================================');
            console.log(`   Servidor a correr em: http://localhost:${PORT}`);
            console.log(`   Base de dados: ${process.env.DB_NAME}`);
            console.log('');
            console.log('   Endpoints disponíveis:');
            console.log(`   • GET  /api/horarios`);
            console.log(`   • GET  /api/produtos`);
            console.log(`   • POST /api/auth/registo`);
            console.log(`   • POST /api/auth/login`);
            console.log(`   • POST /api/encomendas`);
            console.log(`   • GET  /api/perfil`);
            console.log(`   • PUT  /api/perfil/tags`);
            console.log(`   • POST /api/pagamento/criar-sessao`);
            console.log(`   • POST /api/pagamento/webhook`);
            console.log('🥊 ========================================');
            console.log('');
        });

    } catch (error) {
        console.error('❌ Não foi possível arrancar o servidor:', error.message);
        process.exit(1); // Sair com erro
    }
}

// Chamar a função para arrancar
iniciar();
