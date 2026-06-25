'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function CheckoutCanceladoPage() {
    const searchParams = useSearchParams();
    const encomendaId = searchParams.get('encomenda_id');

    return (
        <>
            <section className="page-header">
                <div className="container">
                    <h1>PAGAMENTO <span className="text-accent">CANCELADO</span></h1>
                </div>
            </section>

            <section className="section-light" style={{ padding: '80px 0' }}>
                <div className="container" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
                    <div style={{
                        width: 80, height: 80, borderRadius: '50%',
                        background: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px'
                    }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e65100" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <h2 style={{ marginBottom: 10, fontFamily: 'var(--fonte-titulo)', textTransform: 'uppercase' }}>
                        Pagamento cancelado
                    </h2>
                    <p style={{ color: '#666', marginBottom: 30, fontSize: '1.05rem' }}>
                        O pagamento foi cancelado. Nenhum valor foi cobrado.
                        {encomendaId && <> A encomenda #{encomendaId} ficou pendente.</>}
                    </p>
                    <div style={{ display: 'flex', gap: 15, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/checkout" className="btn btn-primary">Tentar Novamente</Link>
                        <Link href="/loja" className="btn btn-outline">Voltar à Loja</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
