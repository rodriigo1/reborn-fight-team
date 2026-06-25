'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getPerfilCompleto, getEncomendas, atualizarPerfil, uploadFotoPerfil } from '../../lib/api';
import { useAuth } from '../../components/AuthProvider';

const BACKEND_URL = 'http://localhost:3001';

export default function PerfilPage() {
    const { utilizador, atualizarFotoNavbar } = useAuth();
    const [perfil, setPerfil] = useState(null);
    const [encomendas, setEncomendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editarNome, setEditarNome] = useState(false);
    const [novoNome, setNovoNome] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [uploadingFoto, setUploadingFoto] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!utilizador) return;
        async function carregar() {
            setLoading(true);
            const [perfilRes, encomendasRes] = await Promise.all([
                getPerfilCompleto(),
                getEncomendas(),
            ]);
            if (perfilRes.sucesso) {
                setPerfil(perfilRes.perfil);
                setNovoNome(perfilRes.perfil.nome);
            }
            if (encomendasRes.sucesso) setEncomendas(encomendasRes.encomendas);
            setLoading(false);
        }
        carregar();
    }, [utilizador]);

    async function salvarNome() {
        setSalvando(true);
        const res = await atualizarPerfil({ nome: novoNome });
        if (res.sucesso) {
            setPerfil(prev => ({ ...prev, nome: novoNome }));
            setEditarNome(false);
        }
        setSalvando(false);
    }

    async function handleFotoUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingFoto(true);
        try {
            const res = await uploadFotoPerfil(file);
            if (res.sucesso) {
                setPerfil(prev => ({ ...prev, foto_url: res.foto_url }));
                atualizarFotoNavbar(res.foto_url);
            }
        } catch (err) {
            console.error('Erro ao fazer upload:', err);
        }
        setUploadingFoto(false);
        // Limpar input para permitir selecionar o mesmo ficheiro
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    function getFotoUrl() {
        if (!perfil?.foto_url) return null;
        // Se é URL externa (Google), usar diretamente
        if (perfil.foto_url.startsWith('http')) return perfil.foto_url;
        // Se é upload local, prefixar com URL do backend
        return `${BACKEND_URL}${perfil.foto_url}`;
    }

    if (!utilizador) {
        return (
            <>
                <section className="page-header"><div className="container"><h1>PERFIL</h1></div></section>
                <section className="section-light" style={{ padding: '80px 0', textAlign: 'center' }}>
                    <div className="container">
                        <h2 style={{ color: '#1a1a1a' }}>Precisas de fazer login</h2>
                        <p style={{ color: '#666', margin: '15px 0 30px' }}>Faz login para ver o teu perfil.</p>
                        <Link href="/login" className="btn btn-primary">Entrar</Link>
                    </div>
                </section>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <section className="page-header"><div className="container"><h1>PERFIL</h1></div></section>
                <section className="section-light" style={{ padding: '80px 0' }}>
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>A carregar perfil...</p>
                    </div>
                </section>
            </>
        );
    }

    const fotoUrl = getFotoUrl();

    return (
        <>
            <section className="page-header">
                <div className="container">
                    <h1>O MEU <span className="text-accent">PERFIL</span></h1>
                </div>
            </section>

            <section className="section-light" style={{ paddingBottom: '80px' }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>

                    {/* Card do Perfil */}
                    <div className="perfil-card">
                        <div
                            className="perfil-avatar perfil-avatar-clicavel"
                            onClick={() => fileInputRef.current?.click()}
                            title="Clica para mudar a foto"
                        >
                            {uploadingFoto ? (
                                <div className="perfil-avatar-loading">
                                    <div className="loading-spinner" style={{ width: 28, height: 28 }}></div>
                                </div>
                            ) : fotoUrl ? (
                                <img src={fotoUrl} alt="Foto de perfil" className="perfil-avatar-img" />
                            ) : (
                                perfil?.nome?.charAt(0).toUpperCase()
                            )}
                            <div className="perfil-avatar-overlay">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                    <circle cx="12" cy="13" r="4"/>
                                </svg>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFotoUpload}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <div className="perfil-dados">
                            {editarNome ? (
                                <div className="perfil-editar-nome">
                                    <input
                                        type="text"
                                        value={novoNome}
                                        onChange={e => setNovoNome(e.target.value)}
                                    />
                                    <button onClick={salvarNome} disabled={salvando}>
                                        {salvando ? '...' : '✓'}
                                    </button>
                                    <button onClick={() => { setEditarNome(false); setNovoNome(perfil.nome); }}>✕</button>
                                </div>
                            ) : (
                                <h2 className="perfil-nome">
                                    {perfil?.nome}
                                    <button className="btn-edit-icon" onClick={() => setEditarNome(true)}>✏️</button>
                                </h2>
                            )}
                            <p className="perfil-email">{perfil?.email}</p>
                            <p className="perfil-desde">
                                Membro desde {new Date(perfil?.data_registo || perfil?.created_at).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                            </p>
                            <span className={`perfil-role ${perfil?.role}`}>
                                {perfil?.role === 'instrutor' ? 'Instrutor' : perfil?.role === 'admin' ? 'Admin' : 'Aluno'}
                            </span>
                        </div>
                    </div>

                    {/* Encomendas */}
                    <div className="perfil-secao">
                        <h3>As Minhas Encomendas</h3>
                        {encomendas.length > 0 ? (
                            <div className="encomendas-lista">
                                {encomendas.map(enc => (
                                    <div key={enc.id} className="encomenda-card">
                                        <div className="encomenda-info">
                                            <span className="encomenda-id">#{enc.id}</span>
                                            <span className="encomenda-data">
                                                {new Date(enc.created_at).toLocaleDateString('pt-PT')}
                                            </span>
                                        </div>
                                        <div className="encomenda-detalhes">
                                            <span>{enc.num_itens} {enc.num_itens === 1 ? 'item' : 'itens'}</span>
                                            <span className="encomenda-total">{enc.total?.toFixed(2)}€</span>
                                        </div>
                                        <span className={`encomenda-estado ${enc.estado}`}>{enc.estado}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <p style={{ color: '#999', marginBottom: '1rem' }}>Ainda não fizeste nenhuma encomenda.</p>
                                <Link href="/loja" className="btn btn-primary">Visitar a Loja</Link>
                            </div>
                        )}
                    </div>

                </div>
            </section>
        </>
    );
}
