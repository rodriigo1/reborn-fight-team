// ============================================================
// models/horarioModel.js — Modelo de Horários
// ============================================================
// Este ficheiro contém as funções que comunicam DIRETAMENTE
// com a base de dados para a tabela "horarios".
//
// CONCEITO IMPORTANTE: "Model" no padrão MVC
// O Model é responsável por toda a lógica de dados.
// Ele sabe como buscar, inserir, atualizar e apagar dados.
// Os Controllers chamam o Model — nunca acedem à BD diretamente.
// ============================================================

const { getPool } = require('../config/db');

const HorarioModel = {

    // ----------------------------------------------------------
    // Buscar todos os horários ativos
    // ----------------------------------------------------------
    // Retorna todos os horários onde ativo = 1 (verdadeiro)
    // Ordenados por dia da semana e hora de início
    getAll: async function () {
        const pool = await getPool();
        const resultado = await pool.request().query(`
            SELECT 
                id, 
                modalidade, 
                dia_semana, 
                CONVERT(VARCHAR(5), hora_inicio, 108) AS hora_inicio,
                CONVERT(VARCHAR(5), hora_fim, 108) AS hora_fim,
                instrutor, 
                nivel
            FROM horarios 
            WHERE ativo = 1
            ORDER BY 
                CASE dia_semana 
                    WHEN 'Segunda' THEN 1 
                    WHEN 'Terca' THEN 2 
                    WHEN 'Quarta' THEN 3 
                    WHEN 'Quinta' THEN 4 
                    WHEN 'Sexta' THEN 5 
                    WHEN 'Sabado' THEN 6 
                END, 
                hora_inicio
        `);
        return resultado.recordset;
    },

    // ----------------------------------------------------------
    // Buscar horários filtrados por dia da semana
    // ----------------------------------------------------------
    // Exemplo: getByDia('Segunda') → retorna só as aulas de segunda
    getByDia: async function (dia) {
        const pool = await getPool();
        const resultado = await pool.request()
            .input('dia', dia)  // Parâmetro seguro (previne SQL Injection)
            .query(`
                SELECT 
                    id, 
                    modalidade, 
                    dia_semana, 
                    CONVERT(VARCHAR(5), hora_inicio, 108) AS hora_inicio,
                    CONVERT(VARCHAR(5), hora_fim, 108) AS hora_fim,
                    instrutor, 
                    nivel
                FROM horarios 
                WHERE ativo = 1 AND dia_semana = @dia
                ORDER BY hora_inicio
            `);
        return resultado.recordset;
    },

    // ----------------------------------------------------------
    // Buscar horários filtrados por modalidade
    // ----------------------------------------------------------
    // Exemplo: getByModalidade('BJJ') → retorna só as aulas de BJJ
    getByModalidade: async function (modalidade) {
        const pool = await getPool();
        const resultado = await pool.request()
            .input('modalidade', modalidade)
            .query(`
                SELECT 
                    id, 
                    modalidade, 
                    dia_semana, 
                    CONVERT(VARCHAR(5), hora_inicio, 108) AS hora_inicio,
                    CONVERT(VARCHAR(5), hora_fim, 108) AS hora_fim,
                    instrutor, 
                    nivel
                FROM horarios 
                WHERE ativo = 1 AND modalidade = @modalidade
                ORDER BY 
                    CASE dia_semana 
                        WHEN 'Segunda' THEN 1 
                        WHEN 'Terca' THEN 2 
                        WHEN 'Quarta' THEN 3 
                        WHEN 'Quinta' THEN 4 
                        WHEN 'Sexta' THEN 5 
                        WHEN 'Sabado' THEN 6 
                    END, 
                    hora_inicio
            `);
        return resultado.recordset;
    }
};

module.exports = HorarioModel;
