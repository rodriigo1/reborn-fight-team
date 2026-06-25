'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { login as apiLogin, GOOGLE_LOGIN_URL } from '../../lib/api';
import { useAuth } from '../../components/AuthProvider';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const { fazerLogin, utilizador } = useAuth();

    // Verificar se veio um token do Google OAuth (redirect)
    useEffect(() => {
        const token = searchParams.get('token');
        const nome = searchParams.get('nome');
        const erroGoogle = searchParams.get('erro');

        if (token && nome) {
            fazerLogin(token, { nome: decodeURIComponent(nome) });
            router.push('/');
        }
        if (erroGoogle === 'google') {
            setErro('Erro no login com Google. Tenta novamente.');
        }
    }, [searchParams]);

    // Se já está autenticado, redirecionar
    useEffect(() => {
        if (utilizador) router.push('/');
    }, [utilizador]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro(''); setLoading(true);

        try {
            const resposta = await apiLogin(email, password);
            if (resposta.sucesso) {
                fazerLogin(resposta.token, resposta.utilizador);
                router.push('/');
            } else {
                setErro(resposta.erro);
            }
        } catch (error) {
            setErro('Erro ao comunicar com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="page-header" style={{ paddingBottom: '2rem', minHeight: 'auto' }}>
                <div className="section-bg" style={{ backgroundImage: 'url(/images/hero-bg.png)' }} />
                <div className="container">
                    <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                        <span className="highlight">Entrar</span>
                    </h1>
                </div>
            </div>

            <section className="section-light" style={{ padding: '3rem 0 5rem' }}>
                <div className="container" style={{ maxWidth: '450px' }}>
                    {/* Botão Google */}
                    <a href={GOOGLE_LOGIN_URL} className="btn btn-secundario" id="btn-google"
                        style={{
                            width: '100%', justifyContent: 'center', marginBottom: '1.5rem',
                            color: 'var(--cor-texto-escuro)', border: '2px solid #ddd', padding: '0.9rem',
                        }}>
                        <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg>
                        Entrar com Google
                    </a>

                    {/* Separador */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0', color: '#ccc' }}>
                        <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
                        <span style={{ fontSize: '0.85rem', color: '#999' }}>ou</span>
                        <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit}>
                        {erro && (
                            <div style={{ background: '#fce4ec', color: '#c41e2a', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                {erro}
                            </div>
                        )}
                        {mensagem && (
                            <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                {mensagem}
                            </div>
                        )}

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                placeholder="o-teu-email@gmail.com"
                                style={{ width: '100%', padding: '0.8rem 1rem', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '1rem', fontFamily: 'var(--fonte-corpo)', outline: 'none', transition: 'border-color 0.3s' }}
                                onFocus={e => e.target.style.borderColor = '#c41e2a'}
                                onBlur={e => e.target.style.borderColor = '#e0e0e0'} />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                                placeholder="A tua password"
                                style={{ width: '100%', padding: '0.8rem 1rem', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '1rem', fontFamily: 'var(--fonte-corpo)', outline: 'none', transition: 'border-color 0.3s' }}
                                onFocus={e => e.target.style.borderColor = '#c41e2a'}
                                onBlur={e => e.target.style.borderColor = '#e0e0e0'} />
                        </div>

                        <button type="submit" className="btn btn-primario" disabled={loading}
                            style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}>
                            {loading ? 'A entrar...' : 'Entrar'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#999', fontSize: '0.9rem' }}>
                        Não tens conta?{' '}
                        <Link href="/registo" style={{ color: 'var(--cor-vermelho)', fontWeight: 600 }}>
                            Criar conta
                        </Link>
                    </p>
                </div>
            </section>
        </>
    );
}
