// ============================================================
// models/produtoModel.js — Modelo de Produtos
// ============================================================
// Funções que comunicam com a tabela "produtos" na base de dados.
// ============================================================

const { getPool } = require('../config/db');

const ProdutoModel = {

    // ----------------------------------------------------------
    // Buscar todos os produtos ativos
    // ----------------------------------------------------------
    getAll: async function () {
        const pool = await getPool();
        const resultado = await pool.request().query(`
            SELECT 
                id, 
                nome, 
                descricao, 
                preco, 
                stock, 
                imagem_url, 
                categoria
            FROM produtos 
            WHERE ativo = 1
            ORDER BY categoria, nome
        `);
        return resultado.recordset;
    },

    // ----------------------------------------------------------
    // Buscar um produto específico por ID
    // ----------------------------------------------------------
    // Exemplo: getById(3) → retorna o Kimono BJJ
    getById: async function (id) {
        const pool = await getPool();
        const resultado = await pool.request()
            .input('id', id)
            .query(`
                SELECT 
                    id, 
                    nome, 
                    descricao, 
                    preco, 
                    stock, 
                    imagem_url, 
                    categoria
                FROM produtos 
                WHERE id = @id AND ativo = 1
            `);
        // recordset[0] retorna só o primeiro resultado (ou undefined se não existir)
        return resultado.recordset[0];
    },

    // ----------------------------------------------------------
    // Buscar produtos filtrados por categoria
    // ----------------------------------------------------------
    // Exemplo: getByCategoria('Equipamento') → luvas, kimono, etc.
    getByCategoria: async function (categoria) {
        const pool = await getPool();
        const resultado = await pool.request()
            .input('categoria', categoria)
            .query(`
                SELECT 
                    id, 
                    nome, 
                    descricao, 
                    preco, 
                    stock, 
                    imagem_url, 
                    categoria
                FROM produtos 
                WHERE ativo = 1 AND categoria = @categoria
                ORDER BY nome
            `);
        return resultado.recordset;
    }
};

module.exports = ProdutoModel;
