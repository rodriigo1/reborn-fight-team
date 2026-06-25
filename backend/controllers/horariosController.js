// ============================================================
// controllers/horariosController.js — Controlador de Horários
// ============================================================
// O Controller recebe os pedidos HTTP, chama o Model para
// buscar os dados, e envia a resposta ao cliente.
//
// CONCEITO IMPORTANTE: "Controller" no padrão MVC
// O Controller é o "intermediário" entre o cliente (browser/app)
// e o Model (base de dados). Ele:
// 1. Recebe o pedido (request)
// 2. Valida os parâmetros
// 3. Chama o Model
// 4. Envia a resposta (response) em formato JSON
// ============================================================

const HorarioModel = require('../models/horarioModel');

const HorariosController = {

    // ----------------------------------------------------------
    // GET /api/horarios
    // GET /api/horarios?dia=Segunda
    // GET /api/horarios?modalidade=BJJ
    // ----------------------------------------------------------
    // Lista horários com filtros opcionais via query string
    listar: async function (req, res) {
        try {
            // req.query contém os parâmetros do URL
            // Exemplo: /api/horarios?dia=Segunda → req.query.dia = 'Segunda'
            const { dia, modalidade } = req.query;

            let horarios;

            if (dia) {
                // Se o cliente enviou ?dia=Segunda, filtrar por dia
                horarios = await HorarioModel.getByDia(dia);
            } else if (modalidade) {
                // Se o cliente enviou ?modalidade=BJJ, filtrar por modalidade
                horarios = await HorarioModel.getByModalidade(modalidade);
            } else {
                // Sem filtros — retornar todos os horários
                horarios = await HorarioModel.getAll();
            }

            // Enviar resposta com sucesso (código 200)
            // O formato JSON é o padrão para APIs REST
            res.status(200).json({
                sucesso: true,
                total: horarios.length,
                dados: horarios
            });

        } catch (error) {
            // Se algo correr mal, enviar erro (código 500 = erro do servidor)
            console.error('Erro ao listar horários:', error.message);
            res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar horários. Tenta novamente mais tarde.'
            });
        }
    }
};

module.exports = HorariosController;
