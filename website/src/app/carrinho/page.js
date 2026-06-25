'use client';
import Link from 'next/link';
import { useCarrinho } from '../../components/CarrinhoProvider';
import { useAuth } from '../../components/AuthProvider';

export default function CarrinhoPage() {
    const { itens, total, atualizarQuantidade, remover } = useCarrinho();
    const { utilizador } = useAuth();

    // Carrinho vazio
    if (itens.length === 0) {
        return (
            <>
                <section className="page-header">
                    <div className="container"><h1>CARRINHO</h1></div>
                </section>
                <section className="section-light" style={{ padding: '80px 0' }}>
                    <div className="container" style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#1a1a1a', marginBottom: '10px' }}>O teu carrinho está vazio</h2>
                        <p style={{ color: '#666', marginBottom: '30px' }}>Ainda não adicionaste nenhum produto.</p>
                        <Link href="/loja" className="btn btn-primary">Ver Loja</Link>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <section className="page-header">
                <div className="container"><h1>CARRINHO</h1></div>
            </section>

            <section className="section-light" style={{ paddingBottom: '80px' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>

                    {/* Lista de itens */}
                    <div className="carrinho-itens">
                        {itens.map(item => (
                            <div
                                key={`${item.id}_${item.cor || ''}_${item.tamanho || ''}`}
                                className="carrinho-item"
                            >
                                <div className="carrinho-item-info">
                                    <h3>{item.nome}</h3>

                                    {/* Cor e/ou Tamanho */}
                                    <div className="carrinho-item-detalhes">
                                        {item.cor && (
                                            <span className="carrinho-item-cor">
                                                <span
                                                    className="carrinho-item-cor-dot"
                                                    style={{ backgroundColor: item.corValor || '#ccc' }}
                                                />
                                                {item.cor}
                                            </span>
                                        )}
                                        {item.tamanho && (
                                            <span className="carrinho-item-tamanho">
                                                Tamanho: <strong>{item.tamanho}</strong>
                                            </span>
                                        )}
                                    </div>

                                    <p className="carrinho-item-preco">{item.preco?.toFixed(2)}€</p>
                                </div>

                                <div className="carrinho-item-acoes">
                                    <button onClick={() => atualizarQuantidade(item.id, item.quantidade - 1, item.cor, item.tamanho)}>−</button>
                                    <span>{item.quantidade}</span>
                                    <button onClick={() => atualizarQuantidade(item.id, item.quantidade + 1, item.cor, item.tamanho)}>+</button>
                                    <button className="btn-remover" onClick={() => remover(item.id, item.cor, item.tamanho)}>✕</button>
                                </div>

                                <div className="carrinho-item-subtotal">
                                    {(item.preco * item.quantidade).toFixed(2)}€
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="carrinho-total">
                        <span>Total:</span>
                        <span className="carrinho-total-valor">{total.toFixed(2)}€</span>
                    </div>

                    {/* Botões */}
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
                        {utilizador ? (
                            <Link href="/checkout" className="btn btn-primary">
                                Finalizar Compra
                            </Link>
                        ) : (
                            <Link href="/login" className="btn btn-primary">
                                Fazer Login para Comprar
                            </Link>
                        )}
                        <Link href="/loja" className="btn btn-outline">Continuar a Comprar</Link>
                    </div>

                </div>
            </section>
        </>
    );
}
