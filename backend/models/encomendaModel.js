// ============================================================
// models/encomendaModel.js — Operações na tabela encomendas
// ============================================================

const { getPool } = require('../config/db');

// Criar uma encomenda com os seus itens
async function criar(utilizadorId, itens, morada, telefone) {
    const pool = await getPool();
    
    // Calcular o total
    const total = itens.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);

    // Iniciar transação (tudo ou nada)
    const transaction = pool.transaction();
    await transaction.begin();

    try {
        // 1. Criar a encomenda
        const resultEncomenda = await transaction.request()
            .input('utilizador_id', utilizadorId)
            .input('total', total)
            .input('morada', morada)
            .input('telefone', telefone)
            .query(`
                INSERT INTO encomendas (utilizador_id, total, morada, telefone)
                OUTPUT INSERTED.id, INSERTED.total, INSERTED.estado, INSERTED.created_at
                VALUES (@utilizador_id, @total, @morada, @telefone)
            `);

        const encomenda = resultEncomenda.recordset[0];

        // 2. Inserir cada item
        for (const item of itens) {
            await transaction.request()
                .input('encomenda_id', encomenda.id)
                .input('produto_id', item.produto_id)
                .input('quantidade', item.quantidade)
                .input('preco_unitario', item.preco)
                .query(`
                    INSERT INTO encomenda_itens (encomenda_id, produto_id, quantidade, preco_unitario)
                    VALUES (@encomenda_id, @produto_id, @quantidade, @preco_unitario)
                `);

            // 3. Reduzir stock do produto
            await transaction.request()
                .input('produto_id2', item.produto_id)
                .input('quantidade2', item.quantidade)
                .query(`
                    UPDATE produtos SET stock = stock - @quantidade2 
                    WHERE id = @produto_id2 AND stock >= @quantidade2
                `);
        }

        // Confirmar transação
        await transaction.commit();
        return encomenda;

    } catch (error) {
        // Se algo falhar, desfazer tudo
        await transaction.rollback();
        throw error;
    }
}

// Listar encomendas de um utilizador
async function listarPorUtilizador(utilizadorId) {
    const pool = await getPool();
    const resultado = await pool.request()
        .input('utilizador_id', utilizadorId)
        .query(`
            SELECT e.id, e.total, e.estado, e.morada, e.created_at,
                   (SELECT COUNT(*) FROM encomenda_itens WHERE encomenda_id = e.id) as num_itens
            FROM encomendas e
            WHERE e.utilizador_id = @utilizador_id
            ORDER BY e.created_at DESC
        `);
    return resultado.recordset;
}

// Detalhe de uma encomenda (com itens)
async function obterPorId(encomendaId, utilizadorId) {
    const pool = await getPool();
    
    // Encomenda
    const resultEncomenda = await pool.request()
        .input('id', encomendaId)
        .input('utilizador_id', utilizadorId)
        .query(`
            SELECT * FROM encomendas 
            WHERE id = @id AND utilizador_id = @utilizador_id
        `);

    if (resultEncomenda.recordset.length === 0) return null;

    // Itens da encomenda
    const resultItens = await pool.request()
        .input('encomenda_id', encomendaId)
        .query(`
            SELECT ei.*, p.nome as produto_nome, p.imagem_url
            FROM encomenda_itens ei
            JOIN produtos p ON p.id = ei.produto_id
            WHERE ei.encomenda_id = @encomenda_id
        `);

    return {
        ...resultEncomenda.recordset[0],
        itens: resultItens.recordset,
    };
}

// Atualizar o stripe_session_id de uma encomenda
async function atualizarStripeSession(encomendaId, sessionId) {
    const pool = await getPool();
    await pool.request()
        .input('id', encomendaId)
        .input('stripe_session_id', sessionId)
        .query(`UPDATE encomendas SET stripe_session_id = @stripe_session_id WHERE id = @id`);
}

// Atualizar o estado de uma encomenda (ex: 'pendente' -> 'paga')
async function atualizarEstado(encomendaId, estado) {
    const pool = await getPool();
    await pool.request()
        .input('id', encomendaId)
        .input('estado', estado)
        .query(`UPDATE encomendas SET estado = @estado WHERE id = @id`);
}

module.exports = { criar, listarPorUtilizador, obterPorId, atualizarStripeSession, atualizarEstado };
