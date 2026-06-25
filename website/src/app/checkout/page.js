'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCarrinho } from '../../components/CarrinhoProvider';
import { criarSessaoPagamento } from '../../lib/api';
import { useAuth } from '../../components/AuthProvider';

const ENVIO_OPCOES = [
    { id: 'standard', nome: 'Entrega Standard', preco: 3.99, prazo: '5-7 dias úteis' },
    { id: 'expresso', nome: 'Entrega Expresso', preco: 7.99, prazo: '1-2 dias úteis' },
    { id: 'loja', nome: 'Levantamento em Loja', preco: 0, prazo: 'Disponível em 24h' },
];

const PASSOS = ['Dados', 'Entrega', 'Pagamento'];

export default function CheckoutPage() {
    const { itens, total, limpar } = useCarrinho();
    const { utilizador } = useAuth();
    const [passoAtual, setPassoAtual] = useState(0);
    const [erro, setErro] = useState('');
    const [errosCampos, setErrosCampos] = useState({});
    const [loading, setLoading] = useState(false);

    const [dados, setDados] = useState({
        nome: '', email: '', telefone: '',
        rua: '', numero: '', andar: '', codigoPostal: '', cidade: '', pais: 'Portugal',
        fatIgual: true,
        fatRua: '', fatNumero: '', fatAndar: '', fatCodigoPostal: '', fatCidade: '', fatPais: 'Portugal',
        envio: 'standard',
        aceitaTermos: false, aceitaPrivacidade: false,
    });

    useEffect(() => {
        if (utilizador) {
            setDados(prev => ({
                ...prev,
                nome: prev.nome || utilizador.nome || '',
                email: prev.email || utilizador.email || '',
            }));
        }
    }, [utilizador]);

    if (!utilizador) {
        return (
            <>
                <section className="page-header"><div className="container"><h1>CHECKOUT</h1></div></section>
                <section className="section-light" style={{ padding: '80px 0' }}>
                    <div className="container" style={{ textAlign: 'center' }}>
                        <h2>Precisas de fazer login</h2>
                        <p style={{ color: '#666', margin: '10px 0 30px' }}>Faz login para continuar com a compra.</p>
                        <Link href="/login" className="btn btn-primary">Fazer Login</Link>
                    </div>
                </section>
            </>
        );
    }

    if (itens.length === 0) {
        return (
            <>
                <section className="page-header"><div className="container"><h1>CHECKOUT</h1></div></section>
                <section className="section-light" style={{ padding: '80px 0' }}>
                    <div className="container" style={{ textAlign: 'center' }}>
                        <h2>Carrinho vazio</h2>
                        <p style={{ color: '#666', margin: '10px 0 30px' }}>Adiciona produtos antes de fazer checkout.</p>
                        <Link href="/loja" className="btn btn-primary">Ver Loja</Link>
                    </div>
                </section>
            </>
        );
    }

    const envioSelecionado = ENVIO_OPCOES.find(e => e.id === dados.envio);
    const subtotal = total;
    const custoEnvio = envioSelecionado?.preco || 0;
    const iva = (subtotal + custoEnvio) * 0.23;
    const totalFinal = subtotal + custoEnvio + iva;

    function atualizar(campo, valor) {
        setDados(prev => ({ ...prev, [campo]: valor }));
        if (errosCampos[campo]) setErrosCampos(prev => { const n = { ...prev }; delete n[campo]; return n; });
    }

    function validarPasso() {
        const errs = {};
        if (passoAtual === 0) {
            if (!dados.nome.trim()) errs.nome = 'Nome obrigatório';
            if (!dados.email.trim() || !/\S+@\S+\.\S+/.test(dados.email)) errs.email = 'Email inválido';
            if (!dados.telefone.trim() || dados.telefone.replace(/\D/g, '').length < 9) errs.telefone = 'Telefone inválido';
        }
        if (passoAtual === 1) {
            if (!dados.rua.trim()) errs.rua = 'Rua obrigatória';
            if (!dados.numero.trim()) errs.numero = 'Número obrigatório';
            if (!dados.codigoPostal.trim()) errs.codigoPostal = 'Código postal obrigatório';
            if (!dados.cidade.trim()) errs.cidade = 'Cidade obrigatória';
            if (!dados.fatIgual) {
                if (!dados.fatRua.trim()) errs.fatRua = 'Rua obrigatória';
                if (!dados.fatNumero.trim()) errs.fatNumero = 'Número obrigatório';
                if (!dados.fatCodigoPostal.trim()) errs.fatCodigoPostal = 'Código postal obrigatório';
                if (!dados.fatCidade.trim()) errs.fatCidade = 'Cidade obrigatória';
            }
        }
        if (passoAtual === 2) {
            if (!dados.aceitaTermos) errs.aceitaTermos = 'Obrigatório';
            if (!dados.aceitaPrivacidade) errs.aceitaPrivacidade = 'Obrigatório';
        }
        setErrosCampos(errs);
        return Object.keys(errs).length === 0;
    }

    function avancar() {
        if (validarPasso()) { setErro(''); setPassoAtual(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    }

    function voltar() {
        setPassoAtual(p => p - 1); setErro(''); window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function pagarComStripe() {
        if (!validarPasso()) return;
        setLoading(true); setErro('');

        const moradaCompleta = `${dados.rua}, ${dados.numero}${dados.andar ? ', ' + dados.andar : ''}, ${dados.codigoPostal} ${dados.cidade}, ${dados.pais}`;
        const itensEnviar = itens.map(i => ({ id: i.id, nome: i.cor ? `${i.nome} (${i.cor})` : i.nome, quantidade: i.quantidade, preco: i.preco }));

        try {
            const res = await criarSessaoPagamento(itensEnviar, moradaCompleta, dados.telefone, dados.envio);
            if (res.sucesso && res.url) {
                // Guardar dados para após pagamento
                localStorage.setItem('checkout_envio', dados.envio);
                // Redirecionar para a página de pagamento do Stripe
                window.location.href = res.url;
            } else {
                setErro(res.erro || 'Erro ao processar pagamento.');
                setLoading(false);
            }
        } catch {
            setErro('Erro de ligação ao servidor.');
            setLoading(false);
        }
    }

    const renderCampo = (label, campo, tipo = 'text', placeholder = '', obrigatorio = true) => (
        <div className={`ck-field ${errosCampos[campo] ? 'ck-field-erro' : ''}`}>
            <label>{label}{obrigatorio && <span className="ck-req">*</span>}</label>
            <input type={tipo} placeholder={placeholder} value={dados[campo]}
                onChange={e => atualizar(campo, e.target.value)} />
            {errosCampos[campo] && <span className="ck-field-msg">{errosCampos[campo]}</span>}
        </div>
    );

    return (
        <>
            <section className="page-header"><div className="container"><h1>CHECKOUT</h1><p>Finaliza a tua compra em segurança</p></div></section>

            <section className="section-light-alt" style={{ paddingBottom: 80 }}>
                <div className="container">
                    {/* Progress Bar */}
                    <div className="ck-progress">
                        {PASSOS.map((p, i) => (
                            <div key={i} className={`ck-progress-step ${i <= passoAtual ? 'ck-step-active' : ''} ${i < passoAtual ? 'ck-step-done' : ''}`}>
                                <div className="ck-step-circle">{i < passoAtual ? '✓' : i + 1}</div>
                                <span className="ck-step-label">{p}</span>
                                {i < PASSOS.length - 1 && <div className="ck-step-line" />}
                            </div>
                        ))}
                    </div>

                    <div className="ck-layout">
                        <div className="ck-form-area">
                            {erro && <div className="auth-erro">{erro}</div>}

                            {/* PASSO 0: Dados do Cliente */}
                            {passoAtual === 0 && (
                                <div className="ck-section">
                                    <div className="ck-section-header">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        <h2>Dados do Cliente</h2>
                                    </div>
                                    {renderCampo('Nome Completo', 'nome', 'text', 'O teu nome completo')}
                                    {renderCampo('Email', 'email', 'email', 'email@exemplo.com')}
                                    {renderCampo('Telemóvel', 'telefone', 'tel', '912 345 678')}
                                </div>
                            )}

                            {/* PASSO 1: Moradas + Envio */}
                            {passoAtual === 1 && (
                                <>
                                    <div className="ck-section">
                                        <div className="ck-section-header">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                            <h2>Morada de Entrega</h2>
                                        </div>
                                        <div className="ck-row">{renderCampo('Rua / Avenida', 'rua', 'text', 'Rua Exemplo')}<div className="ck-col-sm">{renderCampo('Nº Porta', 'numero', 'text', '123')}</div></div>
                                        <div className="ck-row"><div className="ck-col-sm">{renderCampo('Andar / Apt.', 'andar', 'text', '2º Esq.', false)}</div>{renderCampo('Código Postal', 'codigoPostal', 'text', '1000-001')}</div>
                                        <div className="ck-row">{renderCampo('Cidade', 'cidade', 'text', 'Lisboa')}{renderCampo('País', 'pais', 'text', 'Portugal')}</div>
                                    </div>

                                    <div className="ck-section">
                                        <div className="ck-section-header">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>
                                            <h2>Morada de Faturação</h2>
                                        </div>
                                        <label className="ck-checkbox-label">
                                            <input type="checkbox" checked={dados.fatIgual} onChange={e => atualizar('fatIgual', e.target.checked)} />
                                            <span className="ck-checkmark" />
                                            A morada de faturação é igual à morada de entrega
                                        </label>
                                        {!dados.fatIgual && (
                                            <div style={{ marginTop: 16 }}>
                                                <div className="ck-row">{renderCampo('Rua / Avenida', 'fatRua', 'text', 'Rua Exemplo')}<div className="ck-col-sm">{renderCampo('Nº Porta', 'fatNumero', 'text', '123')}</div></div>
                                                <div className="ck-row"><div className="ck-col-sm">{renderCampo('Andar / Apt.', 'fatAndar', 'text', '2º Esq.', false)}</div>{renderCampo('Código Postal', 'fatCodigoPostal', 'text', '1000-001')}</div>
                                                <div className="ck-row">{renderCampo('Cidade', 'fatCidade', 'text', 'Lisboa')}{renderCampo('País', 'fatPais', 'text', 'Portugal')}</div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="ck-section">
                                        <div className="ck-section-header">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                                            <h2>Método de Envio</h2>
                                        </div>
                                        <div className="ck-envio-opcoes">
                                            {ENVIO_OPCOES.map(op => (
                                                <label key={op.id} className={`ck-envio-card ${dados.envio === op.id ? 'ck-envio-sel' : ''}`}>
                                                    <input type="radio" name="envio" value={op.id} checked={dados.envio === op.id} onChange={() => atualizar('envio', op.id)} />
                                                    <div className="ck-envio-info">
                                                        <strong>{op.nome}</strong>
                                                        <span className="ck-envio-prazo">{op.prazo}</span>
                                                    </div>
                                                    <span className="ck-envio-preco">{op.preco === 0 ? 'Grátis' : `${op.preco.toFixed(2)}€`}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* PASSO 2: Revisão + Termos + Pagar */}
                            {passoAtual === 2 && (
                                <div className="ck-section">
                                    <div className="ck-section-header">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                                        <h2>Revisão e Pagamento</h2>
                                    </div>

                                    <div className="ck-confirm-grid">
                                        <div className="ck-confirm-block">
                                            <h4>Dados Pessoais</h4>
                                            <p>{dados.nome}</p><p>{dados.email}</p><p>{dados.telefone}</p>
                                        </div>
                                        <div className="ck-confirm-block">
                                            <h4>Morada de Entrega</h4>
                                            <p>{dados.rua}, {dados.numero}{dados.andar ? ', ' + dados.andar : ''}</p>
                                            <p>{dados.codigoPostal} {dados.cidade}</p><p>{dados.pais}</p>
                                        </div>
                                        <div className="ck-confirm-block">
                                            <h4>Envio</h4>
                                            <p>{envioSelecionado?.nome}</p><p className="ck-text-muted">{envioSelecionado?.prazo}</p>
                                        </div>
                                        <div className="ck-confirm-block">
                                            <h4>Pagamento</h4>
                                            <p>Stripe Checkout</p>
                                            <p className="ck-text-muted">Cartão de Crédito/Débito</p>
                                        </div>
                                    </div>

                                    <div className="ck-stripe-info">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        <div>
                                            <strong>Pagamento seguro via Stripe</strong>
                                            <p>Serás redirecionado para a página segura do Stripe para inserir os dados de pagamento. Os teus dados bancários nunca passam pelo nosso servidor.</p>
                                        </div>
                                    </div>

                                    <div className="ck-termos">
                                        <label className={`ck-checkbox-label ${errosCampos.aceitaTermos ? 'ck-checkbox-erro' : ''}`}>
                                            <input type="checkbox" checked={dados.aceitaTermos} onChange={e => atualizar('aceitaTermos', e.target.checked)} />
                                            <span className="ck-checkmark" />
                                            Aceito os <a href="#" style={{ color: 'var(--cor-vermelho)' }}>Termos e Condições</a>
                                        </label>
                                        <label className={`ck-checkbox-label ${errosCampos.aceitaPrivacidade ? 'ck-checkbox-erro' : ''}`}>
                                            <input type="checkbox" checked={dados.aceitaPrivacidade} onChange={e => atualizar('aceitaPrivacidade', e.target.checked)} />
                                            <span className="ck-checkmark" />
                                            Aceito a <a href="#" style={{ color: 'var(--cor-vermelho)' }}>Política de Privacidade</a>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="ck-nav-btns">
                                {passoAtual > 0 && <button className="btn btn-outline" onClick={voltar}>Voltar</button>}
                                {passoAtual < 2 ? (
                                    <button className="btn btn-primary" onClick={avancar}>Continuar</button>
                                ) : (
                                    <button className="ck-btn-finalizar" onClick={pagarComStripe} disabled={loading}>
                                        {loading ? (
                                            <><span className="ck-spinner" /> A redirecionar...</>
                                        ) : (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                                Pagar {totalFinal.toFixed(2)}€ com Stripe
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="ck-sidebar">
                            <div className="ck-sidebar-card">
                                <h3>Resumo da Encomenda</h3>
                                <div className="ck-sidebar-itens">
                                    {itens.map(item => (
                                        <div key={`${item.id}_${item.cor || ''}`} className="ck-sidebar-item">
                                            <div>
                                                <span className="ck-sidebar-item-nome">
                                                    {item.nome}
                                                    {item.cor && (
                                                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginTop: '2px' }}>
                                                            <span style={{
                                                                display: 'inline-block', width: '8px', height: '8px',
                                                                borderRadius: '50%', backgroundColor: item.corValor || '#ccc',
                                                                marginRight: '4px', border: '1px solid #ccc', verticalAlign: 'middle'
                                                            }} />
                                                            {item.cor}
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="ck-sidebar-item-qty">x{item.quantidade}</span>
                                            </div>
                                            <span className="ck-sidebar-item-preco">{(item.preco * item.quantidade).toFixed(2)}€</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="ck-sidebar-totais">
                                    <div className="ck-sidebar-linha"><span>Subtotal</span><span>{subtotal.toFixed(2)}€</span></div>
                                    <div className="ck-sidebar-linha"><span>Envio</span><span>{custoEnvio === 0 ? 'Grátis' : `${custoEnvio.toFixed(2)}€`}</span></div>
                                    <div className="ck-sidebar-linha ck-text-muted"><span>IVA (23%)</span><span>{iva.toFixed(2)}€</span></div>
                                    <div className="ck-sidebar-total"><span>Total</span><span>{totalFinal.toFixed(2)}€</span></div>
                                </div>
                            </div>
                            <div className="ck-sidebar-seguranca">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                <span>Compra 100% segura via Stripe</span>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </>
    );
}
