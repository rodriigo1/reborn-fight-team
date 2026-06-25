// ============================================================
// lib/api.js — Funções para chamar a API do Backend
// ============================================================

const API_URL = 'http://localhost:3001/api';

// ----------------------------------------------------------
// Helper — headers com autenticação
// ----------------------------------------------------------
function authHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
}

// ----------------------------------------------------------
// Horários
// ----------------------------------------------------------
export async function getHorarios(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    const url = params ? `${API_URL}/horarios?${params}` : `${API_URL}/horarios`;
    const res = await fetch(url);
    const data = await res.json();
    return data.dados || [];
}

// ----------------------------------------------------------
// Produtos
// ----------------------------------------------------------
export async function getProdutos(categoria = '') {
    try {
        const url = categoria ? `${API_URL}/produtos?categoria=${encodeURIComponent(categoria)}` : `${API_URL}/produtos`;
        const res = await fetch(url);
        const data = await res.json();
        return data.dados || [];
    } catch {
        return [];
    }
}

export async function getProduto(id) {
    const res = await fetch(`${API_URL}/produtos/${id}`);
    const data = await res.json();
    return data.dados || null;
}

// ----------------------------------------------------------
// Autenticação
// ----------------------------------------------------------
export async function registar(nome, email, password) {
    const res = await fetch(`${API_URL}/auth/registo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, password }),
    });
    return res.json();
}

export async function login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return res.json();
}

export async function verificarEmail(token) {
    const res = await fetch(`${API_URL}/auth/verificar/${token}`);
    return res.json();
}

export async function getPerfil() {
    const res = await fetch(`${API_URL}/auth/perfil`, {
        headers: authHeaders(),
    });
    return res.json();
}

export const GOOGLE_LOGIN_URL = `${API_URL}/auth/google`;

// ----------------------------------------------------------
// Perfil & Tags
// ----------------------------------------------------------
export async function getPerfilCompleto() {
    const res = await fetch(`${API_URL}/perfil`, {
        headers: authHeaders(),
    });
    return res.json();
}

export async function atualizarPerfil(dados) {
    const res = await fetch(`${API_URL}/perfil`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(dados),
    });
    return res.json();
}

export async function uploadFotoPerfil(ficheiro) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const formData = new FormData();
    formData.append('foto', ficheiro);

    const res = await fetch(`${API_URL}/perfil/foto`, {
        method: 'PUT',
        headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
    });
    return res.json();
}

// ----------------------------------------------------------
// Encomendas
// ----------------------------------------------------------
export async function criarEncomenda(itens, morada, telefone) {
    const res = await fetch(`${API_URL}/encomendas`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ itens, morada, telefone }),
    });
    return res.json();
}

export async function getEncomendas() {
    const res = await fetch(`${API_URL}/encomendas`, {
        headers: authHeaders(),
    });
    return res.json();
}

export async function getEncomenda(id) {
    const res = await fetch(`${API_URL}/encomendas/${id}`, {
        headers: authHeaders(),
    });
    return res.json();
}

// ----------------------------------------------------------
// Pagamentos (Stripe)
// ----------------------------------------------------------
export async function criarSessaoPagamento(itens, morada, telefone, envio) {
    const res = await fetch(`${API_URL}/pagamento/criar-sessao`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ itens, morada, telefone, envio }),
    });
    return res.json();
}

export async function verificarPagamento(sessionId) {
    const res = await fetch(`${API_URL}/pagamento/verificar/${sessionId}`, {
        headers: authHeaders(),
    });
    return res.json();
}

