'use client';
import { useState } from 'react';
import Link from 'next/link';
import { registar, GOOGLE_LOGIN_URL } from '../../lib/api';

export default function RegistoPage() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');

        if (password !== confirmar) {
            setErro('As passwords não coincidem.');
            return;
        }
        if (password.length < 6) {
            setErro('A password deve ter pelo menos 6 caracteres.');
            return;
        }

        setLoading(true);
        try {
            const resposta = await registar(nome, email, password);
            if (resposta.sucesso) {
                setSucesso(true);
            } else {
                setErro(resposta.erro);
            }
        } catch (error) {
            setErro('Erro ao comunicar com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '0.8rem 1rem', border: '2px solid #e0e0e0',
        borderRadius: '6px', fontSize: '1rem', fontFamily: 'var(--fonte-corpo)',
        outline: 'none', transition: 'border-color 0.3s',
    };
    const labelStyle = {
        display: 'block', marginBottom: '0.4rem', fontWeight: 600,
        fontSize: '0.85rem', color: '#555',
    };

    return (
        <>
            <div className="page-header" style={{ paddingBottom: '2rem', minHeight: 'auto' }}>
                <div className="section-bg" style={{ backgroundImage: 'url(/images/hero-bg.png)' }} />
                <div className="container">
                    <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                        Criar <span className="highlight">Conta</span>
                    </h1>
                </div>
            </div>

            <section className="section-light" style={{ padding: '3rem 0 5rem' }}>
                <div className="container" style={{ maxWidth: '450px' }}>
                    {sucesso ? (
                        /* Mensagem de sucesso */
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
                            <h2 style={{ fontFamily: 'var(--fonte-titulo)', fontSize: '1.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                Verifica o teu <span style={{ color: 'var(--cor-vermelho)' }}>Email</span>
                            </h2>
                            <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '1.05rem' }}>
                                Enviámos um email de verificação para:
                            </p>
                            <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>{email}</p>
                            <p style={{ color: '#999', fontSize: '0.9rem' }}>
                                Clica no link do email para ativar a tua conta.
                                Depois podes fazer login.
                            </p>
                            <Link href="/login" className="btn btn-primario" style={{ marginTop: '2rem' }}>
                                Ir para Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Botão Google */}
                            <a href={GOOGLE_LOGIN_URL} className="btn btn-secundario"
                                style={{ width: '100%', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--cor-texto-escuro)', border: '2px solid #ddd', padding: '0.9rem' }}>
                                <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                                Registar com Google
                            </a>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0', color: '#ccc' }}>
                                <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
                                <span style={{ fontSize: '0.85rem', color: '#999' }}>ou</span>
                                <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
                            </div>

                            <form onSubmit={handleSubmit}>
                                {erro && (
                                    <div style={{ background: '#fce4ec', color: '#c41e2a', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                        {erro}
                                    </div>
                                )}

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={labelStyle}>Nome</label>
                                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} required
                                        placeholder="O teu nome" style={inputStyle}
                                        onFocus={e => e.target.style.borderColor = '#c41e2a'}
                                        onBlur={e => e.target.style.borderColor = '#e0e0e0'} />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={labelStyle}>Email</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                        placeholder="o-teu-email@gmail.com" style={inputStyle}
                                        onFocus={e => e.target.style.borderColor = '#c41e2a'}
                                        onBlur={e => e.target.style.borderColor = '#e0e0e0'} />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={labelStyle}>Password</label>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                                        placeholder="Mínimo 6 caracteres" style={inputStyle}
                                        onFocus={e => e.target.style.borderColor = '#c41e2a'}
                                        onBlur={e => e.target.style.borderColor = '#e0e0e0'} />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={labelStyle}>Confirmar Password</label>
                                    <input type="password" value={confirmar} onChange={e => setConfirmar(e.target.value)} required
                                        placeholder="Repete a password" style={inputStyle}
                                        onFocus={e => e.target.style.borderColor = '#c41e2a'}
                                        onBlur={e => e.target.style.borderColor = '#e0e0e0'} />
                                </div>

                                <button type="submit" className="btn btn-primario" disabled={loading}
                                    style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}>
                                    {loading ? 'A criar conta...' : 'Criar Conta'}
                                </button>
                            </form>

                            <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#999', fontSize: '0.9rem' }}>
                                Já tens conta?{' '}
                                <Link href="/login" style={{ color: 'var(--cor-vermelho)', fontWeight: 600 }}>Entrar</Link>
                            </p>
                        </>
                    )}
                </div>
            </section>
        </>
    );
}
