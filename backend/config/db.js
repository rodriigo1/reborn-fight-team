// ============================================================
// config/db.js — Ligação ao SQL Server
// ============================================================
// Este ficheiro configura a ligação à base de dados.
// Usa o pacote "mssql" com o driver "msnodesqlv8" para
// suportar Windows Authentication (Trusted Connection).
//
// CONCEITO IMPORTANTE: "Connection Pool"
// Em vez de abrir uma ligação nova cada vez que fazemos uma query,
// criamos um "pool" (conjunto) de ligações reutilizáveis.
// Isto é muito mais eficiente e rápido.
// ============================================================

// Importar o pacote mssql com o driver nativo do Windows
const sql = require('mssql/msnodesqlv8');

// Carregar variáveis de ambiente do ficheiro .env
require('dotenv').config();

// Configuração da ligação ao SQL Server
// Usa Windows Authentication (a mesma conta com que fazes login no PC)
const dbConfig = {
    // Connection string ODBC — o formato que o driver nativo entende
    // Trusted_Connection=Yes → usa as credenciais do Windows
    connectionString: `Driver={ODBC Driver 18 for SQL Server};Server=localhost\\SQLEXPRESS;Database=${process.env.DB_NAME};Trusted_Connection=Yes;TrustServerCertificate=Yes;`
};

// Variável para guardar o pool de ligações
let pool;

// Função para obter a ligação à base de dados
// Se já existe um pool, reutiliza-o. Se não, cria um novo.
async function getPool() {
    if (!pool) {
        try {
            pool = await new sql.ConnectionPool(dbConfig).connect();
            console.log('✅ Ligação ao SQL Server estabelecida com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao ligar ao SQL Server:', error.message);
            throw error;
        }
    }
    return pool;
}

// Exportar para usar noutros ficheiros
module.exports = { getPool, sql };

