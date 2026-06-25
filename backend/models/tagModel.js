// ============================================================
// models/tagModel.js — Operações na tabela utilizador_tags
// ============================================================
// Tags estilo Discord para o perfil dos utilizadores.
// Categorias: faixa_bjj, modalidades, tempo_treino, nivel, record, papel

const { getPool } = require('../config/db');

// Tags disponíveis por categoria
const TAGS_DISPONIVEIS = {
    faixa_bjj: ['Branca', 'Azul', 'Roxa', 'Castanha', 'Preta'],
    modalidades: ['MMA', 'BJJ', 'Muay Thai'],
    tempo_treino: ['< 6 meses', '1 ano', '2 anos', '3+ anos', '5+ anos'],
    nivel: ['Recreativo', 'Amador', 'Semi-Pro', 'Profissional'],
    papel: ['Aluno', 'Instrutor'],
};

// Obter todas as tags de um utilizador
async function obterTags(utilizadorId) {
    const pool = await getPool();
    const resultado = await pool.request()
        .input('utilizador_id', utilizadorId)
        .query('SELECT categoria, valor FROM utilizador_tags WHERE utilizador_id = @utilizador_id');
    return resultado.recordset;
}

// Definir/atualizar uma tag
async function definirTag(utilizadorId, categoria, valor) {
    const pool = await getPool();

    // Verificar se a categoria é válida
    if (!TAGS_DISPONIVEIS[categoria] && categoria !== 'record') {
        throw new Error('Categoria inválida');
    }

    // Verificar se o valor é válido (exceto record que é texto livre)
    if (categoria !== 'record' && !TAGS_DISPONIVEIS[categoria].includes(valor)) {
        throw new Error('Valor inválido para esta categoria');
    }

    // MERGE — insere ou atualiza (upsert)
    await pool.request()
        .input('utilizador_id', utilizadorId)
        .input('categoria', categoria)
        .input('valor', valor)
        .query(`
            MERGE utilizador_tags AS target
            USING (SELECT @utilizador_id AS utilizador_id, @categoria AS categoria) AS source
            ON target.utilizador_id = source.utilizador_id AND target.categoria = source.categoria
            WHEN MATCHED THEN
                UPDATE SET valor = @valor
            WHEN NOT MATCHED THEN
                INSERT (utilizador_id, categoria, valor)
                VALUES (@utilizador_id, @categoria, @valor);
        `);
}

// Remover uma tag
async function removerTag(utilizadorId, categoria) {
    const pool = await getPool();
    await pool.request()
        .input('utilizador_id', utilizadorId)
        .input('categoria', categoria)
        .query('DELETE FROM utilizador_tags WHERE utilizador_id = @utilizador_id AND categoria = @categoria');
}

// Definir múltiplas tags de uma vez
async function definirMultiplasTags(utilizadorId, tags) {
    for (const tag of tags) {
        await definirTag(utilizadorId, tag.categoria, tag.valor);
    }
    return await obterTags(utilizadorId);
}

module.exports = { TAGS_DISPONIVEIS, obterTags, definirTag, removerTag, definirMultiplasTags };
