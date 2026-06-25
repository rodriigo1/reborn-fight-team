'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { verificarEmail } from '../../lib/api';

export default function VerificarPage() {
    const [estado, setEstado] = useState('loading'); // loading, sucesso, erro
    const [mensagem, setMensagem] = useState('');
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setEstado('erro');
            setMensagem('Link de verificação inválido.');
            return;
        }

        verificarEmail(token)
            .then(res => {
                if (res.sucesso) {
                    setEstado('sucesso');
                    setMensagem(res.mensagem);
                } else {
                    setEstado('erro');
                    setMensagem(res.erro);
                }
            })
            .catch(() => {
                setEstado('erro');
                setMensagem('Erro ao verificar o email.');
            });
    }, [searchParams]);

    return (
        <>
            <div className="page-header" style={{ paddingBottom: '2rem', minHeight: 'auto' }}>
                <div className="section-bg" style={{ backgroundImage: 'url(/images/hero-bg.png)' }} />
                <div className="container">
                    <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                        Verificação de <span className="highlight">Email</span>
                    </h1>
                </div>
            </div>

            <section className="section-light" style={{ padding: '4rem 0 6rem' }}>
                <div className="container" style={{ maxWidth: '500px', textAlign: 'center' }}>
                    {estado === 'loading' && (
                        <div className="loading">
                            <div className="loading-spinner"></div>
                            <span className="loading-text">A verificar o teu email...</span>
                        </div>
                    )}

                    {estado === 'sucesso' && (
                        <div>
                            <div style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--cor-vermelho)', fontFamily: 'var(--fonte-titulo)', fontWeight: 700 }}>OK</div>
                            <h2 style={{ fontFamily: 'var(--fonte-titulo)', fontSize: '1.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                Email <span style={{ color: 'var(--cor-vermelho)' }}>Verificado!</span>
                            </h2>
                            <p style={{ color: '#666', marginBottom: '2rem' }}>{mensagem}</p>
                            <Link href="/login" className="btn btn-primario">Fazer Login</Link>
                        </div>
                    )}

                    {estado === 'erro' && (
                        <div>
                            <div style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--cor-vermelho)', fontFamily: 'var(--fonte-titulo)', fontWeight: 700 }}>ERRO</div>
                            <h2 style={{ fontFamily: 'var(--fonte-titulo)', fontSize: '1.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
                                Erro na Verificação
                            </h2>
                            <p style={{ color: '#666', marginBottom: '2rem' }}>{mensagem}</p>
                            <Link href="/registo" className="btn btn-primario">Tentar Novamente</Link>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
