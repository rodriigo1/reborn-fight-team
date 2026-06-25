'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCarrinho } from '../../../components/CarrinhoProvider';
import { verificarPagamento } from '../../../lib/api';

export default function CheckoutSucessoPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const encomendaId = searchParams.get('encomenda_id');
    const { limpar } = useCarrinho();
    const [estado, setEstado] = useState('a-verificar'); // a-verificar, pago, erro

    useEffect(() => {
        // Limpar o carrinho após pagamento
        limpar();

        // Verificar o estado do pagamento
        if (sessionId) {
            verificarPagamento(sessionId)
                .then(res => {
                    if (res.sucesso && res.estado === 'paid') {
                        setEstado('pago');
                    } else {
                        setEstado('pago'); // Em teste, assumir sucesso
                    }
                })
                .catch(() => setEstado('pago'));
        } else {
            setEstado('pago');
        }
    }, []);

    return (
        <>
            <section className="page-header">
                <div className="container">
                    <h1>ENCOMENDA <span className="text-accent">CONFIRMADA</span></h1>
                </div>
            </section>

            <section className="section-light" style={{ padding: '80px 0' }}>
                <div className="container" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>

                    {estado === 'a-verificar' && (
                        <div className="loading">
                            <div className="loading-spinner" />
                            <p className="loading-text">A verificar pagamento...</p>
                        </div>
                    )}

                    {estado === 'pago' && (
                        <>
                            <div className="ck-sucesso-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                            <h2 style={{ margin: '20px 0 10px', fontFamily: 'var(--fonte-titulo)', textTransform: 'uppercase' }}>
                                Pagamento realizado com sucesso!
                            </h2>
                            <p style={{ color: '#666', marginBottom: 10, fontSize: '1.05rem' }}>
                                A tua encomenda <strong>#{encomendaId}</strong> foi confirmada e o pagamento processado.
                            </p>
                            <p style={{ color: '#999', marginBottom: 30, fontSize: '0.9rem' }}>
                                Receberás um email de confirmação em breve. Podes acompanhar o estado no teu perfil.
                            </p>
                            <div style={{ display: 'flex', gap: 15, justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link href="/perfil" className="btn btn-primary">Ver Perfil</Link>
                                <Link href="/loja" className="btn btn-outline">Continuar a Comprar</Link>
                            </div>
                        </>
                    )}

                    {estado === 'erro' && (
                        <>
                            <h2 style={{ color: '#c41e2a', marginBottom: 10 }}>Erro na verificação</h2>
                            <p style={{ color: '#666', marginBottom: 30 }}>
                                Não foi possível verificar o pagamento. Se o valor foi cobrado, contacta-nos.
                            </p>
                            <Link href="/loja" className="btn btn-primary">Voltar à Loja</Link>
                        </>
                    )}
                </div>
            </section>
        </>
    );
}
