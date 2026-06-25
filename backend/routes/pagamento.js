// ============================================================
// routes/pagamento.js — Rotas de Pagamento com Stripe
// ============================================================
// O Stripe Checkout cria uma sessão de pagamento segura.
// O cliente é redirecionado para a página do Stripe onde
// insere os dados do cartão. Após o pagamento, o Stripe
// redireciona de volta para o nosso site.
// ============================================================

const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const encomendaModel = require('../models/encomendaModel');

// Inicializar o Stripe com a chave secreta
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ----------------------------------------------------------
// POST /api/pagamento/criar-sessao
// Cria uma sessão de Stripe Checkout
// ----------------------------------------------------------
router.post('/criar-sessao', verificarToken, async (req, res) => {
    try {
        const { itens, morada, telefone, envio } = req.body;

        if (!itens || itens.length === 0) {
            return res.status(400).json({ sucesso: false, erro: 'O carrinho está vazio.' });
        }
        if (!morada) {
            return res.status(400).json({ sucesso: false, erro: 'A morada é obrigatória.' });
        }

        // Calcular custo de envio
        const custosEnvio = { standard: 399, expresso: 799, loja: 0 };
        const envioPreco = custosEnvio[envio] || 0;

        // Criar os line_items para o Stripe (preços em cêntimos, com IVA 23%)
        const lineItems = itens.map(item => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.nome,
                },
                unit_amount: Math.round(item.preco * 100 * 1.23), // Preço + IVA 23%
            },
            quantity: item.quantidade,
        }));

        // Adicionar custo de envio como item (se não for grátis, também com IVA)
        if (envioPreco > 0) {
            const nomeEnvio = envio === 'expresso' ? 'Entrega Expresso' : 'Entrega Standard';
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: { name: nomeEnvio },
                    unit_amount: Math.round(envioPreco * 1.23), // Envio + IVA
                },
                quantity: 1,
            });
        }

        // 1. Criar a encomenda na base de dados (estado: pendente)
        console.log("=== ITENS RECEBIDOS DO FRONTEND ===", JSON.stringify(itens, null, 2));
        const itensDB = itens.map(i => {
            let prodId = i.id;
            // Se for um ID estático do frontend, mapear para o ID correto da BD
            if (typeof prodId === 'string' && prodId.startsWith('static-')) {
                const mapa = {
                    'static-rashguard': 4,
                    'static-make-over': 51,
                    'static-calcoes': 6,
                    'static-tshirt-reborn': 51,
                    'static-unconquerable': 51,
                    'static-luvas-mma': 2,
                    'static-bucal': 8,
                    'static-caneleiras': 7
                };
                prodId = mapa[prodId] || 51;
            }
            return {
                produto_id: parseInt(prodId, 10),
                quantidade: i.quantidade,
                preco: i.preco,
            };
        });
        console.log("=== ITENS MAPEADOS PARA BD ===", JSON.stringify(itensDB, null, 2));
        const encomenda = await encomendaModel.criar(req.user.id, itensDB, morada, telefone);

        // 2. Criar a sessão de Stripe Checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems,
            customer_email: req.user.email,
            metadata: {
                encomenda_id: encomenda.id.toString(),
                utilizador_id: req.user.id.toString(),
            },
            success_url: `${process.env.FRONTEND_URL}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}&encomenda_id=${encomenda.id}`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout/cancelado?encomenda_id=${encomenda.id}`,
        });

        // 3. Guardar o session_id na encomenda
        await encomendaModel.atualizarStripeSession(encomenda.id, session.id);

        res.json({
            sucesso: true,
            url: session.url,
            sessionId: session.id,
            encomendaId: encomenda.id,
        });

    } catch (error) {
        console.error('Erro ao criar sessão Stripe:', error);
        res.status(500).json({ sucesso: false, erro: 'Erro ao processar pagamento.' });
    }
});

// ----------------------------------------------------------
// POST /api/pagamento/webhook
// Recebe notificações do Stripe sobre pagamentos
// ----------------------------------------------------------
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Se temos webhook secret, validar a assinatura
        if (process.env.STRIPE_WEBHOOK_SECRET) {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } else {
            // Em desenvolvimento, aceitar sem validação
            event = JSON.parse(req.body.toString());
        }
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Processar o evento
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const encomendaId = session.metadata?.encomenda_id;

        if (encomendaId) {
            try {
                await encomendaModel.atualizarEstado(encomendaId, 'paga');
                console.log(`✅ Encomenda #${encomendaId} marcada como paga!`);
            } catch (error) {
                console.error('Erro ao atualizar encomenda:', error);
            }
        }
    }

    res.json({ received: true });
});

// ----------------------------------------------------------
// GET /api/pagamento/verificar/:sessionId
// Verificar estado de uma sessão de pagamento
// ----------------------------------------------------------
router.get('/verificar/:sessionId', verificarToken, async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

        res.json({
            sucesso: true,
            estado: session.payment_status, // 'paid', 'unpaid', 'no_payment_required'
            encomendaId: session.metadata?.encomenda_id,
        });
    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        res.status(500).json({ sucesso: false, erro: 'Erro ao verificar pagamento.' });
    }
});

module.exports = router;
