// ============================================================
// controllers/produtosController.js — Controlador de Produtos
// ============================================================
// Gere os pedidos HTTP relacionados com produtos.
// ============================================================

const ProdutoModel = require('../models/produtoModel');

const ProdutosController = {

    // ----------------------------------------------------------
    // GET /api/produtos
    // GET /api/produtos?categoria=Equipamento
    // ----------------------------------------------------------
    // Lista todos os produtos ou filtra por categoria
    listar: async function (req, res) {
        try {
            const { categoria } = req.query;

            let produtos;

            if (categoria) {
                produtos = await ProdutoModel.getByCategoria(categoria);
            } else {
                produtos = await ProdutoModel.getAll();
            }

            res.status(200).json({
                sucesso: true,
                total: produtos.length,
                dados: produtos
            });

        } catch (error) {
            console.error('Erro ao listar produtos:', error.message);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar produtos. Tenta novamente mais tarde.'
            });
        }
    },

    // ----------------------------------------------------------
    // GET /api/produtos/:id
    // ----------------------------------------------------------
    // Busca um produto específico pelo seu ID
    // O ":id" é um parâmetro dinâmico no URL
    // Exemplo: /api/produtos/3 → req.params.id = 3
    detalhe: async function (req, res) {
        try {
            const { id } = req.params;

            const produto = await ProdutoModel.getById(id);

            // Se o produto não existe, retornar erro 404 (não encontrado)
            if (!produto) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Produto não encontrado.'
                });
            }

            res.status(200).json({
                sucesso: true,
                dados: produto
            });

        } catch (error) {
            console.error('Erro ao buscar produto:', error.message);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar produto. Tenta novamente mais tarde.'
            });
        }
    }
};

module.exports = ProdutosController;
